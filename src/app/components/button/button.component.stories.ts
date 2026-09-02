import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent, ButtonSize, ButtonVariant } from './button.component';

export interface ButtonArgs {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger', 'ghost']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size">Iniciar Auditoría</app-button>`
  })
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size">Inspeccionar Código</app-button>`
  })
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size">Descartar Hallazgo</app-button>`
  })
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true
  },
  render: (args) => ({
    props: args,
    template: `<app-button [variant]="variant" [size]="size" [loading]="loading">Analizando DOM...</app-button>`
  })
};
