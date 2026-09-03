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

      if (toolName === 'create_audit') {
        args = { url: 'https://dequeuniversity.com/demo/mars/' };
      } else if (toolName === 'get_findings') {
        args = { severity: 'critical' };
      } else if (toolName === 'inspect_pattern') {
        args = { patternType: 'dialog' };
      } else if (toolName === 'generate_regression_test') {
        const finding = this.auditFacade.selectedFinding() || this.auditFacade.report()?.findings[0];
        args = { findingId: finding ? finding.id : 'audit-1-f1' };
      } else if (toolName === 'apply_remediation') {
        const finding = this.auditFacade.selectedFinding() || this.auditFacade.report()?.findings[0];
        args = { findingId: finding ? finding.id : 'audit-1-f1' };
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
