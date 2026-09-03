import { Injectable } from '@angular/core';
import { APG_PATTERNS, PatternType } from '../../../models';
import { BaseWebMcpTool } from '../base-tool';

export interface InspectPatternInput {
  readonly patternType: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspectPatternTool extends BaseWebMcpTool<InspectPatternInput, any> {
  readonly name = 'inspect_pattern';
  readonly description = 'Get WAI-ARIA APG pattern requirements for dialog, tabs, disclosure, combobox, menu_button, breadcrumb, tooltip, alert_dialog, or accordion.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    patternType: {
      type: 'string',
      description: 'Pattern type to inspect (e.g. dialog, tabs, disclosure, combobox, menu_button, breadcrumb, tooltip, alert_dialog, accordion)',
      required: true,
      enum: [
        'dialog',
        'tabs',
        'disclosure',
        'combobox',
        'menu_button',
        'breadcrumb',
        'tooltip',
        'alert_dialog',
        'accordion'
      ]
    }
  };

  execute(input: InspectPatternInput): any {
    if (!input?.patternType) {
      throw new Error('patternType is required');
    }
    const key = input.patternType.toLowerCase().replace(/[-\s]/g, '_') as PatternType;
    const pattern = APG_PATTERNS[key];
    if (!pattern) {
      throw new Error(`Unknown pattern type: ${input.patternType}. Supported: ${Object.keys(APG_PATTERNS).join(', ')}`);
    }
    return pattern;
  }
}
