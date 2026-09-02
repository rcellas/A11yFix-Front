import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant =
  | 'wcag-a'
  | 'wcag-aa'
  | 'wcag-aaa'
  | 'critical'
  | 'serious'
  | 'moderate'
  | 'minor'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
  readonly size = input<BadgeSize>('md');
  readonly dot = input<boolean>(false);

  protected readonly hostClasses = computed(() => {
    return `badge badge-${this.variant()} badge-${this.size()}`;
  });
}
