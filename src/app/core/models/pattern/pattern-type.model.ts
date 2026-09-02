/**
 * Supported WAI-ARIA APG Pattern Types
 */
export type PatternType = 'dialog' | 'tabs' | 'accordion' | 'combobox';

export interface PatternRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requiredAttributes: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly keyboardRequirements: readonly string[];
  readonly apgReferenceUrl: string;
}
