import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { BaseWebMcpTool } from '../base-tool';

export interface CreateAuditInput {
  readonly url: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateAuditTool extends BaseWebMcpTool<CreateAuditInput, any> {
  readonly name = 'create_audit';
  readonly description = 'Initiate a new accessibility audit for a given URL.';
  readonly tier = 'PROPOSE' as const;
  override readonly parameters = {
    url: { type: 'string', description: 'Absolute URL of the target webpage to audit', required: true }
  };

  private readonly auditFacade = inject(AuditFacade);

  async execute(input: CreateAuditInput): Promise<any> {
    if (!input?.url) {
      throw new Error('url parameter is required');
    }
    await this.auditFacade.runScan(input.url);
    return {
      status: this.auditFacade.status(),
      report: this.auditFacade.report()
    };
  }
}
