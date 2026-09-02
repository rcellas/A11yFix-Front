import { PatternRule, PatternType } from './pattern-type.model';

export const APG_PATTERNS: Record<PatternType, PatternRule> = {
  dialog: {
    id: 'apg-dialog',
    name: 'Modal Dialog',
    description: 'A window overlaid on the primary content, rendering the rest of the page inert until dismissed.',
    requiredAttributes: ['aria-modal="true"', 'aria-labelledby="[dialog-title-id]"'],
    requiredRoles: ['role="dialog" or <dialog>'],
    keyboardRequirements: [
      'Focus is trapped within the dialog container',
      'Escape key closes the dialog',
      'Initial focus is placed on the first focusable element or dialog container',
      'Focus returns to triggering element upon dismiss'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/'
  },
  tabs: {
    id: 'apg-tabs',
    name: 'Tabs Pattern',
    description: 'A set of layered sections of content, displaying one panel at a time.',
    requiredAttributes: ['aria-selected="true|false"', 'aria-controls="[panel-id]"'],
    requiredRoles: ['role="tablist"', 'role="tab"', 'role="tabpanel"'],
    keyboardRequirements: [
      'Left/Right arrow keys navigate between tabs with roving tabindex',
      'Home/End keys navigate to first/last tab',
      'Tab key moves focus from active tab into active tabpanel'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/'
  },
  accordion: {
    id: 'apg-accordion',
    name: 'Accordion / Disclosure',
    description: 'Vertically stacked list of headers that reveal or hide associated sections of content.',
    requiredAttributes: ['aria-expanded="true|false"', 'aria-controls="[section-id]"'],
    requiredRoles: ['<button> or <details>/<summary>', 'role="region" for panels with accessible name'],
    keyboardRequirements: [
      'Enter and Space toggle section expanded state',
      'Tab navigates sequentially between accordion header buttons'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/'
  },
  combobox: {
    id: 'apg-combobox',
    name: 'Combobox with Listbox',
    description: 'A composite widget made up of an input and an associated popup listbox.',
    requiredAttributes: ['aria-expanded="true|false"', 'aria-autocomplete="list"', 'aria-activedescendant="[opt-id]"'],
    requiredRoles: ['role="combobox"', 'role="listbox"', 'role="option"'],
    keyboardRequirements: [
      'Down/Up arrow keys navigate listbox options',
      'Enter selects the highlighted option and closes popup',
      'Escape key closes popup without changing selection'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/'
  }
};
