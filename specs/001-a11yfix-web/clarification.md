# Clarifications: 001-a11yfix-web

This document resolves edge cases, ambiguity, and technical boundaries for the A11yFix Web MVP.

---

## 1. WebMCP Browser Availability & Fallback

**Question**: What happens if the browser running A11yFix does not support `document.modelContext`?
**Clarification**:
- The `WebMcpService` checks `typeof document !== 'undefined' && 'modelContext' in document` (and fallbacks to `'modelContext' in navigator`).
- If neither is available, WebMCP tool registration is skipped with a console warning.
- The entire application UI operates normally: human developers can manually run audits, inspect patterns, approve/reject proposals, and generate regression tests. WebMCP is a progressive enhancement.

---

## 2. Human Approval Barrier Mechanics

**Question**: How does `apply_remediation` verify that human approval actually occurred?
**Clarification**:
- The `RemediationFacade` maintains an immutable `RemediationState`.
- When a human clicks "Approve" in the UI, the facade transitions to:
  `{ status: 'approved', remediation: proposal, approvalToken: crypto.randomUUID() }`.
- When the agent calls `apply_remediation`, the tool passes the current active remediation ID.
- The facade verifies that `state.status === 'approved'` and that the ID matches. If state is `pending-approval`, `rejected`, or `none`, the tool throws `SecurityException: Cannot apply remediation without explicit human approval.`

---

## 3. WCAG 2.2 Conformance Classification

**Question**: How are WCAG criteria mapped to levels?
**Clarification**:
- Every finding payload received from `a11yfix-api` includes `wcagRuleId` (e.g. `2.1.2`).
- The frontend maintains a readonly dictionary `WCAG_2_2_CRITERIA` that enriches findings with:
  - Official name (`No Keyboard Trap`)
  - Level (`A`, `AA`, or `AAA`)
  - Principle (`Operable`)
  - W3C URL
- If an unknown rule ID is encountered, it gracefully defaults to Level `A` with an "Unclassified WCAG Rule" tag.

---

## 4. Separation from `a11yfix-api`

**Question**: Does the frontend execute axe-core or Playwright directly?
**Clarification**:
- Absolutely not. The backend `a11yfix-api` executes axe-core, browser crawling, and test execution.
- The frontend only submits audit requests, polls or subscribes to progress, receives JSON findings, and displays them.
- Generated Playwright tests are created as structured code text for export.

---

## 5. Branching & Git Workflow

**Question**: When is code merged to `main`?
**Clarification**:
- Never merge to `main` without explicit user request.
- All development and integration merges take place on `dev`.
