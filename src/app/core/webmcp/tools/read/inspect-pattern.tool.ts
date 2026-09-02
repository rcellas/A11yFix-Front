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
  readonly description = 'Get WAI-ARIA APG pattern requirements for dialog, tabs, accordion, or combobox.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    patternType: {
      type: 'string',
      description: 'Pattern type to inspect',
      required: true,
      enum: ['dialog', 'tabs', 'accordion', 'combobox']
    }
  };

  execute(input: InspectPatternInput): any {
    if (!input?.patternType) {
      throw new Error('patternType is required');
    }
    const pattern = APG_PATTERNS[input.patternType as PatternType];
    if (!pattern) {
      throw new Error(`Unknown pattern type: ${input.patternType}`);
    }
    return pattern;
  }
}
