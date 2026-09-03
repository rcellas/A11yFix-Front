import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { PlaywrightGeneratorService } from '../../services/playwright-generator.service';
import { BaseWebMcpTool } from '../base-tool';

export interface GenerateRegressionTestInput {
  readonly findingId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenerateRegressionTestTool extends BaseWebMcpTool<GenerateRegressionTestInput, any> {
  readonly name = 'generate_regression_test';
  readonly description = 'Generate an automated Playwright accessibility regression test snippet for a finding.';
  readonly tier = 'PROPOSE' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to generate regression test for (optional, defaults to selected/first finding)' }
  };

  private readonly auditFacade = inject(AuditFacade);
  private readonly testGenerator = inject(PlaywrightGeneratorService);

  execute(input: GenerateRegressionTestInput): any {
    const report = this.auditFacade.report();
    if (!report || report.findings.length === 0) {
      throw new Error('No active audit findings found. Please run an audit scan first.');
    }

    const targetId = input?.findingId;
    const finding =
      (targetId ? report.findings.find((f: Finding) => f.id === targetId) : undefined) ??
      this.auditFacade.selectedFinding() ??
      report.findings[0];

    if (!finding) {
      throw new Error(`Finding not found: ${targetId || 'active'}`);
    }

    const testSnippet = this.testGenerator.generateTestSnippet(
      report.targetUrl || 'https://example.com',
      finding
    );

    return {
      findingId: finding.id,
      ruleId: finding.ruleId,
      playwrightTest: testSnippet
    };
  }
}
