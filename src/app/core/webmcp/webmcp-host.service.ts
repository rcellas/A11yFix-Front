import { inject, Injectable, signal } from '@angular/core';
import { AuditFacade } from '../facades/audit.facade';
import { RemediationFacade } from '../facades/remediation.facade';
import { APG_PATTERNS, PatternType } from '../models';
import { ModelContext, WebMcpToolDefinition } from './webmcp.types';

@Injectable({
  providedIn: 'root'
})
export class WebMcpHostService {
  private readonly auditFacade = inject(AuditFacade);
  private readonly remediationFacade = inject(RemediationFacade);

  readonly isSupported = signal<boolean>(false);
  readonly registeredTools = signal<string[]>([]);

  /**
   * Defines the 7 browser-native WebMCP tools
   */
  get toolDefinitions(): WebMcpToolDefinition[] {
    return [
      // --- READ TIERS ---
      {
        name: 'get_audit',
        description: 'Retrieve the current active audit report summary and status.',
        tier: 'READ',
        handler: () => {
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
      },
      {
        name: 'get_findings',
        description: 'List findings from the current audit with optional filtering by severity or WCAG level.',
        tier: 'READ',
        parameters: {
          severity: { type: 'string', description: 'Filter by severity: critical, serious, moderate, minor' },
          wcagLevel: { type: 'string', description: 'Filter by WCAG level: A, AA, AAA' }
        },
        handler: (params) => {
          let findings = this.auditFacade.filteredFindings();
          const severityFilter = params?.['severity'];
          const wcagFilter = params?.['wcagLevel'];

          if (severityFilter) {
            findings = findings.filter((f) => f.severity === severityFilter);
          }
          if (wcagFilter) {
            findings = findings.filter((f) => f.wcagCriterion?.level === wcagFilter);
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
      },
      {
        name: 'inspect_finding',
        description: 'Get deep technical details, HTML snippet, and WCAG 2.2 criterion for a specific finding.',
        tier: 'READ',
        parameters: {
          findingId: { type: 'string', description: 'ID of the finding to inspect', required: true }
        },
        handler: (params) => {
          const findingId = params?.['findingId'];
          const report = this.auditFacade.report();
          const finding = report?.findings.find((f) => f.id === findingId);
          if (!finding) {
            throw new Error(`Finding not found: ${findingId}`);
          }
          return {
            finding,
            wcagSpec: finding.wcagCriterion
          };
        }
      },
      {
        name: 'inspect_pattern',
        description: 'Get WAI-ARIA APG pattern requirements for dialog, tabs, accordion, or combobox.',
        tier: 'READ',
        parameters: {
          patternType: {
            type: 'string',
            description: 'Pattern type to inspect',
            required: true,
            enum: ['dialog', 'tabs', 'accordion', 'combobox']
          }
        },
        handler: (params) => {
          const patternType = params?.['patternType'] as PatternType;
          const pattern = APG_PATTERNS[patternType];
          if (!pattern) {
            throw new Error(`Unknown pattern type: ${patternType}`);
          }
          return pattern;
        }
      },

      // --- PROPOSE TIERS ---
      {
        name: 'create_audit',
        description: 'Initiate a new accessibility audit for a given URL.',
        tier: 'PROPOSE',
        parameters: {
          url: { type: 'string', description: 'Absolute URL of the target webpage to audit', required: true }
        },
        handler: async (params) => {
          const url = params?.['url'];
          await this.auditFacade.runScan(url);
          return {
            status: this.auditFacade.status(),
            report: this.auditFacade.report()
          };
        }
      },
      {
        name: 'propose_remediation',
        description: 'Generate or propose an AI-guided accessible code remediation for a finding.',
        tier: 'PROPOSE',
        parameters: {
          findingId: { type: 'string', description: 'ID of the finding to remediate', required: true }
        },
        handler: async (params) => {
          const findingId = params?.['findingId'];
          const report = this.auditFacade.report();
          if (!report) {
            throw new Error('No active audit found. Run create_audit first.');
          }
          await this.remediationFacade.requestAiRemediation(report.id, findingId);
          return {
            status: this.remediationFacade.status(),
            proposedRemediation: this.remediationFacade.proposedRemediation()
          };
        }
      },
      {
        name: 'generate_regression_test',
        description: 'Generate an automated Playwright accessibility regression test snippet for a finding.',
        tier: 'PROPOSE',
        parameters: {
          findingId: { type: 'string', description: 'ID of the finding to generate regression test for', required: true }
        },
        handler: (params) => {
          const findingId = params?.['findingId'];
          const report = this.auditFacade.report();
          const finding = report?.findings.find((f) => f.id === findingId);
          if (!finding) {
            throw new Error(`Finding not found: ${findingId}`);
          }

          const targetUrl = report ? report.targetUrl : 'https://example.com';
          const testSnippet = `
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('verify fix for ${finding.ruleId} on ${finding.selector}', async ({ page }) => {
  await page.goto('${targetUrl}');
  const results = await new AxeBuilder({ page })
    .include('${finding.selector}')
    .withRules(['${finding.ruleId}'])
    .analyze();
  expect(results.violations).toEqual([]);
});
`;
          return {
            findingId,
            ruleId: finding.ruleId,
            playwrightTest: testSnippet.trim()
          };
        }
      },

      // --- WRITE TIER (MANDATORY HUMAN APPROVAL BARRIER) ---
      {
        name: 'apply_remediation',
        description: 'Apply an approved remediation. STRICTLY fails if human approval has not been granted.',
        tier: 'WRITE',
        parameters: {
          findingId: { type: 'string', description: 'ID of the finding to apply remediation for', required: true }
        },
        handler: async (params) => {
          const findingId = params?.['findingId'];
          const report = this.auditFacade.report();
          if (!report) {
            throw new Error('No active audit found.');
          }

          const currentRemediationState = this.remediationFacade.state();
          if (currentRemediationState.status !== 'approved') {
            throw new Error(
              `WebMCP Security Policy Violation: Cannot apply remediation via WebMCP without verified human approval in the application state. Current status: ${currentRemediationState.status}`
            );
          }

          const result = await this.remediationFacade.applyApprovedRemediation(report.id);
          return {
            success: result.success,
            appliedAt: result.appliedAt,
            findingId
          };
        }
      }
    ];
  }

  /**
   * Initializes WebMCP host registrations on document.modelContext or navigator.modelContext
   */
  initialize(): void {
    let context: ModelContext | undefined;
    if (typeof document !== 'undefined' && document.modelContext) {
      context = document.modelContext;
    } else if (typeof navigator !== 'undefined' && navigator.modelContext) {
      context = navigator.modelContext;
    }

    if (!context || typeof context.registerTool !== 'function') {
      this.isSupported.set(false);
      return;
    }

    this.isSupported.set(true);
    const registered: string[] = [];

    for (const tool of this.toolDefinitions) {
      try {
        context.registerTool({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          execute: (args) => tool.handler(args)
        });
        registered.push(tool.name);
      } catch (err) {
        console.warn(`Failed to register WebMCP tool: ${tool.name}`, err);
      }
    }

    this.registeredTools.set(registered);
  }
}
