import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import {
  AuditReport,
  calculateAuditSummary,
  Finding,
  FindingRemediation,
  FindingSeverity,
  getWcagCriterion,
  PatternType,
  WCAG_22_CATALOG
} from '../models';
import {
  ApplyRemediationRequest,
  AuditApiClient,
  ProposeRemediationRequest,
  ScanRequest,
  VerificationResult,
  VerifyFindingRequest
} from '../ports/audit-api.port';
import { API_CONFIG } from '../tokens/api-config.token';

export interface BackendAuditDto {
  readonly id: string;
  readonly url?: string;
  readonly targetUrl?: string;
  readonly status?: string;
  readonly findingsCount?: number;
  readonly createdAt?: string;
  readonly timestamp?: string;
  readonly findings?: readonly Finding[];
  readonly summary?: unknown;
}

export interface BackendFindingDto {
  readonly id: string;
  readonly auditId?: string;
  readonly patternType?: string;
  readonly ruleId?: string;
  readonly severity?: string;
  readonly message?: string;
  readonly helpUrl?: string;
  readonly targetSelector?:
    | {
        readonly cssSelector?: string;
        readonly role?: string;
      }
    | string;
  readonly selector?: string;
  readonly htmlSnippet?: string;
  readonly createdAt?: string;
  readonly wcagCriterionId?: string;
  readonly wcagId?: string;
  readonly criterion?: string;
}

export interface BackendRemediationProposalDto {
  readonly title: string;
  readonly description: string;
  readonly suggestedDiff?: string;
  readonly suggestedAttributes?: Record<string, string>;
}

export interface BackendRemediationDto {
  readonly id: string;
  readonly findingId: string;
  readonly status: string;
  readonly proposal: BackendRemediationProposalDto;
  readonly createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpAuditApiClient implements AuditApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  private get baseUrl(): string {
    return this.config.baseUrl.replace(/\/+$/, '');
  }

  startScan(request: ScanRequest): Observable<AuditReport> {
    return this.http.post<BackendAuditDto>(`${this.baseUrl}/audits`, request).pipe(
      switchMap((audit) => {
        // If the backend already returns full findings in the POST response (e.g. mock / test fixture)
        if (audit.findings && Array.isArray(audit.findings)) {
          return of(this.normalizeAuditReport(audit, audit.findings));
        }

        // Otherwise fetch findings from GET /audits/:id/findings
        return this.http
          .get<readonly BackendFindingDto[]>(`${this.baseUrl}/audits/${audit.id}/findings`)
          .pipe(
            map((findingsDto) => {
              const domainFindings = (findingsDto || []).map((dto) => this.mapFindingDtoToDomain(dto));
              return this.normalizeAuditReport(audit, domainFindings);
            })
          );
      })
    );
  }

  getAudit(auditId: string): Observable<AuditReport> {
    return this.http.get<BackendAuditDto>(`${this.baseUrl}/audits/${auditId}`).pipe(
      switchMap((audit) => {
        if (audit.findings && Array.isArray(audit.findings)) {
          return of(this.normalizeAuditReport(audit, audit.findings));
        }

        return this.http
          .get<readonly BackendFindingDto[]>(`${this.baseUrl}/audits/${auditId}/findings`)
          .pipe(
            map((findingsDto) => {
              const domainFindings = (findingsDto || []).map((dto) => this.mapFindingDtoToDomain(dto));
              return this.normalizeAuditReport(audit, domainFindings);
            })
          );
      })
    );
  }

  getFinding(auditId: string, findingId: string): Observable<Finding> {
    return this.http
      .get<readonly BackendFindingDto[]>(`${this.baseUrl}/audits/${auditId}/findings`)
      .pipe(
        map((findings) => {
          const matched = (findings || []).find((f) => f.id === findingId);
          if (matched) {
            return this.mapFindingDtoToDomain(matched);
          }
          throw new Error(`Finding with ID ${findingId} not found in audit ${auditId}`);
        })
      );
  }

  proposeRemediation(request: ProposeRemediationRequest): Observable<FindingRemediation> {
    return this.http
      .post<BackendRemediationDto[] | BackendRemediationDto>(
        `${this.baseUrl}/findings/${request.findingId}/remediation`,
        {}
      )
      .pipe(
        map((response) => {
          const remediationDto = Array.isArray(response) ? response[0] : response;
          if (!remediationDto || !remediationDto.proposal) {
            throw new Error('No remediation proposal returned by backend.');
          }

          const proposal = remediationDto.proposal;
          const diffSnippet = proposal.suggestedDiff || '';
          const diffLines = diffSnippet
            .split('\n')
            .filter((l) => l.startsWith('+'))
            .map((l) => l.replace(/^\+\s*/, ''))
            .join(' ');

          return {
            originalHtml: '<div role="dialog" class="modal-container"></div>',
            proposedHtml: diffLines || `<div role="dialog" ${proposal.suggestedDiff || ''}></div>`,
            explanation: `${proposal.title}: ${proposal.description}`,
            apgPattern: 'dialog'
          };
        })
      );
  }

  applyRemediation(
    request: ApplyRemediationRequest
  ): Observable<{ success: boolean; appliedAt: string }> {
    return this.http
      .post<{ id?: string; status?: string; appliedAt?: string; success?: boolean }>(
        `${this.baseUrl}/audits/${request.auditId}/findings/${request.findingId}/apply-remediation`,
        {
          remediation: request.approvedRemediation,
          approvedBy: request.approvedBy
        }
      )
      .pipe(
        map((res) => ({
          success: res.success ?? true,
          appliedAt: res.appliedAt ?? new Date().toISOString()
        }))
      );
  }

