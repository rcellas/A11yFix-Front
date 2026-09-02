import { describe, expect, it } from 'vitest';
import { getCriteriaByLevel, getWcagCriterion, WCAG_22_CATALOG } from './wcag-catalog';

describe('WCAG 2.2 Taxonomy', () => {
  it('should find WCAG 2.2 criteria by ID', () => {
    const criterion = getWcagCriterion('1.4.3');
    expect(criterion).toBeDefined();
    expect(criterion?.name).toBe('Contrast (Minimum)');
    expect(criterion?.level).toBe('AA');
    expect(criterion?.principle).toBe('Perceivable');
  });

  it('should categorize Level A, Level AA, and Level AAA criteria correctly', () => {
    const levelA = getCriteriaByLevel('A');
    const levelAA = getCriteriaByLevel('AA');
    const levelAAA = getCriteriaByLevel('AAA');

    expect(levelA.length).toBeGreaterThan(0);
    expect(levelAA.length).toBeGreaterThan(0);
    expect(levelAAA.length).toBeGreaterThan(0);

    expect(levelA.every((c) => c.level === 'A')).toBe(true);
    expect(levelAA.every((c) => c.level === 'AA')).toBe(true);
    expect(levelAAA.every((c) => c.level === 'AAA')).toBe(true);
  });

  it('should cover WCAG 2.2 new criteria like 2.4.11 and 2.5.8', () => {
    const targetSize = getWcagCriterion('2.5.8');
    expect(targetSize?.name).toBe('Target Size (Minimum)');
    expect(targetSize?.level).toBe('AA');

    const focusNotObscured = getWcagCriterion('2.4.11');
    expect(focusNotObscured?.name).toBe('Focus Not Obscured (Minimum)');
    expect(focusNotObscured?.level).toBe('AA');
  });
});
