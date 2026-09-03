import { Injectable } from '@angular/core';
import { APG_PATTERNS, PatternType } from '../../../models';
import { BaseWebMcpTool } from '../base-tool';

export interface InspectPatternInput {
  readonly patternType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspectPatternTool extends BaseWebMcpTool<InspectPatternInput, any> {
  readonly name = 'inspect_pattern';
  readonly description = 'Get WAI-ARIA APG pattern requirements for all 9 supported patterns, or inspect a specific pattern.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    patternType: {
      type: 'string',
      description: 'Pattern type to inspect or "all" to retrieve the full catalog of 9 WAI-ARIA patterns',
      required: false,
      enum: [
        'all',
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

  execute(input?: InspectPatternInput): any {
    const rawType = input?.patternType?.toLowerCase().replace(/[-\s]/g, '_') || 'all';

    if (rawType === 'all') {
      return {
        totalPatterns: Object.keys(APG_PATTERNS).length,
        patterns: APG_PATTERNS
      };
    }

    const pattern = APG_PATTERNS[rawType as PatternType];
    if (!pattern) {
      throw new Error(`Unknown pattern type: ${input?.patternType}. Supported: all, ${Object.keys(APG_PATTERNS).join(', ')}`);
    }
    return pattern;
  }
}
