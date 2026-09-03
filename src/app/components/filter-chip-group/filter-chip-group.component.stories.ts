import type { Meta, StoryObj } from '@storybook/angular';
import { FilterChipGroupComponent, FilterOption } from './filter-chip-group.component';

export interface FilterChipGroupArgs {
  options: readonly FilterOption[];
  ariaLabel?: string;
  multiSelect?: boolean;
  selectedIds?: string[];
}

const meta: Meta<FilterChipGroupArgs> = {
  title: 'Components/FilterChipGroup',
  component: FilterChipGroupComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<FilterChipGroupArgs>;

export const WcagLevelFilters: Story = {
  args: {
    ariaLabel: 'Filter by WCAG 2.2 Conformance Level',
    multiSelect: true,
    options: [
      { id: 'wcag-a', label: 'Level A', count: 4, badgeVariant: 'wcag-a' },
      { id: 'wcag-aa', label: 'Level AA', count: 9, badgeVariant: 'wcag-aa' },
      { id: 'wcag-aaa', label: 'Level AAA', count: 2, badgeVariant: 'wcag-aaa' }
    ]
  }
};

export const SeverityFilters: Story = {
  args: {
    ariaLabel: 'Filter by finding severity',
    multiSelect: true,
    options: [
      { id: 'critical', label: 'Critical', count: 3, badgeVariant: 'critical' },
      { id: 'serious', label: 'Serious', count: 5, badgeVariant: 'serious' },
      { id: 'moderate', label: 'Moderate', count: 4, badgeVariant: 'moderate' },
      { id: 'minor', label: 'Minor', count: 3, badgeVariant: 'minor' }
    ]
  }
};
