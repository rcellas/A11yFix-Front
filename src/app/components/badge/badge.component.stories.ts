import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'wcag-a',
        'wcag-aa',
        'wcag-aaa',
        'critical',
        'serious',
        'moderate',
        'minor',
        'success',
        'warning',
        'danger',
        'info',
        'neutral'
      ]
    },
    size: {
      control: 'select',
      options: ['sm', 'md']
    },
    dot: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const WcagLevelAA: Story = {
  args: {
    variant: 'wcag-aa',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">WCAG 2.2 Level AA</app-badge>`
  })
};

export const SeverityCritical: Story = {
  args: {
    variant: 'critical',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">Crítica</app-badge>`
  })
};

export const SeveritySerious: Story = {
  args: {
    variant: 'serious',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">Grave</app-badge>`
  })
};

export const StatusSuccess: Story = {
  args: {
    variant: 'success',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size">Verificado</app-badge>`
  })
};
