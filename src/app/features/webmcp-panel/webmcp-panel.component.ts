import { JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BadgeComponent, ButtonComponent, CardComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { WebMcpHostService } from '../../core/webmcp/services/webmcp-host.service';

@Component({
  selector: 'app-webmcp-panel',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, CardComponent, UpperCasePipe, JsonPipe],
  templateUrl: './webmcp-panel.component.html',
  styleUrl: './webmcp-panel.component.css'
})
export class WebMcpPanelComponent {
  readonly webMcpHost = inject(WebMcpHostService);
  readonly auditFacade = inject(AuditFacade);

  readonly selectedTab = signal<'tools' | 'logs'>('tools');
  readonly lastExecutionResult = signal<string | null>(null);

  get tools() {
    return this.webMcpHost.getToolsList();
  }

  get logs() {
    return this.webMcpHost.executionLogs();
  }

  closePanel(): void {
    this.webMcpHost.togglePanel();
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
        args = { url: 'https://dequeuniversity.com/demo/mars/' };
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
      this.selectedTab.set('logs');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.lastExecutionResult.set(`Error: ${msg}`);
      this.selectedTab.set('logs');
    }
  }
}
