import { computed, signal } from '@angular/core';
import { FindingRemediation } from '../models/audit/finding.model';

export interface RemediationDraftState {
  readonly status: 'draft';
  readonly findingId: string;
}

export interface RemediationProposingState {
  readonly status: 'proposing';
  readonly findingId: string;
}

export interface RemediationAwaitingApprovalState {
  readonly status: 'awaiting_approval';
  readonly findingId: string;
  readonly remediation: FindingRemediation;
}

export interface RemediationApprovedState {
  readonly status: 'approved';
  readonly findingId: string;
  readonly remediation: FindingRemediation;
  readonly approvedAt: string;
  readonly approvedBy: string;
}

export interface RemediationApplyingState {
  readonly status: 'applying';
  readonly findingId: string;
  readonly remediation: FindingRemediation;
}

export interface RemediationAppliedState {
  readonly status: 'applied';
  readonly findingId: string;
  readonly remediation: FindingRemediation;
  readonly appliedAt: string;
}

export interface RemediationVerifiedState {
  readonly status: 'verified';
  readonly findingId: string;
  readonly remediation: FindingRemediation;
  readonly verificationResult: {
    readonly passed: boolean;
    readonly details: string;
  };
}

export interface RemediationRejectedState {
  readonly status: 'rejected';
  readonly findingId: string;
  readonly reason: string;
}

export type RemediationState =
  | RemediationDraftState
  | RemediationProposingState
  | RemediationAwaitingApprovalState
  | RemediationApprovedState
  | RemediationApplyingState
  | RemediationAppliedState
  | RemediationVerifiedState
  | RemediationRejectedState;

/**
 * State Machine managing remediation lifecycle and enforcing human approval barriers.
 */
export class RemediationStateMachine {
  private readonly _state = signal<RemediationState>({
    status: 'draft',
    findingId: ''
  });

  // Public readonly Signal
  readonly state = this._state.asReadonly();

  // Computeds
  readonly status = computed(() => this._state().status);
  readonly isAwaitingApproval = computed(() => this._state().status === 'awaiting_approval');
  readonly isApproved = computed(() => this._state().status === 'approved');
  readonly isApplied = computed(() => this._state().status === 'applied');
  readonly isVerified = computed(() => this._state().status === 'verified');
  readonly isRejected = computed(() => this._state().status === 'rejected');

  readonly proposedRemediation = computed(() => {
    const s = this._state();
    if (
      s.status === 'awaiting_approval' ||
      s.status === 'approved' ||
      s.status === 'applying' ||
      s.status === 'applied' ||
      s.status === 'verified'
    ) {
      return s.remediation;
    }
    return null;
  });

  initialize(findingId: string): void {
    this._state.set({
      status: 'draft',
      findingId
    });
  }

  proposeRemediation(findingId: string, remediation: FindingRemediation): void {
    this._state.set({
      status: 'awaiting_approval',
      findingId,
      remediation
    });
  }

  /**
   * Human Approval Barrier: User explicitly approves proposed fix
   */
  approve(approvedBy: string = 'human_user'): void {
    const current = this._state();
    if (current.status !== 'awaiting_approval') {
      throw new Error(`Cannot approve remediation while in status: ${current.status}`);
    }

    this._state.set({
      status: 'approved',
      findingId: current.findingId,
      remediation: current.remediation,
      approvedAt: new Date().toISOString(),
      approvedBy
    });
  }

  reject(reason: string): void {
    const current = this._state();
    this._state.set({
      status: 'rejected',
      findingId: current.findingId,
      reason
    });
  }

  /**
   * Application of fix: STRICTLY protected by Human Approval Barrier
   */
  startApplying(): void {
    const current = this._state();
    if (current.status !== 'approved') {
      throw new Error(
        `Human Approval Barrier Violation: Cannot apply remediation unless approved. Current status is ${current.status}`
      );
    }

    this._state.set({
      status: 'applying',
      findingId: current.findingId,
      remediation: current.remediation
    });
  }

  markApplied(): void {
    const current = this._state();
    if (current.status !== 'applying') {
      throw new Error(`Cannot mark applied while in status: ${current.status}`);
    }

    this._state.set({
      status: 'applied',
      findingId: current.findingId,
      remediation: current.remediation,
      appliedAt: new Date().toISOString()
    });
  }

  markVerified(result: { passed: boolean; details: string }): void {
    const current = this._state();
    const rem = this.proposedRemediation() ?? {
      originalHtml: '',
      proposedHtml: '',
      explanation: 'Verified remediation'
    };

    this._state.set({
      status: 'verified',
      findingId: current.findingId,
      remediation: rem,
      verificationResult: result
    });
  }
}
