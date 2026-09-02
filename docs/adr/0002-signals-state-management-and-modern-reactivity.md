# ADR 0002: Signals State Management and Modern Reactivity

## Status
Accepted

## Context
Traditional state management in Angular applications often relies on heavy external libraries like NgRx, or on mutable component properties mixed with "boolean soup" (`isLoading`, `hasError`, `isSuccess`, `isApplying`), leading to invalid intermediate states and hard-to-debug race conditions. Modern Angular provides first-class reactive primitives (Signals) and standalone architecture.

## Decision
1. **Angular Signals as the Primary Reactive Primitive**:
   - Use `signal()`, `computed()`, `input()`, `output()`, and `model()` across all components and facades.
   - Use `linkedSignal()` or `resource()` where appropriate for derived or asynchronous data.
2. **Discriminated Unions for State Transitions**:
   - Explicitly model states as discriminated unions. For example:
     ```typescript
     export type AuditState =
       | { status: 'idle' }
       | { status: 'starting'; url: string }
       | { status: 'running'; url: string; progress: number }
       | { status: 'completed'; url: string; auditId: string; summary: AuditSummary }
       | { status: 'failed'; url: string; error: string };

     export type RemediationState =
       | { status: 'none' }
       | { status: 'proposed'; remediation: RemediationProposal }
       | { status: 'pending-approval'; remediation: RemediationProposal }
       | { status: 'approved'; remediation: RemediationProposal; approvalToken: string }
       | { status: 'rejected'; remediation: RemediationProposal; reason: string }
       | { status: 'applying'; remediation: RemediationProposal }
       | { status: 'applied'; remediation: RemediationProposal; diff: string }
       | { status: 'verification-pending'; remediation: RemediationProposal }
       | { status: 'verified'; remediation: RemediationProposal; passed: boolean }
       | { status: 'failed'; remediation: RemediationProposal; error: string };
     ```
3. **No External Global State Library**:
   - Do not install NgRx or Akita. Feature state is managed by localized Angular injectable facades provided in the feature route scope.

## Consequences
### Positive
- Prevents invalid or conflicting UI states.
- Fine-grained signal reactivity eliminates unnecessary template re-evaluations.
- Clean, predictable state machines easily tested with Vitest.

### Negative
- Requires developers to write explicit transition methods in facades rather than mutating arbitrary boolean flags.
