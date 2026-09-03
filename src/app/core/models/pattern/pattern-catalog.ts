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
  disclosure: {
    id: 'apg-disclosure',
    name: 'Disclosure (Expandable section)',
    description: 'A button that controls the visibility of a section of content.',
    requiredAttributes: ['aria-expanded="true|false"', 'aria-controls="[section-id]"'],
    requiredRoles: ['<button> or <details>/<summary>'],
    keyboardRequirements: [
      'Enter and Space toggle the visibility of the controlled section',
      'Tab moves focus to the disclosure button and next interactive elements'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/'
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
  },
  menu_button: {
    id: 'apg-menu-button',
    name: 'Menu Button (Popup menu)',
    description: 'A button that opens a menu containing choices or actions.',
    requiredAttributes: ['aria-haspopup="menu"', 'aria-expanded="true|false"', 'aria-controls="[menu-id]"'],
    requiredRoles: ['<button>', 'role="menu"', 'role="menuitem"'],
    keyboardRequirements: [
      'Enter, Space, or Down Arrow opens menu and places focus on first item',
      'Up/Down Arrow keys cycle through menu items',
      'Escape closes menu and returns focus to menu button'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/'
  },
  breadcrumb: {
    id: 'apg-breadcrumb',
    name: 'Breadcrumb Navigation',
    description: 'A list of links that indicates the current page location within a navigation hierarchy.',
    requiredAttributes: ['aria-label="Breadcrumb"', 'aria-current="page"'],
    requiredRoles: ['<nav aria-label="Breadcrumb">', '<ol>', '<li>', '<a>'],
    keyboardRequirements: [
      'Tab and Shift+Tab navigate sequentially through breadcrumb links',
      'Enter activates the selected navigation link'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/'
  },
  tooltip: {
    id: 'apg-tooltip',
    name: 'Tooltip',
    description: 'A popup that displays contextual information when focused or hovered.',
    requiredAttributes: ['aria-describedby="[tooltip-id]"'],
    requiredRoles: ['role="tooltip"'],
    keyboardRequirements: [
      'Focusing trigger element displays tooltip',
      'Escape key dismisses tooltip without moving focus',
      'Moving focus away hides tooltip'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/'
  },
  alert_dialog: {
    id: 'apg-alert-dialog',
    name: 'Alert Dialog (Confirmation)',
    description: 'A modal dialog that interrupts user workflow to communicate urgent information or ask for confirmation.',
    requiredAttributes: ['aria-modal="true"', 'aria-labelledby="[title-id]"', 'aria-describedby="[desc-id]"'],
    requiredRoles: ['role="alertdialog"'],
    keyboardRequirements: [
      'Focus is trapped within alert dialog',
      'Initial focus is placed on safest action button (e.g., Cancel)',
      'Escape key closes alert dialog if cancelable'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/'
  },
  accordion: {
    id: 'apg-accordion',
    name: 'Accordion (Multi-section)',
    description: 'Vertically stacked list of headers that reveal or hide associated sections of content.',
    requiredAttributes: ['aria-expanded="true|false"', 'aria-controls="[section-id]"'],
    requiredRoles: ['<button>', 'role="region" with aria-labelledby'],
    keyboardRequirements: [
      'Enter and Space toggle section expanded state',
      'Down/Up Arrow keys navigate accordion header buttons',
      'Home/End navigate to first/last accordion header'
    ],
    apgReferenceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/'
  }
};
