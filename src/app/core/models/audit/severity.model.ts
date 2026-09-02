/**
 * Accessibility Finding Severity Levels
 */
export type FindingSeverity = 'critical' | 'serious' | 'moderate' | 'minor';

export const SEVERITY_ORDER: Record<FindingSeverity, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1
};
