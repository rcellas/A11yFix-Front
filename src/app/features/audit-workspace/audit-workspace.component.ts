import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ButtonComponent, CardComponent, TextFieldComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { WebMcpHostService } from '../../core/webmcp/services/webmcp-host.service';

@Component({
  selector: 'app-audit-workspace',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    TextFieldComponent,
    UpperCasePipe,
    JsonPipe
  ],
  templateUrl: './audit-workspace.component.html',
  styleUrl: './audit-workspace.component.css'
})
export class AuditWorkspaceComponent {
  readonly auditFacade = inject(AuditFacade);
  readonly webMcpHost = inject(WebMcpHostService);

  readonly showWebMcpPanel = signal<boolean>(false);
  readonly selectedWebMcpSubTab = signal<'tools' | 'logs'>('tools');
  readonly lastExecutionResult = signal<string | null>(null);

  readonly urlInput = signal<string>('https://example.com');
  readonly errorMessage = signal<string | null>(null);

  get tools() {
    return this.webMcpHost.getToolsList();
  }

  get logs() {
    return this.webMcpHost.executionLogs();
  }

  toggleWebMcpPanel(): void {
    this.showWebMcpPanel.update((open) => !open);
  }

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

  async runQuickTool(toolName: string): Promise<void> {
    this.lastExecutionResult.set(null);
    try {
      let args: Record<string, unknown> = {};
      const currentReport = this.auditFacade.report();
      const currentFinding =
        this.auditFacade.selectedFinding() || (currentReport?.findings && currentReport.findings[0]);
      const currentFindingId = currentFinding ? currentFinding.id : 'audit-1-f1';

      if (toolName === 'create_audit') {
        args = { url: this.urlInput().trim() || 'https://dequeuniversity.com/demo/mars/' };
      } else if (toolName === 'get_audit') {
        args = { auditId: currentReport?.id || 'audit-1' };
      } else if (toolName === 'get_findings') {
        args = { severity: 'critical' };
      } else if (toolName === 'inspect_finding') {
        args = { findingId: currentFindingId };
      } else if (toolName === 'inspect_pattern') {
        args = { patternType: currentFinding?.patternType || 'dialog' };
      } else if (toolName === 'propose_remediation') {
        args = { findingId: currentFindingId };
      } else if (toolName === 'generate_regression_test') {
        args = { findingId: currentFindingId };
      } else if (toolName === 'apply_remediation') {
        args = { findingId: currentFindingId };
      }

      const res = await this.webMcpHost.executeToolDirect(toolName, args);
      this.lastExecutionResult.set(JSON.stringify(res, null, 2));
      this.selectedWebMcpSubTab.set('logs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.lastExecutionResult.set(`Error: ${msg}`);
      this.selectedWebMcpSubTab.set('logs');
    }
  }
}
