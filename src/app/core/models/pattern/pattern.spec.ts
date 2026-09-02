import { describe, expect, it } from 'vitest';
import { APG_PATTERNS } from './pattern-catalog';
import { PatternType } from './pattern-type.model';

describe('WAI-ARIA APG Pattern Catalog', () => {
  const expectedPatterns: PatternType[] = ['dialog', 'tabs', 'accordion', 'combobox'];

  it.each(expectedPatterns)('should have complete APG rules defined for %s', (pattern) => {
    const rule = APG_PATTERNS[pattern];
    expect(rule).toBeDefined();
    expect(rule.name).toBeTruthy();
    expect(rule.requiredAttributes.length).toBeGreaterThan(0);
    expect(rule.requiredRoles.length).toBeGreaterThan(0);
    expect(rule.keyboardRequirements.length).toBeGreaterThan(0);
    expect(rule.apgReferenceUrl).toContain('https://www.w3.org/WAI/ARIA/apg/patterns/');
  });
});
