import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  viewChild
} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { ButtonComponent } from '../../components/button/button.component';

let dialogId = 0;

@Component({
  selector: 'app-dialog',
  imports: [A11yModule, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.escape)': 'handleEscape($event)'
  }
})
export class DialogComponent {
  readonly id = input<string>(`app-dialog-${dialogId++}`);
  readonly isOpen = input<boolean>(false);
  readonly title = input.required<string>();
  readonly closeOnBackdropClick = input<boolean>(true);

  readonly closed = output<void>();

  private previouslyFocusedElement: HTMLElement | null = null;
  protected readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialogElement');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.previouslyFocusedElement = document.activeElement as HTMLElement;
      } else if (this.previouslyFocusedElement) {
        // Restore focus upon close (WAI-ARIA APG standard)
        setTimeout(() => this.previouslyFocusedElement?.focus(), 0);
      }
    });
  }

  protected readonly titleId = computed(() => `${this.id()}-title`);

  protected handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick() && event.target === event.currentTarget) {
      this.close();
    }
  }

  protected handleEscape(event: Event): void {
    if (this.isOpen()) {
      event.preventDefault();
      this.close();
    }
  }

  close(): void {
    this.closed.emit();
  }
}
