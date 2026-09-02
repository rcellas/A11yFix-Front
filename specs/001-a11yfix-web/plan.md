# Architectural & Implementation Plan: 001-a11yfix-web

## 1. Directory Layout & Module Structure

The project strictly organizes files according to Clean Architecture and Pragmatic Atomic Design:

```text
src/
├── app/
│   ├── core/
│   │   ├── contracts/            # Interfaces, types, WCAG taxonomy, APG pattern types
│   │   │   ├── wcag.types.ts
│   │   │   ├── pattern.types.ts
│   │   │   ├── audit.types.ts
│   │   │   └── remediation.types.ts
│   │   ├── state/                # State machines & discriminated unions
│   │   │   ├── audit.state.ts
│   │   │   └── remediation.state.ts
│   │   ├── services/             # Application facades & adapters
│   │   │   ├── audit.facade.ts
│   │   │   ├── remediation.facade.ts
│   │   │   ├── pattern-engine.service.ts
│   │   │   ├── api-client.service.ts
│   │   │   └── webmcp.service.ts
│   │   └── webmcp/               # Client WebMCP tool definitions
│   │       ├── webmcp.adapter.ts
│   │       └── tools/
│   │           ├── audit.tools.ts
│   │           ├── finding.tools.ts
│   │           └── remediation.tools.ts
│   │
│   ├── design-system/            # Atomic Design System & Storybook catalog
│   │   ├── tokens/               # SCSS token definitions (variables, maps)
│   │   │   ├── _colors.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _spacing.scss
│   │   │   ├── _elevation.scss
│   │   │   └── _focus.scss
│   │   ├── atoms/
│   │   │   ├── button/
│   │   │   ├── badge/            # WCAG Level (A/AA/AAA) & Severity badges
│   │   │   ├── text-field/
│   │   │   └── icon/
│   │   ├── molecules/
│   │   │   ├── filter-chip-group/
│   │   │   ├── code-diff-viewer/
│   │   │   └── progress-bar/
│   │   ├── organisms/
│   │   │   ├── dialog/           # Accessible modal with focus trap
│   │   │   ├── tabs/             # Accessible tabs with roving tabindex
│   │   │   ├── accordion/        # Accessible disclosure
│   │   │   └── combobox/         # Accessible combobox with listbox
│   │   └── templates/
│   │       └── workspace-layout/
│   │
│   ├── features/                 # Route-level feature views
│   │   ├── dashboard/
│   │   ├── audit-workspace/
│   │   ├── findings-explorer/
│   │   ├── pattern-inspector/
│   │   ├── remediation-view/
│   │   └── regression-test-view/
│   │
│   └── shared/                   # Shared utility directives and pipes
│       ├── directives/
│       │   ├── focus-trap.directive.ts
│       │   └── live-announcer.directive.ts
│       └── pipes/
│           └── wcag-format.pipe.ts
│
├── .storybook/                   # Storybook configuration & a11y addon
└── tests/                        # Playwright E2E & a11y journeys
```

---

## 2. Design Tokens Taxonomy

Design tokens in `src/app/design-system/tokens/`:
- **Colors**:
  - Semantic: `primary`, `success`, `warning`, `danger`, `surface`, `background`, `text-primary`, `text-muted`.
  - WCAG Levels: `wcag-level-a` (Indigo), `wcag-level-aa` (Blue), `wcag-level-aaa` (Purple).
  - Severity: `severity-critical` (Crimson), `severity-serious` (Orange), `severity-moderate` (Amber), `severity-minor` (Slate).
- **Focus**:
  - `focus-ring`: `3px solid var(--color-primary)`, offset `2px`.
- **Typography**:
  - Font families, scale, weights, and line heights.

---

## 3. Storybook Catalog

Every atom, molecule, and organism includes:
- `component.ts` (Angular modern standalone component with Signals)
- `component.html` (Accessible semantic markup)
- `component.scss` (Design tokens only; no hardcoded hex/px values)
- `component.spec.ts` (Vitest unit and accessibility tests)
- `component.stories.ts` (Storybook stories with `@storybook/addon-a11y` evaluation)

---

## 4. WebMCP Registration Architecture

The `WebMcpAdapter` initializes on application startup:
1. Detects `document.modelContext` (or `navigator.modelContext`).
2. Registers tools using structured schemas.
3. Delegates all tool execution to the respective Application Facades (`AuditFacade`, `RemediationFacade`, `PatternEngineService`).
4. Ensures approval barriers on WRITE tools.
