import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { BaseWebMcpTool } from '../base-tool';

export interface InspectFindingInput {
  readonly findingId: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspectFindingTool extends BaseWebMcpTool<InspectFindingInput, any> {
  readonly name = 'inspect_finding';
  readonly description = 'Get deep technical details, HTML snippet, and WCAG 2.2 criterion for a specific finding.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to inspect', required: true }
  };

  private readonly auditFacade = inject(AuditFacade);

  execute(input: InspectFindingInput): any {
    if (!input?.findingId) {
      throw new Error('findingId is required');
    }
    const report = this.auditFacade.report();
    const finding = report?.findings.find((f: Finding) => f.id === input.findingId);
    if (!finding) {
      throw new Error(`Finding not found: ${input.findingId}`);
    }
    return {
      finding,
      wcagSpec: finding.wcagCriterion
    };
  }
}
