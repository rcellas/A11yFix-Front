import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class CardComponent {
  readonly elevated = input<boolean>(false);
  readonly interactive = input<boolean>(false);
  readonly padding = input<CardPadding>('md');

  protected readonly hostClasses = computed(() => {
    const classes = ['card', `card-padding-${this.padding()}`];
    if (this.elevated()) classes.push('card-elevated');
    if (this.interactive()) classes.push('card-interactive');
    return classes.join(' ');
  });
}
