import type { Meta, StoryObj } from '@storybook/angular';
import { TextFieldComponent } from './text-field.component';

export interface TextFieldArgs {
  label: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'url' | 'email' | 'search';
  value?: string;
}

const meta: Meta<TextFieldArgs> = {
  title: 'Components/TextField',
  component: TextFieldComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'url', 'email', 'search']
    }
  }
};

export default meta;
type Story = StoryObj<TextFieldArgs>;

export const Default: Story = {
  args: {
    label: 'Target Website URL',
    placeholder: 'https://example.com',
    helperText: 'Enter a valid public URL to perform WCAG 2.2 accessibility QA scan.',
    required: true,
    type: 'url'
  }
};

export const WithError: Story = {
  args: {
    label: 'Target Website URL',
    placeholder: 'https://example.com',
    errorMessage: 'Please enter a valid absolute URL starting with https://',
    required: true,
    type: 'url'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Target CSS Selector',
    placeholder: 'button.nav-icon[aria-label]',
    disabled: true,
    helperText: 'Disabled during automated scanning.'
  }
};
