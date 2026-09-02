import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../adapters/mock-audit-api.client';
import { AuditFacade } from '../facades/audit.facade';
import { RemediationFacade } from '../facades/remediation.facade';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { WebMcpHostService } from './webmcp-host.service';
import { ModelContext } from './webmcp.types';

describe('WebMcpHostService', () => {
  let service: WebMcpHostService;
  let auditFacade: AuditFacade;
  let remediationFacade: RemediationFacade;
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
        }
      ]
    });

    service = TestBed.inject(WebMcpHostService);
    auditFacade = TestBed.inject(AuditFacade);
    remediationFacade = TestBed.inject(RemediationFacade);
  });

  it('should register all 7 WebMCP tools when modelContext is available', () => {
    service.initialize();

    expect(service.isSupported()).toBe(true);
    expect(service.registeredTools().length).toBe(8); // get_audit, get_findings, inspect_finding, inspect_pattern, create_audit, propose_remediation, generate_regression_test, apply_remediation
    expect(registeredToolsMap.has('get_audit')).toBe(true);
    expect(registeredToolsMap.has('create_audit')).toBe(true);
    expect(registeredToolsMap.has('apply_remediation')).toBe(true);
  });

  it('should execute create_audit and get_findings tools', async () => {
    service.initialize();
    const createAuditTool = registeredToolsMap.get('create_audit');
    const getFindingsTool = registeredToolsMap.get('get_findings');

    await createAuditTool.execute({ url: 'https://demo.a11yfix.dev' });
    expect(auditFacade.status()).toBe('completed');

    const findingsResult = await getFindingsTool.execute({ severity: 'critical' });
    expect(findingsResult.total).toBeGreaterThan(0);
    expect(findingsResult.findings.every((f: any) => f.severity === 'critical')).toBe(true);
  });

  it('should generate Playwright regression test snippet', async () => {
    service.initialize();
    const createAuditTool = registeredToolsMap.get('create_audit');
    const genTestTool = registeredToolsMap.get('generate_regression_test');

    await createAuditTool.execute({ url: 'https://demo.a11yfix.dev' });

    const firstFindingId = auditFacade.report()!.findings[0].id;
    const testResult = await genTestTool.execute({ findingId: firstFindingId });

    expect(testResult.playwrightTest).toContain('@axe-core/playwright');
    expect(testResult.playwrightTest).toContain('test(');
  });

  it('should STRICTLY reject apply_remediation when human approval has NOT been granted', async () => {
    service.initialize();
    const createAuditTool = registeredToolsMap.get('create_audit');
    const applyTool = registeredToolsMap.get('apply_remediation');

    await createAuditTool.execute({ url: 'https://demo.a11yfix.dev' });
    const firstFinding = auditFacade.report()!.findings[0];

    // Initialize remediation without approving
    remediationFacade.initializeForFinding(firstFinding.id, firstFinding.remediation);

    // Attempting WebMCP write MUST throw security policy violation
    await expect(applyTool.execute({ findingId: firstFinding.id })).rejects.toThrowError(
      /WebMCP Security Policy Violation/
    );
  });

  it('should execute apply_remediation successfully ONLY after human approval is recorded', async () => {
    service.initialize();
    const createAuditTool = registeredToolsMap.get('create_audit');
    const applyTool = registeredToolsMap.get('apply_remediation');

    await createAuditTool.execute({ url: 'https://demo.a11yfix.dev' });
    const firstFinding = auditFacade.report()!.findings[0];

    // Explicit human approval
    remediationFacade.initializeForFinding(firstFinding.id, firstFinding.remediation);
    remediationFacade.approveProposal('human_reviewer_alex');

    const result = await applyTool.execute({ findingId: firstFinding.id });
    expect(result.success).toBe(true);
  });
});
