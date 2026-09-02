import type { Meta, StoryObj } from '@storybook/angular';
import { TextFieldComponent } from './text-field.component';

const meta: Meta<TextFieldComponent> = {
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
type Story = StoryObj<TextFieldComponent>;

export const Default: Story = {
  args: {
    label: 'URL de Auditoría',
    placeholder: 'https://ejemplo.com',
    helperText: 'Introduce la URL pública que deseas auditar.',
    required: true,
    type: 'url'
  }
};

export const WithError: Story = {
  args: {
    label: 'URL de Auditoría',
    placeholder: 'https://ejemplo.com',
    errorMessage: 'La URL debe comenzar con https:// y ser accesible públicamente.',
    required: true,
    type: 'url'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Selector CSS del elemento',
    placeholder: 'div.main-header button',
    disabled: true,
    helperText: 'Campo deshabilitado mientras se procesa la auditoría.'
  }
};
