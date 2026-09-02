import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FindingRemediation } from '../models';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { RemediationStateMachine } from '../state/remediation.state';

@Injectable({
  providedIn: 'root'
})
export class RemediationFacade {
  private readonly apiClient = inject(AUDIT_API_CLIENT);
  private readonly stateMachine = new RemediationStateMachine();

  // Expose signals
  readonly state = this.stateMachine.state;
  readonly status = this.stateMachine.status;
  readonly isAwaitingApproval = this.stateMachine.isAwaitingApproval;
  readonly isApproved = this.stateMachine.isApproved;
  readonly isApplied = this.stateMachine.isApplied;
  readonly isRejected = this.stateMachine.isRejected;
  readonly proposedRemediation = this.stateMachine.proposedRemediation;

  readonly hasProposedRemediation = computed(() => this.proposedRemediation() !== null);

  initializeForFinding(findingId: string, existingRemediation?: FindingRemediation): void {
    this.stateMachine.initialize(findingId);
    if (existingRemediation) {
      this.stateMachine.proposeRemediation(findingId, existingRemediation);
    }
  }

  async requestAiRemediation(auditId: string, findingId: string): Promise<void> {
    try {
      this.stateMachine.initialize(findingId);
      const remediation = await firstValueFrom(
        this.apiClient.proposeRemediation({ auditId, findingId })
      );
      this.stateMachine.proposeRemediation(findingId, remediation);
    } catch (err: unknown) {
      const reason = err instanceof Error ? err.message : 'Failed to generate AI remediation proposal';
      this.stateMachine.reject(reason);
    }
  }

  /**
   * Human Approval Barrier
   */
  approveProposal(approvedBy: string = 'human_user'): void {
    this.stateMachine.approve(approvedBy);
  }

  rejectProposal(reason: string): void {
    this.stateMachine.reject(reason);
  }

  /**
   * Apply remediation (strictly guarded by Human Approval)
   */
  async applyApprovedRemediation(auditId: string): Promise<{ success: boolean; appliedAt: string }> {
    const remediation = this.proposedRemediation();
    const currentState = this.state();

    if (currentState.status !== 'approved' || !remediation) {
      throw new Error('Human Approval Barrier Violation: Remediation must be explicitly approved before applying.');
    }

    try {
      this.stateMachine.startApplying();
      const result = await firstValueFrom(
        this.apiClient.applyRemediation({
          auditId,
          findingId: currentState.findingId,
          approvedRemediation: remediation,
          approvedBy: currentState.approvedBy
        })
      );
      this.stateMachine.markApplied();
      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to apply remediation';
      this.stateMachine.reject(errorMsg);
      throw err;
    }
  }
}
