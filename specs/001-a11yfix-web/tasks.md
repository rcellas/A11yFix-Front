# Tasks Breakdown: 001-a11yfix-web

Every task must be implemented on its own dedicated feature branch branched from `dev`, validated with tests and acceptance criteria, committed using Conventional Commits, and merged back into `dev`. **Do not merge to `main` until instructed.**

---

### T001: Project Bootstrap & Toolchain Setup
- **Branch**: `feat/T001-project-bootstrap`
- **Dependencies**: None (starts from `dev`)
- **Conventional Commit**: `chore(init): bootstrap Angular modern workspace with Vitest, Playwright, and Storybook`
- **Scope**:
  - Configure modern Angular standalone project with strict TypeScript and SCSS.
  - Setup Vitest test runner for unit/component testing.
  - Setup Playwright for end-to-end and keyboard accessibility journeys.
  - Setup Storybook with `@storybook/addon-a11y`.
  - Setup `.editorconfig`, `.gitignore`, and GitHub Actions CI workflow.
- **Acceptance Criteria**:
  - `pnpm install` succeeds without fatal engine errors.
  - `pnpm test` runs Vitest successfully.
  - `pnpm run build` generates production bundle cleanly.
  - `pnpm run storybook` runs without errors.

---

### T002: Design Tokens & Base Global Styles
- **Branch**: `feat/T002-design-tokens`
- **Dependencies**: T001
- **Conventional Commit**: `feat(design-system): add WCAG-compliant design tokens and base styles`
- **Scope**:
  - Implement SCSS design tokens in `src/app/design-system/tokens/` (colors, spacing, typography, focus, elevation, severity, WCAG level badges).
  - Define high-contrast focus rings (`3px solid var(--color-primary)` with 2px offset).
  - Setup CSS custom properties with dark mode / light mode support.
- **Acceptance Criteria**:
  - All color tokens pass WCAG 2.2 AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI components).
  - No hardcoded hex or arbitrary px values in component styles.

---

### T003: Atomic Design System Components & Storybook Catalog
- **Branch**: `feat/T003-atomic-components`
- **Dependencies**: T002
- **Conventional Commit**: `feat(design-system): create accessible atomic components with Storybook stories`
- **Scope**:
  - Atoms: Button, Badge (Severity & WCAG Levels A/AA/AAA), TextField, Icon.
  - Molecules: FilterChipGroup, CodeDiffViewer, ProgressBar.
  - Organisms: Dialog (focus trap, Esc dismiss), Tabs (roving tabindex), Accordion, Combobox.
  - Storybook stories for each component verifying axe-core compliance.
- **Acceptance Criteria**:
  - Storybook `@storybook/addon-a11y` reports 0 violations across all component states.
  - Full keyboard operability verified via Vitest and Storybook.

---

### T004: Core State Contracts, WCAG 2.2 Taxonomy & Discriminated Unions
- **Branch**: `feat/T004-state-contracts`
- **Dependencies**: T001
- **Conventional Commit**: `feat(core): define WCAG 2.2 taxonomy, domain contracts, and signal state machines`
- **Scope**:
  - Strongly typed contracts: `Audit`, `Finding`, `WcagCriterion`, `RemediationProposal`, `VerificationResult`.
  - Comprehensive WCAG 2.2 dictionary (criteria 1.1.1 through 4.1.2 with Levels A, AA, AAA).
  - Discriminated union states: `AuditState`, `RemediationState`.
- **Acceptance Criteria**:
  - 100% type-safe states without boolean soup.
  - Unit tests verify valid state transitions and reject illegal transitions.

---

### T005: API Client Contracts & HTTP Adapters
- **Branch**: `feat/T005-api-adapters`
- **Dependencies**: T004
- **Conventional Commit**: `feat(infra): implement a11yfix-api HTTP client adapters and error handling`
- **Scope**:
  - HTTP adapter for `a11yfix-api` endpoints: audits, findings, remediations, verifications.
  - Transparent error handling (API unavailable, timeout, SSRF rejection, 404s).
  - Mock HTTP adapter for standalone development and offline testing.
- **Acceptance Criteria**:
  - Vitest tests verify successful request mapping and structured error handling.

---

### T006: Audit Screen & Workspace Composition
- **Branch**: `feat/T006-audit-workspace`
- **Dependencies**: T003, T004, T005
- **Conventional Commit**: `feat(audit): implement audit URL submission and live progress tracking workspace`
- **Scope**:
  - Audit URL input with accessible error messages and validation.
  - Audit progress visualization and summary cards.
  - Live announcements for screen readers when audit starts and completes.
- **Acceptance Criteria**:
  - Keyboard accessible form submission.
  - Correct state transitions (`idle` → `starting` → `running` → `completed`).

---

### T007: Findings UI & WCAG 2.2 Conformance Filtering
- **Branch**: `feat/T007-findings-ui`
- **Dependencies**: T006
- **Conventional Commit**: `feat(findings): implement findings list with WCAG 2.2 level and severity filters`
- **Scope**:
  - Display list of findings with severity badges and WCAG 2.2 Level badges (A, AA, AAA).
  - Interactive filter chips for Level A, AA, AAA and severity.
  - Finding detail drawer/panel with selector, snippet, and impact explanation.
- **Acceptance Criteria**:
  - Filter chips filter results reactively using Signals.
  - Screen reader announcements on filter change.

---

### T008: Pattern Inspection UI (Dialog, Tabs, Disclosure, Combobox)
- **Branch**: `feat/T008-pattern-inspection`
- **Dependencies**: T007
- **Conventional Commit**: `feat(patterns): implement WAI-ARIA APG pattern inspection and remediation views`
- **Scope**:
  - Deep-dive inspection for 4 patterns: Dialog, Tabs, Disclosure, Combobox.
  - Visual display of APG expectations vs detected anti-patterns.
  - Interactive visual preview demonstrating the corrected interaction.
