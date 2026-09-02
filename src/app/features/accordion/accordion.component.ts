import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let accordionId = 0;

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.accordion-host]': 'true'
  }
})
export class AccordionComponent {
  readonly id = input<string>(`app-accordion-${accordionId++}`);
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');

  readonly expanded = model<boolean>(false);

  protected readonly headerId = computed(() => `${this.id()}-header`);
  protected readonly contentId = computed(() => `${this.id()}-content`);

  protected toggle(): void {
    this.expanded.set(!this.expanded());
  }
}
