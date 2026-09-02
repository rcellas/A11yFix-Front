import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { BaseWebMcpTool } from '../base-tool';

export interface GetFindingsInput {
  readonly severity?: string;
  readonly wcagLevel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetFindingsTool extends BaseWebMcpTool<GetFindingsInput, any> {
  readonly name = 'get_findings';
  readonly description = 'List findings from the current audit with optional filtering by severity or WCAG level.';
  readonly tier = 'READ' as const;
  override readonly parameters = {
    severity: { type: 'string', description: 'Filter by severity: critical, serious, moderate, minor' },
    wcagLevel: { type: 'string', description: 'Filter by WCAG level: A, AA, AAA' }
  };

  private readonly auditFacade = inject(AuditFacade);

  execute(input?: GetFindingsInput): any {
    let findings: Finding[] = this.auditFacade.filteredFindings();

    if (input?.severity) {
      findings = findings.filter((f) => f.severity === input.severity);
    }
    if (input?.wcagLevel) {
      findings = findings.filter((f) => f.wcagCriterion?.level === input.wcagLevel);
    }

    return {
      total: findings.length,
      findings: findings.map((f) => ({
        id: f.id,
        ruleId: f.ruleId,
        wcagCriterionId: f.wcagCriterionId,
        wcagLevel: f.wcagCriterion?.level,
        severity: f.severity,
        selector: f.selector,
        message: f.message
      }))
    };
  }
}
