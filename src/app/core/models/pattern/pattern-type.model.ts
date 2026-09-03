/**
 * Supported WAI-ARIA APG Pattern Types (9 Patterns)
 */
export type PatternType =
  | 'dialog'
  | 'tabs'
  | 'disclosure'
  | 'combobox'
  | 'menu_button'
  | 'breadcrumb'
  | 'tooltip'
  | 'alert_dialog'
  | 'accordion';

export interface PatternRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requiredAttributes: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly keyboardRequirements: readonly string[];
  readonly apgReferenceUrl: string;
}
