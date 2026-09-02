import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { BaseWebMcpTool } from '../base-tool';

@Injectable({
  providedIn: 'root'
})
export class GetAuditTool extends BaseWebMcpTool<void, any> {
  readonly name = 'get_audit';
  readonly description = 'Retrieve the current active audit report summary and status.';
  readonly tier = 'READ' as const;

  private readonly auditFacade = inject(AuditFacade);

  execute(): any {
    const report = this.auditFacade.report();
    if (!report) {
      return { status: this.auditFacade.status(), message: 'No active audit report available' };
    }
    return {
      id: report.id,
      targetUrl: report.targetUrl,
      timestamp: report.timestamp,
      summary: report.summary
    };
  }
}
