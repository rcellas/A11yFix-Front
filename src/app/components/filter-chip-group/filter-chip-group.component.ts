import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { BadgeComponent, BadgeVariant } from '../badge/badge.component';

export interface FilterOption {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
  readonly badgeVariant?: BadgeVariant;
}

@Component({
  selector: 'app-filter-chip-group',
  imports: [BadgeComponent],
  templateUrl: './filter-chip-group.component.html',
  styleUrl: './filter-chip-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'group',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class FilterChipGroupComponent {
  readonly options = input.required<readonly FilterOption[]>();
  readonly ariaLabel = input<string>('Filter options');
  readonly multiSelect = input<boolean>(true);

  readonly selectedIds = model<string[]>([]);

  protected isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  protected toggleOption(id: string): void {
    const current = this.selectedIds();
    if (this.multiSelect()) {
      if (current.includes(id)) {
        this.selectedIds.set(current.filter((item) => item !== id));
      } else {
        this.selectedIds.set([...current, id]);
      }
    } else {
      this.selectedIds.set(current.includes(id) ? [] : [id]);
    }
  }
}
