# Constitution of A11yFix Web

This Constitution defines the immutable principles, non-negotiable architectural constraints, and engineering tenets of the **A11yFix Web** frontend application.

---

## Article I: Mission & Product Loop

A11yFix is an agent-native accessibility QA application that empowers AI agents and human developers to collaborate seamlessly.

The core product loop is:
```text
Detect
  → Understand
  → Propose
  → Approve
  → Fix
  → Verify
  → Prevent Regression
```

Human oversight is central. Agents propose; humans evaluate and approve; verified changes prevent regressions.

---

## Article II: Accessibility-First (Self-Exemplar)

1. The A11yFix user interface must itself be an exemplar of accessibility, complying with **WCAG 2.2 Level AA** at minimum and striving for **Level AAA**.
2. Accessible by design:
   - Full keyboard navigation without traps.
   - Visible, distinct focus indicators.
   - Meaningful semantic HTML and ARIA landmarks.
   - Accessible names for all interactive controls.
   - Color is never the sole medium for conveying information or severity.
   - Live region status announcements for asynchronous operations.
3. The demo target application embedded for auditing may contain intentional accessibility bugs, but the A11yFix application shell, workspace, and design system must be violation-free.

---

## Article III: WCAG 2.2 Conformance Transparency

1. Every audit finding, violation, and rule check must explicitly expose:
   - Success Criterion ID (e.g. `2.1.1`, `2.4.3`, `4.1.2`, `2.5.8`).
   - Criterion Name.
   - Principle (Perceivable, Operable, Understandable, Robust).
   - **Conformance Level**: **Level A**, **Level AA**, or **Level AAA**.
2. The user interface must provide clear badges and filters allowing developers to inspect violations grouped by WCAG conformance level and impact.

---

## Article IV: WAI-ARIA APG Pattern Remediation Engine

A11yFix does not merely list errors—it educates and remediates based on the **WAI-ARIA Authoring Practices Guide (APG)** standards. The system provides structured inspection and remediation for core patterns:
1. **Dialog / Modal**: Focus containment (trap), initial focus setting, restoration of focus upon close, `Esc` dismiss, accessible name (`aria-labelledby`), and `aria-modal="true"`.
2. **Tabs**: Arrow key navigation (`Left`/`Right` or `Up`/`Down`), `tabindex="0"` for active tab and `-1` for inactive tabs, `aria-selected`, and `aria-controls` panel linkage.
3. **Disclosure / Accordion**: Semantic triggers (`<details>`/`<summary>` or `<button>`), `aria-expanded` synchronization, and `aria-controls`.
4. **Combobox / Autocomplete**: Input with `role="combobox"`, `aria-expanded`, popup listbox, keyboard arrow traversal via `aria-activedescendant`, selection on `Enter`, dismiss on `Esc`.

---

## Article V: Clean Architecture, Clean Code, OOP & KISS

1. **Layer Separation**:
   - **Presentation Layer**: Pure, reusable presentation components adhering to Atomic Design. Templates contain zero business logic.
   - **Application Layer**: Application Facades and UI Use Cases orchestrating state transitions.
   - **Infrastructure Layer**: HTTP Adapters communicating with `a11yfix-api`, WebMCP tool registration adapter.
2. **KISS (Keep It Simple, Stupid)**:
   - Prefer straightforward, readable implementations.
   - Avoid over-engineering, unnecessary meta-programming, or unneeded global libraries.
3. **OOP & Domain Modeling**:
   - Clean encapsulation, typed contracts, and polymorphism for pattern inspection and remediation strategies.
   - Discriminated union types for state transitions instead of boolean soup.

---

## Article VI: Strict Frontend Boundaries

1. The frontend repository is strictly responsible for presentation, user interaction, WebMCP tool registration, and API consumption.
2. **Prohibited in Frontend**:
   - Database operations or persistence logic.
   - Playwright browser execution or headless crawling (executed by the backend API).
   - Server-side accessibility audit engines (e.g., backend axe-core engine).
   - AI framework abstractions such as Genkit.
3. The frontend consumes the backend OpenAPI contract without duplicating domain business rules.

---

## Article VII: Browser-Native Client-Side WebMCP Host

1. WebMCP is browser-native, operating via `document.modelContext.registerTool` (with fallback to `navigator.modelContext`).
2. WebMCP must never be implemented via SSE, stdio, or backend WebSocket bridges in this frontend.
3. **Permission Tiers**:
   - `READ`: Information gathering (`get_audit`, `get_findings`, `inspect_finding`, `inspect_pattern`).
   - `PROPOSE`: Generation (`create_audit`, `propose_remediation`, `generate_regression_test`).
   - `WRITE`: Modification (`apply_remediation`).
4. **Mandatory Approval Barrier**:
   - `WRITE` operations cannot execute without verified human approval state.
5. **Graceful Fallback**:
   - If WebMCP is unavailable in the user's browser, the application provides a complete, seamless human UI experience.

---

## Article VIII: Isolated Component Development via Storybook

1. Reusable design system components (atoms, molecules, organisms, templates) must be developed and documented in Storybook.
2. Every story is verified with `@storybook/addon-a11y` to guarantee automated accessibility compliance before component composition.

---

## Article IX: Spec-Driven & Test-First Development

1. The SDD specifications (`specs/001-a11yfix-web/`) are authoritative.
2. Component and facade logic must be validated using **Vitest**.
3. Critical user journeys, keyboard navigation, and regression tests must be validated using **Playwright**.
4. Tests are written alongside or prior to implementation.

---

## Article X: Disciplined Git Flow & Conventional Commits

1. **`main` is production baseline**: Never merge to `main` until explicitly instructed by the user.
2. **`dev` is the integration branch**: All task branches (`feat/TXXX-...`, `fix/TXXX-...`) branch from `dev` and merge into `dev`.
3. **Conventional Commits**: Every commit strictly adheres to Conventional Commits format (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`, `perf`).
