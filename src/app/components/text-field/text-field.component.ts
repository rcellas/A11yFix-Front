import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-text-field',
  imports: [],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.text-field-host]': 'true'
  }
})
export class TextFieldComponent {
  readonly id = input<string>(`app-text-field-${nextId++}`);
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly helperText = input<string>('');
  readonly errorMessage = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly type = input<'text' | 'url' | 'email' | 'search'>('text');

  readonly value = model<string>('');

  protected readonly hasError = computed(() => Boolean(this.errorMessage()));

  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.errorMessage()) ids.push(`${this.id()}-error`);
    if (this.helperText()) ids.push(`${this.id()}-helper`);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }
}
