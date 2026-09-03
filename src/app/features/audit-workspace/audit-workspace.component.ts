import { UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, TextFieldComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { WebMcpHostService } from '../../core/webmcp/services/webmcp-host.service';

@Component({
  selector: 'app-audit-workspace',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent,
    TextFieldComponent,
    UpperCasePipe
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

  // All-in-one execution state
  readonly isRunningAllIn = signal<boolean>(false);
  readonly allInStatusMessage = signal<string | null>(null);

  // Custom tool options
  readonly selectedSeverityFilter = signal<string>('all');
  readonly selectedPatternFilter = signal<string>('all');

  readonly urlInput = signal<string>('');
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

  resetWorkspace(): void {
    this.urlInput.set('');
    this.errorMessage.set(null);
    this.lastExecutionResult.set(null);
    this.allInStatusMessage.set(null);
    this.webMcpHost.clearLogs();
    this.auditFacade.reset();
    this.selectedWebMcpSubTab.set('tools');
  }

  clearLogs(): void {
    this.webMcpHost.clearLogs();
    this.lastExecutionResult.set(null);
    this.selectedWebMcpSubTab.set('tools');
  }

  onUrlChange(newUrl: string): void {
    this.urlInput.set(newUrl);
    this.errorMessage.set(null);
  }

  async startAudit(): Promise<void> {
    let url = this.urlInput().trim();
    if (!url) {
      this.errorMessage.set('Please provide a valid website URL to scan.');
      return;
    }

    // Auto-normalize URLs missing protocol (e.g., "rociocejudo.dev" -> "https://rociocejudo.dev")
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
      this.urlInput.set(url);
    }

    try {
      new URL(url);
    } catch {
      this.errorMessage.set('Please enter a valid website URL (e.g., rociocejudo.dev or https://example.com)');
      return;
    }

    this.errorMessage.set(null);
    await this.auditFacade.runScan(url);
  }

  async runAllInPipeline(): Promise<void> {
    this.isRunningAllIn.set(true);
    this.lastExecutionResult.set(null);
    let urlToScan = this.urlInput().trim() || 'https://example.com';
    if (!/^https?:\/\//i.test(urlToScan)) {
      urlToScan = `https://${urlToScan}`;
      this.urlInput.set(urlToScan);
    }

    try {
      // 1. Create audit
      this.allInStatusMessage.set('1/4: Running create_audit across target site...');
      await this.webMcpHost.executeToolDirect('create_audit', { url: urlToScan });

      // 2. Fetch findings
      this.allInStatusMessage.set('2/4: Executing get_findings (filtering WCAG 2.2 violations)...');
      await this.webMcpHost.executeToolDirect('get_findings', {});

      // 3. Propose AI remediation for top finding
      const report = this.auditFacade.report();
      const firstFinding = report?.findings[0];
      if (firstFinding) {
        this.allInStatusMessage.set(`3/4: Proposing AI remediation for ${firstFinding.ruleId}...`);
        await this.webMcpHost.executeToolDirect('propose_remediation', { findingId: firstFinding.id });

        // 4. Generate Playwright regression test
        this.allInStatusMessage.set('4/4: Generating Playwright regression test suite...');
        await this.webMcpHost.executeToolDirect('generate_regression_test', { findingId: firstFinding.id });
      }

      this.lastExecutionResult.set(
        JSON.stringify(
          {
            status: 'ALL_IN_PIPELINE_COMPLETE',
            message: 'Full autonomous QA pipeline executed successfully.',
            targetUrl: urlToScan,
            totalFindings: report?.findings.length ?? 0,
            nextStep: 'Human approval required in workspace to apply remediation code.'
          },
          null,
          2
        )
      );
      this.selectedWebMcpSubTab.set('logs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.lastExecutionResult.set(`Error during All-In pipeline: ${msg}`);
      this.selectedWebMcpSubTab.set('logs');
    } finally {
      this.isRunningAllIn.set(false);
      this.allInStatusMessage.set(null);
    }
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

  formatLogOutput(output: unknown): string {
    if (!output) return '';
    if (typeof output === 'string') return output;
    if (typeof output === 'object') {
      try {
        return JSON.stringify(output, null, 2);
      } catch {
        return String(output);
      }
    }
    return String(output);
  }
}
