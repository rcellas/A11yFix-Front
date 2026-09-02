import { Finding } from './finding.model';
import { FindingSeverity } from './severity.model';

export interface AuditSummary {
  readonly totalFindings: number;
  readonly criticalCount: number;
  readonly seriousCount: number;
  readonly moderateCount: number;
  readonly minorCount: number;
  readonly levelACount: number;
  readonly levelAACount: number;
  readonly levelAAACount: number;
}

export interface AuditReport {
  readonly id: string;
  readonly targetUrl: string;
  readonly timestamp: string;
  readonly findings: readonly Finding[];
  readonly summary: AuditSummary;
}

/**
 * Pure domain function to compute an AuditSummary from findings
 */
export function calculateAuditSummary(findings: readonly Finding[]): AuditSummary {
  let criticalCount = 0;
  let seriousCount = 0;
  let moderateCount = 0;
  let minorCount = 0;
  let levelACount = 0;
  let levelAACount = 0;
  let levelAAACount = 0;

  for (const finding of findings) {
    // Severity breakdown
    switch (finding.severity) {
      case 'critical':
        criticalCount++;
        break;
      case 'serious':
        seriousCount++;
        break;
      case 'moderate':
        moderateCount++;
        break;
      case 'minor':
        minorCount++;
        break;
    }

    // WCAG Level breakdown
    const level = finding.wcagCriterion?.level;
    if (level === 'A') levelACount++;
    else if (level === 'AA') levelAACount++;
    else if (level === 'AAA') levelAAACount++;
  }

  return {
    totalFindings: findings.length,
    criticalCount,
    seriousCount,
    moderateCount,
    minorCount,
    levelACount,
    levelAACount,
    levelAAACount
  };
}
