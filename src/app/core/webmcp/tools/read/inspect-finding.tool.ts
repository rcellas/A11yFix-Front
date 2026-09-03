import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { BaseWebMcpTool } from '../base-tool';

export interface InspectFindingInput {
  readonly findingId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InspectFindingTool extends BaseWebMcpTool<InspectFindingInput, any> {
  readonly name = 'inspect_finding';
  readonly description = 'Get deep technical details, HTML snippet, and WCAG 2.2 criterion for a specific finding.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to inspect (optional, defaults to selected/first finding)' }
  };

  private readonly auditFacade = inject(AuditFacade);

  execute(input: InspectFindingInput): any {
    const report = this.auditFacade.report();
    if (!report || report.findings.length === 0) {
      throw new Error('No active audit findings found. Please run an audit scan first.');
    }

    const targetId = input?.findingId;
    const finding =
      (targetId ? report.findings.find((f: Finding) => f.id === targetId) : undefined) ??
      this.auditFacade.selectedFinding() ??
      report.findings[0];

    if (!finding) {
      throw new Error(`Finding not found: ${targetId || 'active'}`);
    }

    return {
      finding,
      wcagSpec: finding.wcagCriterion
    };
  }
}
