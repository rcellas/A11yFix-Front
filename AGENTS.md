# AGENTS.md — A11yFix Web Engineering Guidelines

Welcome to the **A11yFix Web** repository. This document is authoritative for all AI agents and engineers contributing to the codebase.

---

## 1. Project Overview & Role

* **Repository**: `A11yFix-Front` (Frontend only).
* **Companion Backend**: `a11yfix-api` (Maintained separately; never import or replicate backend code).
* **Product**: A11yFix is an agent-native accessibility QA application (Detect → Understand → Propose → Approve → Fix → Verify → Prevent Regression).
* **Role**: Lead frontend engineer and implementation agent.
* **Host**: A11yFix Web is a browser-native client-side **WebMCP host**.

---

## 2. Fundamental Philosophy: Clean Code, SOLID, OOP & KISS

Every piece of code must be written with the highest craftsmanship standards:

1. **KISS (Keep It Simple, Stupid)**:
   - Prefer simple, readable, expressive solutions over premature abstractions or complex meta-programming.
   - Do not create global state abstractions (e.g. NgRx) or wrappers unless an explicit requirement demands it.
2. **OOP & Domain Modeling**:
   - Encapsulate data and behaviors in clear TypeScript interfaces, types, and domain classes.
   - Use polymorphism and strategy patterns for pattern inspection and remediation without large switch/if-else ladders.
   - Strict typing: Prohibit `any` unless technically justified and documented.
3. **Clean Code & Single Responsibility Principle (SRP)**:
   - Components only handle presentation and user gestures.
   - Application Facades coordinate use cases and state transitions.
   - Infrastructure Adapters handle external communication (API HTTP calls, WebMCP registrations).
   - Zero business or audit logic inside component templates or presentation files.
4. **Accessibility-First**:
   - The application itself must strictly comply with **WCAG 2.2 Level AA** minimum (and target AAA where feasible).
   - Every interactive element has accessible names, visible focus states, proper landmarks, keyboard navigation, and announcement semantics.

---

## 3. Technology Stack & Architectural Standards

* **Framework**: Angular (modern standalone architecture, standalone by default).
* **Reactivity & State**: Angular Signals (`signal()`, `computed()`, `input()`, `output()`, `model()`).
* **State Modeling**: Explicit Discriminated Unions and State Machines (e.g. `AuditState`, `RemediationState`). No "boolean soup" (`isLoading`, `isFailed`, `isApproved`).
* **Styling**: SCSS with design tokens (`src/app/design-system/tokens/`). Avoid ad-hoc inline styles.
* **Testing**:
  - **Vitest**: Unit, facade, state machine, and component logic tests.
  - **Playwright**: End-to-end user journeys, keyboard navigation, focus trap verification.
  - **Storybook + `@storybook/addon-a11y`**: Component catalog and isolated accessibility verification.
* **Package Manager**: `pnpm`.

---

## 4. Frontend Architecture & Layers

```text
Presentation Layer
  ├── Design System (Atomic: atoms, molecules, organisms, templates)
  └── Feature Views (Dashboard, Audit Workspace, Findings, Pattern Inspection, Remediation, Verification)
         ↓
Application Layer
  ├── Feature Facades (e.g., AuditFacade, RemediationFacade)
  └── UI State Machines (Signals & Discriminated Unions)
         ↓
Infrastructure Layer
  ├── API Client & HTTP Adapters (communicating with a11yfix-api)
  └── WebMCP Client Adapter (registering tools in document.modelContext)
```

---

## 5. WebMCP Guidelines

1. **Browser-Native & Client-Side**:
   - WebMCP is registered via `document.modelContext.registerTool` (with fallback to `navigator.modelContext`).
   - WebMCP is NOT a backend protocol; do NOT use SSE, stdio, or WebSocket transports for WebMCP in this frontend.
2. **Graceful Fallback**:
   - If WebMCP is unavailable or disabled in the browser, the application must function flawlessly for human users.
3. **Permission Tiers**:
   - `READ`: `get_audit`, `get_findings`, `inspect_finding`, `inspect_pattern`.
   - `PROPOSE`: `create_audit`, `propose_remediation`, `generate_regression_test`.
   - `WRITE`: `apply_remediation`.
4. **Mandatory Human Approval Barrier**:
   - `WRITE` operations (`apply_remediation`) CANNOT execute without verified human approval in the application state. WebMCP tools must reject unapproved modifications.

---

## 6. WCAG 2.2 Transparency & Pattern Engine

1. **WCAG 2.2 Categorization**:
   - Every finding and rule violation must expose its exact WCAG 2.2 Success Criterion ID, name, principle, and **Conformance Level: Level A, Level AA, or Level AAA**.
2. **WAI-ARIA APG Pattern Guidance**:
   - Provide concrete remediation for supported patterns:
     - **Dialog**: Focus trap, initial focus, escape key dismiss, focus return to trigger, `aria-modal="true"`.
     - **Tabs**: Arrow key navigation, `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`.
     - **Disclosure / Accordion**: `aria-expanded` toggle, `<details>`/`<summary>` or `<button>` semantics.
     - **Combobox**: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, listbox navigation.

---

## 7. Spec-Driven Development (SDD) Workflow

1. The specifications in `specs/` are authoritative. Code changes contradicting the spec are invalid.
2. Repository structure:
   ```text
   AGENTS.md
   docs/
   ├── constitution.md
   └── adr/
   specs/
   └── 001-a11yfix-web/
       ├── spec.md
       ├── clarification.md
       ├── plan.md
       └── tasks.md
   ```

---

## 8. Git Branching & Conventional Commits

1. **Branching Model**:
   - `main`: Production release branch. **Never merge to `main` until explicitly instructed by the user.**
   - `dev`: Primary integration branch.
   - `spec/001-sdd-creation`: SDD baseline branch, merges into `dev`.
   - `feat/TXXX-description`: Feature branches created from `dev` and merged back into `dev`.
   - `fix/TXXX-description`: Bugfix branches created from `dev` and merged back into `dev`.
2. **Conventional Commits**:
   - Mandatory on EVERY commit.
   - Format: `<type>(<scope>): <subject>`
   - Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`, `perf`.
   - Examples:
     - `feat(audit): implement audit URL submission form`
     - `docs(adr): add WCAG 2.2 classification decision record`
     - `test(dialog): verify focus trap and escape key navigation`
     - `chore(deps): configure storybook with a11y addon`
   - Never commit with vague messages like `update`, `fix`, or `wip`.
