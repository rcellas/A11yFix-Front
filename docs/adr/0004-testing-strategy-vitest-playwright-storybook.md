# ADR 0004: Comprehensive Testing Strategy (Vitest, Playwright & Storybook)

## Status
Accepted

## Context
As an accessibility QA tool, A11yFix must guarantee that its own user interface is flawless, highly usable via keyboard, and completely free of accessibility violations. A multi-layered testing strategy is required to validate unit logic, component accessibility, and end-to-end user workflows.

## Decision
We implement a three-tier testing strategy:

1. **Tier 1: Storybook + `@storybook/addon-a11y` (Component Isolation & Accessibility)**
   - Used for all atomic design components (`atoms`, `molecules`, `organisms`).
   - Runs automated axe-core checks on every component state (default, hover, focus, disabled, error, active).
   - Allows manual keyboard navigation and visual inspection in isolation.

2. **Tier 2: Vitest (Fast Unit, Facade, and Component Logic)**
   - Used for testing:
     - Signals state machines and discriminated union transitions.
     - Application facades (e.g. `AuditFacade`, `RemediationFacade`).
     - Permission checks and approval barriers in WebMCP tools.
     - DTO mappers and HTTP error handling.
   - Fast execution in CI and local test watches.

3. **Tier 3: Playwright (End-to-End & Integration Testing)**
   - Tests critical user journeys:
     - Audit submission → Progress tracking → Findings display.
     - Finding inspection → Pattern guidance view.
     - Remediation proposal → Human approval (Approve / Reject) → Verification flow.
   - Verifies keyboard trap prevention, roving tabindex, and focus restoration in modal dialogs.
   - Tests generated regression test output.

## Consequences
### Positive
- Components are verified accessible before they are assembled into screens.
- State machines and security barriers are 100% test-covered without spinning up a browser.
- Real browser accessibility behavior (focus order, keyboard traps) is validated via Playwright.

### Negative
- Requires maintaining story files alongside unit test specs.
