import type { Meta, StoryObj } from '@storybook/angular';
import { DialogComponent } from './dialog.component';

interface DialogArgs {
  title: string;
  isOpen: boolean;
  closeOnBackdropClick: boolean;
}

const meta: Meta<DialogArgs> = {
  title: 'Patterns/Dialog (Modal)',
  component: DialogComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    isOpen: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<DialogArgs>;

export const AccessibleModalDialog: Story = {
  args: {
    title: 'Confirm Remediation Patch',
    isOpen: true,
    closeOnBackdropClick: true
  },
  render: (args) => ({
    props: args,
    template: `
      <app-dialog [title]="title" [isOpen]="isOpen" [closeOnBackdropClick]="closeOnBackdropClick">
        <p>Applying this WCAG 2.2 AA patch will update semantic landmarks in target repository.</p>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button type="button" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer;">Cancel</button>
          <button type="button" style="padding: 0.5rem 1rem; border-radius: 6px; border: none; background: #4338ca; color: #fff; cursor: pointer;">Confirm & Apply</button>
        </div>
      </app-dialog>
    `
  })
};
