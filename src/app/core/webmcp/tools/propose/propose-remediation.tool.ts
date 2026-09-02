import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { RemediationFacade } from '../../../facades/remediation.facade';
import { BaseWebMcpTool } from '../base-tool';

export interface ProposeRemediationInput {
  readonly findingId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProposeRemediationTool extends BaseWebMcpTool<ProposeRemediationInput, any> {
  readonly name = 'propose_remediation';
  readonly description = 'Generate or propose an AI-guided accessible code remediation for a finding.';
  readonly tier = 'PROPOSE' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to remediate', required: true }
  };

  private readonly auditFacade = inject(AuditFacade);
  private readonly remediationFacade = inject(RemediationFacade);

  async execute(input: ProposeRemediationInput): Promise<any> {
    if (!input?.findingId) {
      throw new Error('findingId is required');
    }
    const report = this.auditFacade.report();
    if (!report) {
      throw new Error('No active audit found. Run create_audit first.');
    }
    await this.remediationFacade.requestAiRemediation(report.id, input.findingId);
    return {
      status: this.remediationFacade.status(),
      proposedRemediation: this.remediationFacade.proposedRemediation()
    };
  }
}
