import { Finding, FindingRemediation } from '../../models';

/**
 * Helper to generate contextual AI remediation proposals for accessibility findings
 */
export class ContextualRemediationHelper {
  static generate(findingOrId?: Finding | string): FindingRemediation {
    const isObject = typeof findingOrId === 'object' && findingOrId !== null;
    const finding = isObject ? (findingOrId as Finding) : undefined;
    const id = (finding?.ruleId || (typeof findingOrId === 'string' ? findingOrId : '')).toLowerCase();
    const snippet = finding?.htmlSnippet || '';

    if (id.includes('contrast') || id.includes('1.4.3')) {
      const orig = snippet || '<span class="insufficient-contrast" style="color: #94a3b8; background: #ffffff;">Text</span>';
      const proposed = snippet
        ? (snippet.includes('style=')
            ? snippet.replace(/color:\s*[^;"]+/, 'color: #0f172a')
            : snippet.replace(/^<([a-z0-9]+)/i, '<$1 style="color: #0f172a; background: #ffffff;"'))
        : '<span class="insufficient-contrast" style="color: #0f172a; background: #ffffff;">Text</span>';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Elevate text color contrast ratio to satisfy WCAG 1.4.3 Level AA (min 4.5:1 / 7:1 AAA).'
      };
    }

    if (id.includes('landmark-one-main') || id.includes('main') || id.includes('1.3.1')) {
      const orig = snippet || '<div class="main-content">...</div>';
      const proposed = snippet
        ? snippet.replace(/^<div/i, '<main role="main"').replace(/<\/div>$/i, '</main>')
        : '<main class="main-content" role="main">...</main>';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Wrap primary document content inside a semantic <main role="main"> landmark to satisfy WCAG 1.3.1 (Info and Relationships).'
      };
    }

    if (id.includes('heading') || id.includes('order')) {
      const orig = snippet || '<h4 class="text-h4">Retransmisión inaugural</h4>';
      const proposed = snippet
        ? snippet.replace(/^<h[3-6]/i, '<h2').replace(/<\/h[3-6]>$/i, '</h2>')
        : '<h2 class="text-h4">Retransmisión inaugural</h2>';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Fix heading hierarchy to increase by only one level (from h1 to h2) satisfying WCAG 1.3.1.'
      };
    }

    if (id.includes('target-size') || id.includes('2.5.8') || id.includes('touch')) {
      const orig = snippet || '<button class="nav-icon" style="width: 18px; height: 18px;">...</button>';
      const proposed = snippet
        ? snippet.replace(/^<([a-z0-9]+)/i, '<$1 style="min-width: 24px; min-height: 24px; padding: 4px;"')
        : '<button class="nav-icon" style="min-width: 24px; min-height: 24px; padding: 4px;">...</button>';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Enlarge touch target to at least 24px by 24px to satisfy WCAG 2.2 Success Criterion 2.5.8 (Target Size - Minimum).'
      };
    }

    if (id.includes('alt') || id.includes('image') || id.includes('1.1.1')) {
      const orig = snippet || '<img src="thumbnail.jpg">';
      const proposed = snippet
        ? (snippet.includes('alt=')
            ? snippet.replace(/alt="[^"]*"/, 'alt="Descriptive alternative text"')
            : snippet.replace(/^<img/i, '<img alt="Descriptive alternative text"'))
        : '<img src="thumbnail.jpg" alt="Descriptive alternative text">';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Add meaningful alternative text describing the image content to satisfy WCAG 1.1.1 (Non-text Content).'
      };
    }

    if (id.includes('button-name') || id.includes('link-name') || id.includes('4.1.2') || id.includes('name')) {
      const orig = snippet || '<button class="icon-action"><svg>...</svg></button>';
      const proposed = snippet
        ? snippet.replace(/^<([a-z0-9]+)/i, '<$1 aria-label="Perform action"')
        : '<button class="icon-action" aria-label="Perform action"><svg aria-hidden="true">...</svg></button>';
      return {
        originalHtml: orig,
        proposedHtml: proposed,
        explanation: 'Provide accessible name via aria-label to satisfy WCAG 4.1.2 (Name, Role, Value).'
      };
    }

    const orig = snippet || '<div class="interactive-element">...</div>';
    const proposed = snippet
      ? snippet.replace(/^<([a-z0-9]+)/i, '<$1 role="region" aria-label="Content section"')
      : '<div class="interactive-element" tabindex="0" role="button" aria-label="Action">...</div>';
    return {
      originalHtml: orig,
      proposedHtml: proposed,
      explanation: 'Enhance element with semantic role and accessible name per WCAG 2.2 AA standard.'
    };
  }
}
