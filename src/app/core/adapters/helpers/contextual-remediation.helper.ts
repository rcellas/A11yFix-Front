import { FindingRemediation } from '../../models';

/**
 * Helper to generate contextual AI remediation proposals for accessibility findings
 */
export class ContextualRemediationHelper {
  static generate(findingId?: string): FindingRemediation {
    const id = findingId?.toLowerCase() || '';

    if (id.includes('heading') || id.includes('1.3.1') || id.includes('order')) {
      return {
        originalHtml: '<h4 class="text-h4">Retransmisión inaugural</h4>',
        proposedHtml: '<h2 class="text-h4">Retransmisión inaugural</h2>',
        explanation: 'Fix heading hierarchy to increase by only one level (from h1 to h2) satisfying WCAG 1.3.1 (Info and Relationships).'
      };
    }

    if (id.includes('target-size') || id.includes('2.5.8') || id.includes('touch')) {
      return {
        originalHtml: '<button class="nav-icon" style="width: 18px; height: 18px;">...</button>',
        proposedHtml: '<button class="nav-icon" style="min-width: 24px; min-height: 24px; padding: 4px;">...</button>',
        explanation: 'Enlarge touch target to at least 24px by 24px to satisfy WCAG 2.2 Success Criterion 2.5.8 (Target Size - Minimum).'
      };
    }

    if (id.includes('contrast') || id.includes('1.4.3')) {
      return {
        originalHtml: '<span style="color: #94a3b8; background: #ffffff;">Text</span>',
        proposedHtml: '<span style="color: #1e293b; background: #ffffff;">Text</span>',
        explanation: 'Elevate text color contrast ratio to 7.1:1 satisfying WCAG 1.4.3 (Contrast - Minimum).'
      };
    }

    return {
      originalHtml: '<div class="interactive-element">...</div>',
      proposedHtml: '<div class="interactive-element" tabindex="0" role="button" aria-label="Action">...</div>',
      explanation: 'Enhance element with accessible role, visible keyboard focus, and accessible name per WCAG 2.2 AA standard.'
    };
  }
}
