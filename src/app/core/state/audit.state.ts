import { computed, signal } from '@angular/core';
import { AuditReport } from '../models/audit/audit.model';

export interface AuditIdleState {
  readonly status: 'idle';
}

export interface AuditScanningState {
  readonly status: 'scanning';
  readonly targetUrl: string;
  readonly progress: number; // 0 to 100
}

export interface AuditCompletedState {
  readonly status: 'completed';
  readonly report: AuditReport;
}

export interface AuditFailedState {
  readonly status: 'failed';
  readonly targetUrl: string;
  readonly error: string;
}

export type AuditState =
  | AuditIdleState
  | AuditScanningState
  | AuditCompletedState
  | AuditFailedState;

/**
 * State Machine managing audit lifecycle via Angular Signals.
 * Strictly eliminates boolean soup.
 */
export class AuditStateMachine {
  private readonly _state = signal<AuditState>({ status: 'idle' });

  // Public readonly Signal
  readonly state = this._state.asReadonly();

  // Derived reactive computeds
  readonly status = computed(() => this._state().status);
  readonly isScanning = computed(() => this._state().status === 'scanning');
  readonly isCompleted = computed(() => this._state().status === 'completed');
  readonly isFailed = computed(() => this._state().status === 'failed');

  readonly report = computed(() => {
    const s = this._state();
    return s.status === 'completed' ? s.report : null;
  });

  readonly findings = computed(() => {
    const r = this.report();
    return r ? r.findings : [];
  });

  readonly error = computed(() => {
    const s = this._state();
    return s.status === 'failed' ? s.error : null;
  });

  startScan(targetUrl: string): void {
    this._state.set({
      status: 'scanning',
      targetUrl,
      progress: 0
    });
  }

  updateProgress(progress: number): void {
    const current = this._state();
    if (current.status !== 'scanning') {
      throw new Error(`Cannot update progress while in status: ${current.status}`);
    }
    this._state.set({
      ...current,
      progress: Math.min(100, Math.max(0, progress))
    });
  }

  completeScan(report: AuditReport): void {
    this._state.set({
      status: 'completed',
      report
    });
  }

  failScan(error: string): void {
    const current = this._state();
    const targetUrl = current.status === 'scanning' ? current.targetUrl : '';
    this._state.set({
      status: 'failed',
      targetUrl,
      error
    });
  }

  reset(): void {
    this._state.set({ status: 'idle' });
  }
}
