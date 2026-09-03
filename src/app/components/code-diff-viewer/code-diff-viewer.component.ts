import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface DiffLine {
  readonly type: 'added' | 'removed' | 'context';
  readonly content: string;
  readonly lineNumberOld?: number;
  readonly lineNumberNew?: number;
}

@Component({
  selector: 'app-code-diff-viewer',
  imports: [],
  templateUrl: './code-diff-viewer.component.html',
  styleUrl: './code-diff-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.code-diff-host]': 'true'
  }
})
export class CodeDiffViewerComponent {
  readonly diffText = input.required<string>();
  readonly filename = input<string>('remediation.html');

  protected readonly copied = signal<boolean>(false);

  protected readonly parsedLines = computed<DiffLine[]>(() => {
    const raw = this.diffText();
    if (!raw) return [];

    let oldLine = 1;
    let newLine = 1;

    return raw
      .split('\n')
      .filter((line) => line.length > 0 && !line.startsWith('---') && !line.startsWith('+++'))
      .map((line) => {
        if (line.startsWith('+')) {
          return {
            type: 'added',
            content: line.substring(1),
            lineNumberNew: newLine++
          };
        } else if (line.startsWith('-')) {
          return {
            type: 'removed',
            content: line.substring(1),
            lineNumberOld: oldLine++
          };
        } else {
          return {
            type: 'context',
            content: line.startsWith(' ') ? line.substring(1) : line,
            lineNumberOld: oldLine++,
            lineNumberNew: newLine++
          };
        }
      });
  });

  protected async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.diffText());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Gracefully handle clipboard write rejection
    }
  }
}
