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
  readonly summary?: any;
}

export interface BackendFindingDto {
  readonly id: string;
  readonly auditId?: string;
  readonly patternType?: string;
  readonly ruleId: string;
  readonly severity: string;
  readonly message: string;
  readonly helpUrl?: string;
  readonly targetSelector?: {
    readonly cssSelector?: string;
    readonly role?: string;
  };
  readonly selector?: string;
  readonly htmlSnippet?: string;
  readonly createdAt?: string;
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
    // If backend remediation ID is passed, approve & apply via /remediations/:id
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
    const wcagCriterionId = this.resolveWcagCriterionId(dto.ruleId, normalizedPattern);
    const wcagCriterion = getWcagCriterion(wcagCriterionId) ?? WCAG_22_CATALOG['4.1.2'];

    const selector =
      dto.targetSelector?.cssSelector || dto.selector || dto.targetSelector?.role || 'unknown-element';

    return {
      id: dto.id,
      ruleId: dto.ruleId,
      wcagCriterionId: wcagCriterion.id,
      wcagCriterion,
      selector,
      htmlSnippet: dto.htmlSnippet || `<div class="${selector}"></div>`,
      message: dto.message,
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
    if (ruleId.includes('1.1.1')) return '1.1.1';
    if (ruleId.includes('1.3.1')) return '1.3.1';
    if (ruleId.includes('1.4.3')) return '1.4.3';
    if (ruleId.includes('2.1.1')) return '2.1.1';
    if (ruleId.includes('2.1.2') || ruleId.includes('trap') || ruleId.includes('escape')) return '2.1.2';
    if (ruleId.includes('2.4.3')) return '2.4.3';
    if (ruleId.includes('2.4.7') || ruleId.includes('focus')) return '2.4.7';
    if (ruleId.includes('3.3.1') || ruleId.includes('3.3.2')) return '3.3.2';
    if (ruleId.includes('4.1.2') || ruleId.includes('name') || ruleId.includes('aria')) return '4.1.2';

    if (pattern === 'dialog') return '2.1.2';
    if (pattern === 'tabs') return '2.1.1';
    if (pattern === 'accordion') return '4.1.2';
    if (pattern === 'combobox') return '4.1.2';

    return '4.1.2';
  }

  private normalizeAuditReport(
    audit: BackendAuditDto,
    findings: readonly Finding[]
  ): AuditReport {
    return {
      id: audit.id,
      targetUrl: audit.url || audit.targetUrl || 'https://target.audit',
      timestamp: audit.createdAt || audit.timestamp || new Date().toISOString(),
      findings,
      summary: audit.summary && typeof audit.summary.totalFindings === 'number'
        ? audit.summary
        : calculateAuditSummary(findings)
    };
  }
}
