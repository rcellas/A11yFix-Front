import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { RemediationFacade } from '../../../facades/remediation.facade';
import { BaseWebMcpTool } from '../base-tool';

export interface ApplyRemediationInput {
  readonly findingId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplyRemediationTool extends BaseWebMcpTool<ApplyRemediationInput, any> {
  readonly name = 'apply_remediation';
  readonly description = 'Apply an approved remediation. STRICTLY fails if human approval has not been granted.';
  readonly tier = 'WRITE' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to apply remediation for (optional, defaults to selected/first finding)' }
  };

  private readonly auditFacade = inject(AuditFacade);
  private readonly remediationFacade = inject(RemediationFacade);

  async execute(input: ApplyRemediationInput): Promise<any> {
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

    // MANDATORY HUMAN APPROVAL BARRIER
    const currentRemediationState = this.remediationFacade.state();
    if (currentRemediationState.status !== 'approved') {
      throw new Error(
        `WebMCP Security Policy Violation: Cannot apply remediation via WebMCP without verified human approval in the application state. Current status: ${currentRemediationState.status}`
      );
    }

    const result = await this.remediationFacade.applyApprovedRemediation(report.id);
    return {
      success: result.success,
      appliedAt: result.appliedAt,
      findingId: finding.id
    };
  }
}
