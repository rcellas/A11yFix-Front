# ADR 0006: WCAG 2.2 Classification, Mapping, and Conformance Level Visibility

## Status
Accepted

## Context
Developers and auditors need precise understanding of which WCAG 2.2 guidelines and success criteria are being violated, along with their exact conformance level (Level A, Level AA, Level AAA). Generic severity tags (e.g. "critical" or "serious") are insufficient for legal compliance and technical triage.

## Decision
1. **WCAG 2.2 Domain Taxonomy**:
   We model a strongly typed WCAG 2.2 taxonomy within the core contracts:
   ```typescript
   export type WcagLevel = 'A' | 'AA' | 'AAA';

   export type WcagPrinciple =
     | 'Perceivable'
     | 'Operable'
     | 'Understandable'
     | 'Robust';

   export interface WcagCriterion {
     readonly id: string;           // e.g. "2.1.1"
     readonly name: string;         // e.g. "Keyboard"
     readonly level: WcagLevel;     // 'A' | 'AA' | 'AAA'
     readonly principle: WcagPrinciple;
     readonly guideline: string;    // e.g. "2.1 Keyboard Accessible"
     readonly url: string;          // Official W3C URL
   }
   ```

2. **Core WCAG 2.2 Criteria Mappings in A11yFix**:
   - **Level A**:
     - `1.1.1 Non-text Content`
     - `1.3.1 Info and Relationships`
     - `2.1.1 Keyboard`
     - `2.1.2 No Keyboard Trap`
     - `2.4.3 Focus Order`
     - `3.2.1 On Focus`
     - `3.2.2 On Input`
     - `4.1.2 Name, Role, Value`
   - **Level AA**:
     - `1.4.3 Contrast (Minimum)`
     - `2.4.7 Focus Visible`
     - `2.4.11 Focus Not Obscured (Minimum)` *(WCAG 2.2 New)*
     - `2.5.8 Target Size (Minimum)` *(WCAG 2.2 New)*
   - **Level AAA**:
     - `1.4.6 Contrast (Enhanced)`
     - `2.1.3 Keyboard (No Exception)`
     - `2.4.12 Focus Not Obscured (Enhanced)` *(WCAG 2.2 New)*
     - `2.5.5 Target Size (Enhanced)`

3. **UI Badges & Filtering**:
   - Every finding item displays a prominent conformance badge (`Level A` in Indigo, `Level AA` in Blue, `Level AAA` in Violet).
   - The findings workspace provides interactive filter chips to filter findings by Level (A / AA / AAA) and WCAG Principle.

## Consequences
### Positive
- Transparent compliance auditing aligned with European Accessibility Act (EAA), Section 508, and W3C standards.
- Enables developers to prioritize critical Level A and AA blockers required for standard web compliance.

### Negative
- Requires maintaining the WCAG 2.2 reference dictionary in the frontend models.
