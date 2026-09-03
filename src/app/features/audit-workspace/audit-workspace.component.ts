import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, ButtonComponent, CardComponent, TextFieldComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { FindingSeverity, PatternType } from '../../core/models';
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

  // Custom tool options
  readonly selectedSeverityFilter = signal<string>('all');
  readonly selectedPatternFilter = signal<PatternType>('dialog');

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

  closeWebMcpPanel(): void {
    this.showWebMcpPanel.set(false);
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
      const currentFindingId = currentFinding ? currentFinding.id : undefined;

      if (toolName === 'create_audit') {
        // Runs a full website audit for the entire URL
        const urlToScan = this.urlInput().trim() || 'https://example.com';
        args = { url: urlToScan };
      } else if (toolName === 'get_audit') {
        args = { auditId: currentReport?.id || 'audit-1' };
      } else if (toolName === 'get_findings') {
        const sev = this.selectedSeverityFilter();
        args = sev !== 'all' ? { severity: sev } : {};
      } else if (toolName === 'inspect_finding') {
        args = currentFindingId ? { findingId: currentFindingId } : {};
      } else if (toolName === 'inspect_pattern') {
        args = { patternType: this.selectedPatternFilter() };
      } else if (toolName === 'propose_remediation') {
        args = currentFindingId ? { findingId: currentFindingId } : {};
      } else if (toolName === 'generate_regression_test') {
        args = currentFindingId ? { findingId: currentFindingId } : {};
      } else if (toolName === 'apply_remediation') {
        args = currentFindingId ? { findingId: currentFindingId } : {};
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
