import { describe, expect, it } from 'vitest';
import { WCAG_22_CATALOG } from '../wcag/wcag-catalog';
import { calculateAuditSummary } from './audit.model';
import { Finding } from './finding.model';

describe('Audit Domain Model', () => {
  it('should correctly calculate summary breakdown for severities and WCAG levels', () => {
    const mockFindings: Finding[] = [
      {
        id: 'f-1',
        ruleId: 'color-contrast',
        wcagCriterionId: '1.4.3',
        wcagCriterion: WCAG_22_CATALOG['1.4.3'], // Level AA
        selector: '#btn-submit',
        htmlSnippet: '<button class="btn">Submit</button>',
        message: 'Insufficient color contrast 2.1:1',
        severity: 'critical'
      },
      {
        id: 'f-2',
        ruleId: 'image-alt',
        wcagCriterionId: '1.1.1',
        wcagCriterion: WCAG_22_CATALOG['1.1.1'], // Level A
        selector: 'img.logo',
        htmlSnippet: '<img src="logo.png">',
        message: 'Image missing alt attribute',
        severity: 'serious'
      },
      {
        id: 'f-3',
        ruleId: 'focus-visible',
        wcagCriterionId: '2.4.7',
        wcagCriterion: WCAG_22_CATALOG['2.4.7'], // Level AA
        selector: 'a.nav-link',
        htmlSnippet: '<a href="/about">About</a>',
        message: 'Focus indicator is removed',
        severity: 'moderate'
      },
      {
        id: 'f-4',
        ruleId: 'contrast-enhanced',
        wcagCriterionId: '1.4.6',
        wcagCriterion: WCAG_22_CATALOG['1.4.6'], // Level AAA
        selector: 'p.subtext',
        htmlSnippet: '<p class="subtext">Note</p>',
        message: 'Enhanced contrast not met',
        severity: 'minor'
      }
    ];

    const summary = calculateAuditSummary(mockFindings);

    expect(summary.totalFindings).toBe(4);
    expect(summary.criticalCount).toBe(1);
    expect(summary.seriousCount).toBe(1);
    expect(summary.moderateCount).toBe(1);
    expect(summary.minorCount).toBe(1);

    expect(summary.levelACount).toBe(1);
    expect(summary.levelAACount).toBe(2);
    expect(summary.levelAAACount).toBe(1);
  });

  it('should handle empty findings list gracefully', () => {
    const summary = calculateAuditSummary([]);
    expect(summary.totalFindings).toBe(0);
    expect(summary.criticalCount).toBe(0);
    expect(summary.levelACount).toBe(0);
  });
});
