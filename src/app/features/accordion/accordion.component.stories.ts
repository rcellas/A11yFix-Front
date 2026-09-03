import type { Meta, StoryObj } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';

interface AccordionArgs {
  title: string;
  subtitle?: string;
  expanded: boolean;
}

const meta: Meta<AccordionArgs> = {
  title: 'Patterns/Accordion (Disclosure)',
  component: AccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    expanded: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<AccordionArgs>;

export const DefaultAccordion: Story = {
  args: {
    title: 'WCAG 2.2 Success Criterion 1.4.3 (Contrast Minimum)',
    subtitle: 'Level AA Compliance Rule',
    expanded: true
  },
  render: (args) => ({
    props: args,
    template: `
      <app-accordion [title]="title" [subtitle]="subtitle" [expanded]="expanded">
        <div style="padding: 1rem; color: #334155; font-size: 0.875rem; line-height: 1.5;">
          <p style="margin: 0 0 0.5rem 0;">The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for large text (at least 3:1) and incidental or decorative text.</p>
          <strong style="color: #0f172a;">WAI-ARIA Pattern:</strong> Uses <code>aria-expanded</code> and <code>aria-controls</code> with keyboard Enter/Space activation.
        </div>
      </app-accordion>
    `
  })
};
