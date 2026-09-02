# Specification: 001-a11yfix-web (A11yFix Web MVP)

## 1. Objective
A11yFix Web is an agent-native accessibility QA application designed for human-AI pair programming to audit, understand, remediate, approve, verify, and generate regression tests for web accessibility violations.

The application serves simultaneously as an accessible human interface and a browser-native client-side WebMCP host.

---

## 2. Core Product Loop
```text
Detect
  → Understand
  → Propose
  → Approve
  → Fix
  → Verify
  → Prevent Regression
```

---

## 3. Functional Requirements

### 3.1 Audit Workflow
- **Input**: Public web URL input with client-side syntax validation (must be valid HTTP/HTTPS URL).
- **Execution**: Initiate audit via `a11yfix-api` or WebMCP tool `create_audit`.
- **States**: `idle` → `starting` → `running` (with progress indicator) → `completed` | `failed`.
- **Result Summary**: Total violations count, critical score, breakdown by severity (Critical, Serious, Moderate, Minor) and by WCAG 2.2 Conformance Level (A, AA, AAA).

### 3.2 Findings Exploration
- **List & Filters**:
  - Filter by severity (Critical, Serious, Moderate, Minor).
  - Filter by WCAG 2.2 Conformance Level (Level A, Level AA, Level AAA).
  - Filter by interaction pattern (Dialog, Tabs, Disclosure, Combobox).
- **Finding Detail**:
  - Violated WCAG 2.2 Criterion (e.g. `2.1.2 No Keyboard Trap`, Level A).
  - Target component selector and DOM snippet.
  - Explanation of failure and impact on assistive technology users.
  - Associated interaction pattern.

### 3.3 Pattern Inspection
Deep dive into 4 interactive patterns with WAI-ARIA APG standards:
1. **Dialog**: Inspect focus trap, initial focus, focus return, Esc key listener, `aria-modal="true"`.
2. **Tabs**: Inspect arrow key navigation, `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`.
3. **Disclosure / Accordion**: Inspect `aria-expanded`, `<button>` trigger semantics, hidden content handling.
4. **Combobox**: Inspect `role="combobox"`, popup listbox, `aria-activedescendant` keyboard selection.

### 3.4 Remediation Proposal
- Current behavior vs expected behavior comparison.
- Structured code proposal with visual diff (additions in green, removals in red).
- Human-readable remediation summary.

### 3.5 Human Approval Barrier
- Explicit human actions: `Approve` and `Reject`.
- Optional rejection feedback comment.
- Security gate: Remediation state transitions to `approved` with an approval token. The agent tool `apply_remediation` is blocked from executing until approval is granted.

### 3.6 Fix Application & Verification
- State transitions: `applying` → `applied` → `verification-pending` → `verified` (pass/fail with verification evidence).
- Visual status indicator showing before vs after state.

### 3.7 Regression Test Generation
- Display generated Playwright test suite replicating the verified interaction and asserting a11y compliance.
- Features: Syntax highlighting, one-click copy to clipboard, download test file.

---

## 4. WebMCP Client Tools

The frontend registers the following tools in `document.modelContext`:

| Tool Name | Tier | Description |
|-----------|------|-------------|
| `create_audit` | PROPOSE | Initiates accessibility audit for a given target URL |
| `get_audit` | READ | Retrieves current audit progress and summary |
| `get_findings` | READ | Lists detected findings with optional severity and WCAG level filters |
| `inspect_finding` | READ | Retrieves deep diagnostics and evidence for a specific finding ID |
| `inspect_pattern` | READ | Retrieves APG requirements and anti-patterns for a widget pattern |
| `propose_remediation` | PROPOSE | Generates and sets a code remediation proposal for a finding |
| `request_remediation_approval`| PROPOSE | Submits remediation to human review queue in the UI |
| `apply_remediation` | WRITE | Applies approved remediation (Requires verified approval state) |
| `verify_remediation` | PROPOSE | Runs post-fix verification on the target component |
| `generate_regression_test` | PROPOSE | Generates Playwright regression test code |

---

## 5. Non-Functional Requirements
1. **Accessibility**: A11yFix UI must satisfy WCAG 2.2 Level AA; zero automated violations via axe-core.
2. **Keyboard Operability**: 100% features usable via keyboard with visible focus styles.
3. **Design System**: Atomic components developed and tested in Storybook.
4. **Performance**: Initial load under 1.5s; zoneless signal reactivity ensures immediate UI feedback.
5. **No Leaks**: Zero backend audit, Playwright execution, or database logic in frontend.
