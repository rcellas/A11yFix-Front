import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { RemediationFacade } from '../../../facades/remediation.facade';
import { BaseWebMcpTool } from '../base-tool';

export interface ProposeRemediationInput {
  readonly findingId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProposeRemediationTool extends BaseWebMcpTool<ProposeRemediationInput, any> {
  readonly name = 'propose_remediation';
  readonly description = 'Generate or propose an AI-guided accessible code remediation for a finding.';
  readonly tier = 'PROPOSE' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to remediate (optional, defaults to selected/first finding)' }
  };

  private readonly auditFacade = inject(AuditFacade);
  private readonly remediationFacade = inject(RemediationFacade);

  async execute(input: ProposeRemediationInput): Promise<any> {
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

    await this.remediationFacade.requestAiRemediation(report.id, finding.id);
    return {
      findingId: finding.id,
      ruleId: finding.ruleId,
      status: this.remediationFacade.status(),
      proposedRemediation: this.remediationFacade.proposedRemediation()
    };
  }
}
