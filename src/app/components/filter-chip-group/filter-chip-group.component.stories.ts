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
    ariaLabel: 'Filtrar por nivel de conformidad WCAG 2.2',
    multiSelect: true,
    options: [
      { id: 'wcag-a', label: 'Nivel A', count: 4, badgeVariant: 'wcag-a' },
      { id: 'wcag-aa', label: 'Nivel AA', count: 9, badgeVariant: 'wcag-aa' },
      { id: 'wcag-aaa', label: 'Nivel AAA', count: 2, badgeVariant: 'wcag-aaa' }
    ]
  }
};

export const SeverityFilters: Story = {
  args: {
    ariaLabel: 'Filtrar por severidad de hallazgo',
    multiSelect: true,
    options: [
      { id: 'critical', label: 'Crítica', count: 3, badgeVariant: 'critical' },
      { id: 'serious', label: 'Grave', count: 5, badgeVariant: 'serious' },
      { id: 'moderate', label: 'Moderada', count: 4, badgeVariant: 'moderate' },
      { id: 'minor', label: 'Menor', count: 3, badgeVariant: 'minor' }
    ]
  }
};
