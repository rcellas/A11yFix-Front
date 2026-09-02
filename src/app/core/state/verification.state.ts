import { computed, signal } from '@angular/core';

export interface VerificationUnverifiedState {
  readonly status: 'unverified';
  readonly findingId: string;
}

export interface VerificationVerifyingState {
  readonly status: 'verifying';
  readonly findingId: string;
}

export interface VerificationPassedState {
  readonly status: 'passed';
  readonly findingId: string;
  readonly verifiedAt: string;
  readonly details?: string;
}

export interface VerificationRegressedState {
  readonly status: 'regressed';
  readonly findingId: string;
  readonly regressionReason: string;
}

export type VerificationState =
  | VerificationUnverifiedState
  | VerificationVerifyingState
  | VerificationPassedState
  | VerificationRegressedState;

/**
 * State Machine managing automated accessibility verification after remediation.
 */
export class VerificationStateMachine {
  private readonly _state = signal<VerificationState>({
    status: 'unverified',
    findingId: ''
  });

  // Public readonly Signal
  readonly state = this._state.asReadonly();

  // Computeds
  readonly status = computed(() => this._state().status);
  readonly isVerifying = computed(() => this._state().status === 'verifying');
  readonly isPassed = computed(() => this._state().status === 'passed');
  readonly isRegressed = computed(() => this._state().status === 'regressed');

  initialize(findingId: string): void {
    this._state.set({
      status: 'unverified',
      findingId
    });
  }

  startVerification(): void {
    const current = this._state();
    this._state.set({
      status: 'verifying',
      findingId: current.findingId
    });
  }

  markPassed(details?: string): void {
    const current = this._state();
    this._state.set({
      status: 'passed',
      findingId: current.findingId,
      verifiedAt: new Date().toISOString(),
      details
    });
  }

  markRegressed(regressionReason: string): void {
    const current = this._state();
    this._state.set({
      status: 'regressed',
      findingId: current.findingId,
      regressionReason
    });
  }
}