- **Acceptance Criteria**:
  - Demonstrates keyboard navigation, ARIA states, and focus mechanics for each pattern.

---

### T009: WebMCP Integration Foundation
- **Branch**: `feat/T009-webmcp-foundation`
- **Dependencies**: T004
- **Conventional Commit**: `feat(webmcp): implement client-side WebMCP service with feature detection`
- **Scope**:
  - Browser-native `document.modelContext` registration service.
  - Safe feature detection with fallback for non-WebMCP browsers.
  - Structured tool schema builder and error formatter.
- **Acceptance Criteria**:
  - Graceful degradation when `modelContext` is unavailable.
  - Valid registration when `modelContext` is present.

---

### T010: WebMCP Audit & Inspection Tools
- **Branch**: `feat/T010-webmcp-audit-tools`
- **Dependencies**: T008, T009
- **Conventional Commit**: `feat(webmcp): register create_audit, get_findings, and inspect_pattern tools`
- **Scope**:
  - Register `create_audit`, `get_audit`, `get_findings`, `inspect_finding`, `inspect_pattern`.
  - Connect tools to `AuditFacade` and `PatternEngineService`.
- **Acceptance Criteria**:
  - Tools return structured JSON output conforming to schemas.

---

### T011: Remediation Proposal & Diff Viewer UI
- **Branch**: `feat/T011-remediation-proposal`
- **Dependencies**: T008
- **Conventional Commit**: `feat(remediation): implement code remediation proposal and visual diff viewer`
- **Scope**:
  - Side-by-side or unified code diff viewer with accessible styling.
  - Clear explanation of proposed remediation.
  - Propose remediation via WebMCP tool `propose_remediation`.
- **Acceptance Criteria**:
  - Diff view is readable with high color contrast (accessible green/red tokens).

---

### T012: Human Approval Workflow & Security Barrier
- **Branch**: `feat/T012-approval-workflow`
- **Dependencies**: T011
- **Conventional Commit**: `feat(approval): implement human approval barrier for remediation writes`
- **Scope**:
  - Prominent "Approve" and "Reject" actions in the UI.
  - State machine enforcement: `apply_remediation` throws `PermissionDeniedException` if not approved.
  - Rejection with optional feedback note.
- **Acceptance Criteria**:
  - 100% test coverage ensuring no write occurs without prior verified approval.

---

### T013: Verification UI & Evidence Display
- **Branch**: `feat/T013-verification-ui`
- **Dependencies**: T012
- **Conventional Commit**: `feat(verification): implement post-fix verification status and evidence visualization`
- **Scope**:
  - Post-fix verification progress, pass/fail status, and before-vs-after evidence.
  - Expose `verify_remediation` WebMCP tool.
- **Acceptance Criteria**:
  - Visual and screen-reader accessible verification badges and reports.

---

### T014: Regression Test Code Generator UI
- **Branch**: `feat/T014-regression-test-ui`
- **Dependencies**: T013
- **Conventional Commit**: `feat(regression): implement Playwright regression test generator and code exporter`
- **Scope**:
  - View generated Playwright test script.
  - Syntax highlighted display with "Copy to Clipboard" and "Download Test File" buttons.
  - WebMCP tool `generate_regression_test`.
- **Acceptance Criteria**:
  - Generated test code includes valid assertions for keyboard and ARIA compliance.

---

### T015: Accessibility Hardening & Keyboard Navigation Audit
- **Branch**: `feat/T015-a11y-hardening`
- **Dependencies**: T014
- **Conventional Commit**: `test(a11y): conduct full keyboard navigation audit and axe-core verification`
- **Scope**:
  - End-to-end keyboard journey through all views.
  - Verify focus retention, aria-live announcements, skip links, and landmark roles.
  - Zero automated axe-core violations in Playwright tests.
- **Acceptance Criteria**:
  - All automated a11y tests pass cleanly.

---

### T016: Live API Integration & Contract Verification
- **Branch**: `feat/T016-api-integration`
- **Dependencies**: T015
- **Conventional Commit**: `feat(api): integrate and verify live communication with a11yfix-api`
- **Scope**:
  - Connect frontend HTTP client to running `a11yfix-api` instance.
  - Validate OpenAPI contracts and response schemas.
- **Acceptance Criteria**:
  - Live audit submission, progress updates, and remediation flow work seamlessly.

---

### T017: Production Build & Independent Deployment Configuration
- **Branch**: `feat/T017-production-build`
- **Dependencies**: T016
- **Conventional Commit**: `chore(build): optimize production build and configure deployment pipeline`
- **Scope**:
  - Verify tree-shaking, production bundle size budgets, and source maps.
  - Configure runtime environment configuration for API URLs.
  - Deployable as static web application without server-side Node dependency.
- **Acceptance Criteria**:
  - `pnpm run build` succeeds under budget limits.

---

### T018: Final WebMCP End-to-End Agent Validation
- **Branch**: `feat/T018-webmcp-validation`
- **Dependencies**: T017
- **Conventional Commit**: `test(webmcp): validate complete agent-driven audit-to-fix-to-regression cycle`
- **Scope**:
  - Execute full agent workflow via WebMCP tools: detect → understand → propose → approve → fix → verify → prevent regression.
  - Confirm security barrier prevents unauthorized writes in automated agent runs.
- **Acceptance Criteria**:
  - End-to-end agent scenario completes with verified regression test output.