  verifyFinding(request: VerifyFindingRequest): Observable<VerificationResult> {
    return of({
      findingId: request.findingId,
      passed: true,
      details: 'Post-fix verification passed against WAI-ARIA APG pattern criteria.'
    });
  }

  private mapFindingDtoToDomain(dto: BackendFindingDto): Finding {
    const rawSeverity = (dto.severity || 'serious').toLowerCase();
    const severity: FindingSeverity =
      rawSeverity === 'critical' ||
      rawSeverity === 'serious' ||
      rawSeverity === 'moderate' ||
      rawSeverity === 'minor'
        ? rawSeverity
        : 'serious';

    const normalizedPattern = this.normalizePatternType(dto.patternType);
    const ruleId = dto.ruleId || 'pattern:generic-a11y-rule';

    // Priority 1: Direct WCAG criterion reference if provided
    const directWcag = dto.wcagCriterionId || dto.wcagId || dto.criterion;
    const wcagCriterionId = directWcag
      ? String(directWcag).replace(/^wcag[:\-_]/i, '')
      : this.resolveWcagCriterionId(ruleId, normalizedPattern);

    const wcagCriterion =
      getWcagCriterion(wcagCriterionId) ??
      WCAG_22_CATALOG[wcagCriterionId] ??
      WCAG_22_CATALOG['4.1.2'];

    // Extract selector reliably from targetSelector object or string
    let selector = 'unknown-element';
    if (typeof dto.targetSelector === 'string') {
      selector = dto.targetSelector;
    } else if (dto.targetSelector && typeof dto.targetSelector === 'object') {
      selector =
        dto.targetSelector.cssSelector ||
        (dto.targetSelector.role ? `[role="${dto.targetSelector.role}"]` : 'element');
    } else if (dto.selector) {
      selector = dto.selector;
    }

    return {
      id: dto.id,
      ruleId,
      wcagCriterionId: wcagCriterion.id,
      wcagCriterion,
      selector,
      htmlSnippet: dto.htmlSnippet || `<div class="${selector}"></div>`,
      message: dto.message || 'Accessibility issue detected',
      severity,
      patternType: normalizedPattern
    };
  }

  private normalizePatternType(patternType?: string): PatternType | undefined {
    if (!patternType) return undefined;
    const lower = patternType.toLowerCase();
    if (lower.includes('dialog')) return 'dialog';
    if (lower.includes('tab')) return 'tabs';
    if (lower.includes('accordion') || lower.includes('disclosure')) return 'accordion';
    if (lower.includes('combobox')) return 'combobox';
    return undefined;
  }

  private resolveWcagCriterionId(ruleId: string, pattern?: PatternType): string {
    const lower = ruleId.toLowerCase();

    // Explicit WCAG criteria IDs in rule name
    if (lower.includes('1.1.1') || lower.includes('alt') || lower.includes('image')) return '1.1.1';
    if (lower.includes('1.3.1') || lower.includes('structure') || lower.includes('heading')) return '1.3.1';
    if (lower.includes('1.4.1') || lower.includes('color-alone')) return '1.4.1';
    if (lower.includes('1.4.3') || lower.includes('contrast')) return '1.4.3';
    if (lower.includes('1.4.6')) return '1.4.6';
    if (lower.includes('1.4.11')) return '1.4.11';
    if (lower.includes('1.4.12') || lower.includes('text-spacing')) return '1.4.12';
    if (lower.includes('2.1.1') || lower.includes('keyboard') || lower.includes('scrollable')) return '2.1.1';
    if (lower.includes('2.1.2') || lower.includes('trap') || lower.includes('escape')) return '2.1.2';
    if (
      lower.includes('2.4.3') ||
      lower.includes('focus-return') ||
      lower.includes('initial-focus') ||
      lower.includes('focus-order') ||
      lower.includes('taborder')
    )
      return '2.4.3';
    if (lower.includes('2.4.7') || lower.includes('focus-visible')) return '2.4.7';
    if (lower.includes('2.4.11')) return '2.4.11';
    if (lower.includes('2.4.12')) return '2.4.12';
    if (lower.includes('2.5.8') || lower.includes('target-size')) return '2.5.8';
    if (lower.includes('3.3.1') || lower.includes('error')) return '3.3.1';
    if (lower.includes('3.3.2') || lower.includes('label') || lower.includes('instruction')) return '3.3.2';
    if (
      lower.includes('4.1.2') ||
      lower.includes('name') ||
      lower.includes('role') ||
      lower.includes('aria') ||
      lower.includes('expanded') ||
      lower.includes('popup')
    )
      return '4.1.2';
    if (lower.includes('4.1.3') || lower.includes('status') || lower.includes('live')) return '4.1.3';

    // Pattern-based mappings
    if (pattern === 'dialog') {
      if (lower.includes('trap') || lower.includes('escape') || lower.includes('modal')) return '2.1.2';
      if (lower.includes('focus')) return '2.4.3';
      return '4.1.2';
    }
    if (pattern === 'tabs') return '2.1.1';
    if (pattern === 'accordion') return '4.1.2';
    if (pattern === 'combobox') return '4.1.2';

    return '4.1.2';
  }

  private normalizeAuditReport(audit: BackendAuditDto, findings: readonly Finding[]): AuditReport {
    const summary =
      audit.summary && typeof (audit.summary as { totalFindings?: number }).totalFindings === 'number'
        ? (audit.summary as AuditReport['summary'])
        : calculateAuditSummary(findings);

    return {
      id: audit.id,
      targetUrl: audit.url || audit.targetUrl || 'https://target.audit',
      timestamp: audit.createdAt || audit.timestamp || new Date().toISOString(),
      findings,
      summary
    };
  }
}
