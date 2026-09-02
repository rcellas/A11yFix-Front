# ADR 0005: WAI-ARIA APG Pattern Remediation Engine

## Status
Accepted

## Context
Accessibility violations cannot be solved by simply guessing fixes or adding random `aria-*` tags. The W3C WAI-ARIA Authoring Practices Guide (APG) defines authoritative interaction patterns for composite widgets. The A11yFix UI must inspect detected anti-patterns, explain the expected behavior, and present exact, proven remediations.

## Decision
We establish a dedicated Pattern Remediation Engine in the frontend that models 4 core interactive patterns using polymorphic domain strategies:

### 1. Dialog (Modal) Pattern
- **Expected APG Behavior**:
  - Focus moves into the dialog upon opening (to first interactive element or dialog title).
  - Focus is trapped inside the dialog (Tab wraps from last to first; Shift+Tab wraps from first to last).
  - Pressing `Escape` closes the dialog.
  - Upon closing, focus is restored to the element that triggered it.
  - Requires `role="dialog"` or native `<dialog>`, `aria-modal="true"`, and accessible name via `aria-labelledby`.
- **Anti-Patterns Detected**:
  - Focus remains in background page; no keyboard trap; missing accessible label; background elements accessible via screen reader.
- **Remediation Strategy**:
  - Replace non-semantic `<div>` modal with native `<dialog>` or apply focus trap directive, `aria-modal="true"`, and focus restoration logic.

### 2. Tabs Pattern
- **Expected APG Behavior**:
  - Container has `role="tablist"` with accessible name.
  - Tab items have `role="tab"`, `aria-selected="true/false"`, and `aria-controls="panel-id"`.
  - Active tab has `tabindex="0"`; inactive tabs have `tabindex="-1"`.
  - Arrow keys (`Left`/`Right` or `Up`/`Down`) cycle through tabs (roving tabindex).
  - Content panels have `role="tabpanel"`, `aria-labelledby="tab-id"`, and `tabindex="0"` if scrollable.
- **Anti-Patterns Detected**:
  - Tab list is navigated via `Tab` key rather than arrows; missing ARIA roles; panels not linked to tabs.
- **Remediation Strategy**:
  - Add roving tabindex keyboard handler and proper ARIA role associations.

### 3. Disclosure / Accordion Pattern
- **Expected APG Behavior**:
  - Interactive trigger is a `<button>` or `<summary>` with `aria-expanded="true/false"`.
  - Trigger controls collapsible container via `aria-controls`.
  - Activated by `Enter` or `Space`.
  - Hidden content is removed from accessibility tree (using `hidden` attribute or `display: none`).
- **Anti-Patterns Detected**:
  - Non-button triggers (`<div onclick>`); missing `aria-expanded`; hidden content visible to screen reader via CSS opacity.
- **Remediation Strategy**:
  - Convert trigger to `<button>` with reactive `aria-expanded` and explicit DOM hiding.

### 4. Combobox / Autocomplete Pattern
- **Expected APG Behavior**:
  - Input has `role="combobox"`, `aria-expanded="true/false"`, `aria-haspopup="listbox"`, `aria-controls="listbox-id"`.
  - Options container has `role="listbox"`; options have `role="option"` and `aria-selected="true/false"`.
  - Keyboard: `DownArrow` opens popup and navigates options using `aria-activedescendant`; `Enter` selects; `Escape` closes and clears.
- **Anti-Patterns Detected**:
  - Plain text input with unlinked dropdown; options not keyboard selectable; missing active descendant announcement.
- **Remediation Strategy**:
  - Implement full combobox ARIA 1.2 semantics and keyboard navigation controller.

## Consequences
### Positive
- Clear, standardized remediation advice for agents and human developers.
- Prepares verified code snippets and diffs ready for review.

### Negative
- Domain catalog must be maintained and updated as new APG patterns are introduced.
