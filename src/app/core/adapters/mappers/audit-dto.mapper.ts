import {
  AuditReport,
  calculateAuditSummary,
  Finding,
  FindingSeverity,
  getWcagCriterion,
  PatternType,
  WCAG_22_CATALOG
} from '../../models';
import { BackendAuditDto, BackendFindingDto } from '../dto/backend-audit.dto';

/**
 * Encapsulates bidirectional transformation between Backend DTOs and Domain Models
 */
export class AuditDtoMapper {
  static extractFindingsArray(raw: unknown): readonly BackendFindingDto[] {
    if (Array.isArray(raw)) return raw as BackendFindingDto[];
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj['findings'])) return obj['findings'] as BackendFindingDto[];
      if (Array.isArray(obj['data'])) return obj['data'] as BackendFindingDto[];
      if (Array.isArray(obj['items'])) return obj['items'] as BackendFindingDto[];
      if (Array.isArray(obj['violations'])) return obj['violations'] as BackendFindingDto[];
    }
    return [];
  }

  static toDomainReport(audit: BackendAuditDto, findings: readonly Finding[]): AuditReport {
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

  static toDomainFinding(dto: BackendFindingDto): Finding {
    const rawSeverity = (dto.severity || 'serious').toLowerCase();
    const severity: FindingSeverity =
      rawSeverity === 'critical' ||
      rawSeverity === 'serious' ||
      rawSeverity === 'moderate' ||
      rawSeverity === 'minor'
        ? rawSeverity
        : 'serious';

    const normalizedPattern = this.normalizePatternType(dto.patternType);
    const ruleId = dto.ruleId || 'pattern:dialog-accessible-name';

    const directWcag = dto.wcagCriterionId || dto.wcagId || dto.criterion;
    const wcagCriterionId = directWcag
      ? String(directWcag).replace(/^wcag[:\-_]/i, '')
      : this.resolveWcagCriterionId(ruleId, normalizedPattern);

    const wcagCriterion =
      getWcagCriterion(wcagCriterionId) ??
      WCAG_22_CATALOG[wcagCriterionId] ??
      WCAG_22_CATALOG['4.1.2'];

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

  static normalizePatternType(patternType?: string): PatternType | undefined {
    if (!patternType) return undefined;
    const lower = patternType.toLowerCase();
    if (lower.includes('alert_dialog') || lower.includes('alertdialog')) return 'alert_dialog';
    if (lower.includes('dialog')) return 'dialog';
    if (lower.includes('tab')) return 'tabs';
    if (lower.includes('disclosure')) return 'disclosure';
    if (lower.includes('combobox')) return 'combobox';
    if (lower.includes('menu_button') || lower.includes('menubutton')) return 'menu_button';
    if (lower.includes('breadcrumb')) return 'breadcrumb';
    if (lower.includes('tooltip')) return 'tooltip';
    if (lower.includes('accordion')) return 'accordion';
    return undefined;
  }

  static resolveWcagCriterionId(ruleId: string, pattern?: PatternType): string {
    const lower = ruleId.toLowerCase();

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
}
