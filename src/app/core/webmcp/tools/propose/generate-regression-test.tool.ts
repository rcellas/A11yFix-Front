import { inject, Injectable } from '@angular/core';
import { AuditFacade } from '../../../facades/audit.facade';
import { Finding } from '../../../models';
import { PlaywrightGeneratorService } from '../../services/playwright-generator.service';
import { BaseWebMcpTool } from '../base-tool';

export interface GenerateRegressionTestInput {
  readonly findingId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenerateRegressionTestTool extends BaseWebMcpTool<GenerateRegressionTestInput, any> {
  readonly name = 'generate_regression_test';
  readonly description = 'Generate an automated Playwright accessibility regression test snippet for a finding.';
  readonly tier = 'PROPOSE' as const;
  override readonly parameters = {
    findingId: { type: 'string', description: 'ID of the finding to generate regression test for', required: true }
  };

  private readonly auditFacade = inject(AuditFacade);
  private readonly testGenerator = inject(PlaywrightGeneratorService);

  execute(input: GenerateRegressionTestInput): any {
    if (!input?.findingId) {
      throw new Error('findingId is required');
    }
    const report = this.auditFacade.report();
    const finding = report?.findings.find((f: Finding) => f.id === input.findingId);
    if (!finding) {
      throw new Error(`Finding not found: ${input.findingId}`);
    }

    const testSnippet = this.testGenerator.generateTestSnippet(
      report ? report.targetUrl : 'https://example.com',
      finding
    );

    return {
      findingId: input.findingId,
      ruleId: finding.ruleId,
      playwrightTest: testSnippet
    };
  }
}
