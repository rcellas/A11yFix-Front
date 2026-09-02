import { WcagCriterion } from './wcag-criterion.model';
import { WcagLevel } from './wcag-level.model';

export const WCAG_22_CATALOG: Record<string, WcagCriterion> = {
  // Principle 1: Perceivable
  '1.1.1': {
    id: '1.1.1',
    name: 'Non-text Content',
    principle: 'Perceivable',
    level: 'A',
    description: 'All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content'
  },
  '1.3.1': {
    id: '1.3.1',
    name: 'Info and Relationships',
    principle: 'Perceivable',
    level: 'A',
    description: 'Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships'
  },
  '1.4.1': {
    id: '1.4.1',
    name: 'Use of Color',
    principle: 'Perceivable',
    level: 'A',
    description: 'Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color'
  },
  '1.4.3': {
    id: '1.4.3',
    name: 'Contrast (Minimum)',
    principle: 'Perceivable',
    level: 'AA',
    description: 'The visual presentation of text and images of text has a contrast ratio of at least 4.5:1 (or 3:1 for large text).',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum'
  },
  '1.4.6': {
    id: '1.4.6',
    name: 'Contrast (Enhanced)',
    principle: 'Perceivable',
    level: 'AAA',
    description: 'The visual presentation of text and images of text has a contrast ratio of at least 7:1 (or 4.5:1 for large text).',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced'
  },
  '1.4.11': {
    id: '1.4.11',
    name: 'Non-text Contrast',
    principle: 'Perceivable',
    level: 'AA',
    description: 'The visual presentation of user interface components and graphical objects has a contrast ratio of at least 3:1 against adjacent colors.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast'
  },
  '1.4.12': {
    id: '1.4.12',
    name: 'Text Spacing',
    principle: 'Perceivable',
    level: 'AA',
    description: 'In content implemented using markup languages that support text style properties, no loss of content or functionality occurs by setting line height, spacing, or word spacing.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/text-spacing'
  },

  // Principle 2: Operable
  '2.1.1': {
    id: '2.1.1',
    name: 'Keyboard',
    principle: 'Operable',
    level: 'A',
    description: 'All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard'
  },
  '2.1.2': {
    id: '2.1.2',
    name: 'No Keyboard Trap',
    principle: 'Operable',
    level: 'A',
    description: 'If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap'
  },
  '2.4.3': {
    id: '2.4.3',
    name: 'Focus Order',
    principle: 'Operable',
    level: 'A',
    description: 'If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-order'
  },
  '2.4.7': {
    id: '2.4.7',
    name: 'Focus Visible',
    principle: 'Operable',
    level: 'AA',
    description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-visible'
  },
  '2.4.11': {
    id: '2.4.11',
    name: 'Focus Not Obscured (Minimum)',
    principle: 'Operable',
    level: 'AA',
    description: 'When an item receives keyboard focus, the item is not entirely hidden due to author-created content.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum'
  },
  '2.4.12': {
    id: '2.4.12',
    name: 'Focus Not Obscured (Enhanced)',
    principle: 'Operable',
    level: 'AAA',
    description: 'When an item receives keyboard focus, no part of the component is hidden by author-created content.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced'
  },
  '2.5.8': {
    id: '2.5.8',
    name: 'Target Size (Minimum)',
    principle: 'Operable',
    level: 'AA',
    description: 'The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where spacing or inline context permits.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum'
  },

  // Principle 3: Understandable
  '3.3.1': {
    id: '3.3.1',
    name: 'Error Identification',
    principle: 'Understandable',
    level: 'A',
    description: 'If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-identification'
  },
  '3.3.2': {
    id: '3.3.2',
    name: 'Labels or Instructions',
    principle: 'Understandable',
    level: 'A',
    description: 'Labels or instructions are provided when content requires user input.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions'
  },

  // Principle 4: Robust
  '4.1.2': {
    id: '4.1.2',
    name: 'Name, Role, Value',
    principle: 'Robust',
    level: 'A',
    description: 'For all user interface components, the name and role can be programmatically determined; states, properties, and values can be set programmatically.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value'
  },
  '4.1.3': {
    id: '4.1.3',
    name: 'Status Messages',
    principle: 'Robust',
    level: 'AA',
    description: 'In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.',
    url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages'
  }
};

/**
 * Helper to retrieve WCAG criterion by ID or rule code
 */
export function getWcagCriterion(id: string): WcagCriterion | undefined {
  return WCAG_22_CATALOG[id];
}

/**
 * Filter catalog criteria by conformance level (A, AA, AAA)
 */
export function getCriteriaByLevel(level: WcagLevel): WcagCriterion[] {
  return Object.values(WCAG_22_CATALOG).filter((criterion) => criterion.level === level);
}
