import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, TextFieldComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';

@Component({
  selector: 'app-audit-workspace',
  standalone: true,
  imports: [FormsModule, ButtonComponent, TextFieldComponent],
  templateUrl: './audit-workspace.component.html',
  styleUrl: './audit-workspace.component.css'
})
export class AuditWorkspaceComponent {
  readonly auditFacade = inject(AuditFacade);

  readonly urlInput = signal<string>('https://example.com');
  readonly errorMessage = signal<string | null>(null);

  onUrlChange(newUrl: string): void {
    this.urlInput.set(newUrl);
    this.errorMessage.set(null);
  }

  async startAudit(): Promise<void> {
    const url = this.urlInput().trim();
    if (!url) {
      this.errorMessage.set('Please provide a valid website URL to scan.');
      return;
    }

    try {
      new URL(url);
    } catch {
      this.errorMessage.set('Please enter a valid absolute URL (e.g., https://example.com)');
      return;
    }

    this.errorMessage.set(null);
    await this.auditFacade.runScan(url);
  }
}
