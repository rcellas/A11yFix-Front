import { describe, expect, it } from 'vitest';
import { FindingRemediation } from '../models/audit/finding.model';
import { AuditStateMachine } from './audit.state';
import { RemediationStateMachine } from './remediation.state';
import { VerificationStateMachine } from './verification.state';

describe('Signals State Machines', () => {
  describe('AuditStateMachine', () => {
    it('should transition through scan lifecycle reactively', () => {
      const sm = new AuditStateMachine();
      expect(sm.status()).toBe('idle');
      expect(sm.isScanning()).toBe(false);

      sm.startScan('https://example.com');
      expect(sm.status()).toBe('scanning');
      expect(sm.isScanning()).toBe(true);

      sm.updateProgress(45);
      const state = sm.state();
      if (state.status === 'scanning') {
        expect(state.progress).toBe(45);
      }

      sm.completeScan({
        id: 'audit-1',
        targetUrl: 'https://example.com',
        timestamp: new Date().toISOString(),
        findings: [],
        summary: {
          totalFindings: 0,
          criticalCount: 0,
          seriousCount: 0,
          moderateCount: 0,
          minorCount: 0,
          levelACount: 0,
          levelAACount: 0,
          levelAAACount: 0
        }
      });

      expect(sm.status()).toBe('completed');
      expect(sm.isCompleted()).toBe(true);
      expect(sm.report()?.id).toBe('audit-1');
    });

    it('should transition to failed on scan error', () => {
      const sm = new AuditStateMachine();
      sm.startScan('https://bad-domain.invalid');
      sm.failScan('Network timeout');

      expect(sm.status()).toBe('failed');
      expect(sm.isFailed()).toBe(true);
      expect(sm.error()).toBe('Network timeout');
    });
  });

  describe('RemediationStateMachine (Human Approval Barrier)', () => {
    const mockRemediation: FindingRemediation = {
      originalHtml: '<button></button>',
      proposedHtml: '<button aria-label="Close">X</button>',
      explanation: 'Added accessible name'
    };

    it('should strictly reject applying remediation without prior human approval', () => {
      const sm = new RemediationStateMachine();
      sm.initialize('finding-123');
      sm.proposeRemediation('finding-123', mockRemediation);

      expect(sm.status()).toBe('awaiting_approval');
      expect(sm.isAwaitingApproval()).toBe(true);
      expect(sm.proposedRemediation()).toEqual(mockRemediation);

      // Attempting to apply directly MUST throw and block execution
      expect(() => sm.startApplying()).toThrowError(/Human Approval Barrier Violation/);
    });

    it('should permit applying ONLY after human approval', () => {
      const sm = new RemediationStateMachine();
      sm.initialize('finding-123');
      sm.proposeRemediation('finding-123', mockRemediation);

      // Explicit human approval
      sm.approve('auditor_jane');
      expect(sm.status()).toBe('approved');
      expect(sm.isApproved()).toBe(true);

      // Application succeeds
      sm.startApplying();
      expect(sm.status()).toBe('applying');

      sm.markApplied();
      expect(sm.status()).toBe('applied');
      expect(sm.isApplied()).toBe(true);
    });

    it('should handle rejection cleanly', () => {
      const sm = new RemediationStateMachine();
      sm.initialize('finding-123');
      sm.proposeRemediation('finding-123', mockRemediation);

      sm.reject('Button design pattern not aligned with design system');
      expect(sm.status()).toBe('rejected');
      expect(sm.isRejected()).toBe(true);
    });
  });

  describe('VerificationStateMachine', () => {
    it('should track verification verification progression', () => {
      const sm = new VerificationStateMachine();
      sm.initialize('finding-123');
      expect(sm.status()).toBe('unverified');

      sm.startVerification();
      expect(sm.status()).toBe('verifying');
      expect(sm.isVerifying()).toBe(true);

      sm.markPassed('Color contrast verified 4.6:1');
      expect(sm.status()).toBe('passed');
      expect(sm.isPassed()).toBe(true);
    });

    it('should record regression if verification detects issue persist', () => {
      const sm = new VerificationStateMachine();
      sm.initialize('finding-123');
      sm.startVerification();
      sm.markRegressed('Contrast still below 4.5:1');

      expect(sm.status()).toBe('regressed');
      expect(sm.isRegressed()).toBe(true);
    });
  });
});
