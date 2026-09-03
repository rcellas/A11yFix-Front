import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent, BadgeSize, BadgeVariant } from './badge.component';

export interface BadgeArgs {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const meta: Meta<BadgeArgs> = {
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
type Story = StoryObj<BadgeArgs>;

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

export const WcagLevelAAA: Story = {
  args: {
    variant: 'wcag-aaa',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">WCAG 2.2 Level AAA</app-badge>`
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
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">CRITICAL</app-badge>`
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
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">SERIOUS</app-badge>`
  })
};

export const SeverityModerate: Story = {
  args: {
    variant: 'moderate',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">MODERATE</app-badge>`
  })
};

export const SeverityMinor: Story = {
  args: {
    variant: 'minor',
    size: 'md',
    dot: true
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size" [dot]="dot">MINOR</app-badge>`
  })
};

export const StatusSuccess: Story = {
  args: {
    variant: 'success',
    size: 'md'
  },
  render: (args) => ({
    props: args,
    template: `<app-badge [variant]="variant" [size]="size">VERIFIED</app-badge>`
  })
};
