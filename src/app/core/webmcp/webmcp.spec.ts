import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../adapters/mock-audit-api.client';
import { AuditFacade } from '../facades/audit.facade';
import { RemediationFacade } from '../facades/remediation.facade';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { ModelContext } from './contracts/webmcp.types';
import { WebMcpHostService } from './services/webmcp-host.service';
import { provideWebMcpTools } from './tools';
import { ApplyRemediationTool } from './tools/write/apply-remediation.tool';

describe('WebMCP OOP Architecture & Host Service', () => {
  let hostService: WebMcpHostService;
  let auditFacade: AuditFacade;
  let remediationFacade: RemediationFacade;
  let applyRemediationTool: ApplyRemediationTool;
  let mockContext: ModelContext;
  let registeredToolsMap: Map<string, any>;

  beforeEach(() => {
    registeredToolsMap = new Map();
    mockContext = {
      registerTool: (tool) => {
        registeredToolsMap.set(tool.name, tool);
      }
    };

    // Attach mock modelContext to document
    document.modelContext = mockContext;

    TestBed.configureTestingModule({
      providers: [
        WebMcpHostService,
        AuditFacade,
        RemediationFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        },
        ...provideWebMcpTools()
      ]
    });

    hostService = TestBed.inject(WebMcpHostService);
    auditFacade = TestBed.inject(AuditFacade);
    remediationFacade = TestBed.inject(RemediationFacade);
    applyRemediationTool = TestBed.inject(ApplyRemediationTool);
  });

  it('should register all 8 polymorphic WebMCP tools when modelContext is available', () => {
    hostService.initialize();

    expect(hostService.isSupported()).toBe(true);
    expect(hostService.registeredToolNames().length).toBe(8);
    expect(registeredToolsMap.has('get_audit')).toBe(true);
    expect(registeredToolsMap.has('get_findings')).toBe(true);
    expect(registeredToolsMap.has('inspect_finding')).toBe(true);
    expect(registeredToolsMap.has('inspect_pattern')).toBe(true);
    expect(registeredToolsMap.has('create_audit')).toBe(true);
    expect(registeredToolsMap.has('propose_remediation')).toBe(true);
    expect(registeredToolsMap.has('generate_regression_test')).toBe(true);
    expect(registeredToolsMap.has('apply_remediation')).toBe(true);
  });

  it('should execute create_audit and get_findings tools polymorphically', async () => {
    hostService.initialize();
    const createAudit = registeredToolsMap.get('create_audit');
    const getFindings = registeredToolsMap.get('get_findings');

    await createAudit.execute({ url: 'https://demo.a11yfix.dev' });
    expect(auditFacade.status()).toBe('completed');

    const findingsResult = await getFindings.execute({ severity: 'critical' });
    expect(findingsResult.total).toBeGreaterThan(0);
    expect(findingsResult.findings.every((f: any) => f.severity === 'critical')).toBe(true);
  });

  it('should generate Playwright regression test snippet via PlaywrightGeneratorService', async () => {
    hostService.initialize();
    const createAudit = registeredToolsMap.get('create_audit');
    const genTest = registeredToolsMap.get('generate_regression_test');

    await createAudit.execute({ url: 'https://demo.a11yfix.dev' });

    const firstFindingId = auditFacade.report()!.findings[0].id;
    const testResult = await genTest.execute({ findingId: firstFindingId });

    expect(testResult.playwrightTest).toContain('@axe-core/playwright');
    expect(testResult.playwrightTest).toContain('test(');
  });

  it('should STRICTLY reject apply_remediation when human approval has NOT been granted', async () => {
    hostService.initialize();
    const createAudit = registeredToolsMap.get('create_audit');

    await createAudit.execute({ url: 'https://demo.a11yfix.dev' });
    const firstFinding = auditFacade.report()!.findings[0];

    // Initialize remediation without approving
    remediationFacade.initializeForFinding(firstFinding.id, firstFinding.remediation);

    // Attempting WebMCP write MUST throw security policy violation
    await expect(applyRemediationTool.execute({ findingId: firstFinding.id })).rejects.toThrowError(
      /WebMCP Security Policy Violation/
    );
  });

  it('should execute apply_remediation successfully ONLY after human approval is recorded', async () => {
    hostService.initialize();
    const createAudit = registeredToolsMap.get('create_audit');

    await createAudit.execute({ url: 'https://demo.a11yfix.dev' });
    const firstFinding = auditFacade.report()!.findings[0];

    // Explicit human approval
    remediationFacade.initializeForFinding(firstFinding.id, firstFinding.remediation);
    remediationFacade.approveProposal('human_reviewer_alex');

    const result = await applyRemediationTool.execute({ findingId: firstFinding.id });
    expect(result.success).toBe(true);
  });
});
