import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { API_CONFIG } from '../tokens/api-config.token';
import { HttpAuditApiClient } from './http-audit-api.client';
import { MockAuditApiClient } from './mock-audit-api.client';

describe('Audit API Clients', () => {
  describe('HttpAuditApiClient', () => {
    let client: HttpAuditApiClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          HttpAuditApiClient,
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: API_CONFIG,
            useValue: { baseUrl: 'http://localhost:3000' }
          }
        ]
      });

      client = TestBed.inject(HttpAuditApiClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should issue POST /audits and subsequent GET /audits/:id/findings on startScan', async () => {
      const scanPromise = firstValueFrom(client.startScan({ url: 'https://dequeuniversity.com/demo/mars/' }));

      const postReq = httpMock.expectOne('http://localhost:3000/audits');
      expect(postReq.request.method).toBe('POST');
      expect(postReq.request.body).toEqual({ url: 'https://dequeuniversity.com/demo/mars/' });

      postReq.flush({
        id: '7b2d5a34-29ef-4c4e-9b2f-38e55cf94a10',
        url: 'https://dequeuniversity.com/demo/mars/',
        status: 'created',
        findingsCount: 1,
        createdAt: '2026-09-03T14:45:00.000Z'
      });

      await Promise.resolve();

      const getReq = httpMock.expectOne('http://localhost:3000/audits/7b2d5a34-29ef-4c4e-9b2f-38e55cf94a10/findings');
      expect(getReq.request.method).toBe('GET');

      getReq.flush([
        {
          id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
          auditId: '7b2d5a34-29ef-4c4e-9b2f-38e55cf94a10',
          patternType: 'DIALOG',
          ruleId: 'pattern:dialog-accessible-name',
          severity: 'serious',
          message: 'Dialog must have an accessible name via aria-labelledby or aria-label.',
          helpUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
          targetSelector: {
            cssSelector: '#modal-cookie',
            role: 'dialog'
          },
          htmlSnippet: '<div id="modal-cookie" role="dialog" class="modal">...</div>',
          createdAt: '2026-09-03T14:45:02.000Z'
        }
      ]);

      const result = await scanPromise;
      expect(result.id).toBe('7b2d5a34-29ef-4c4e-9b2f-38e55cf94a10');
      expect(result.findings.length).toBe(1);
      expect(result.findings[0].patternType).toBe('dialog');
      expect(result.findings[0].severity).toBe('serious');
      expect(result.findings[0].wcagCriterion?.id).toBe('4.1.2');
      expect(result.summary.totalFindings).toBe(1);
      expect(result.summary.seriousCount).toBe(1);
    });

    it('should propose remediation via POST /findings/:findingId/remediation', async () => {
      const proposePromise = firstValueFrom(
        client.proposeRemediation({
          auditId: '7b2d5a34-29ef-4c4e-9b2f-38e55cf94a10',
          findingId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c'
        })
      );

      const req = httpMock.expectOne('http://localhost:3000/findings/c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c/remediation');
      expect(req.request.method).toBe('POST');

      req.flush([
        {
          id: '8f3e2a1b-4c5d-4e6f-9a0b-1c2d3e4f5a6b',
          findingId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
          status: 'proposed',
          proposal: {
            title: 'Add aria-labelledby referencing dialog heading',
            description: 'Link the dialog container to its internal heading element ID.',
            suggestedDiff: '+ aria-labelledby="dialog-title"',
            suggestedAttributes: {
              'aria-labelledby': 'dialog-title'
            }
          },
          createdAt: '2026-09-03T14:46:00.000Z'
        }
      ]);

      const res = await proposePromise;
      expect(res.explanation).toContain('Add aria-labelledby referencing dialog heading');
      expect(res.proposedHtml).toContain('aria-labelledby="dialog-title"');
    });

    it('should issue POST /apply-remediation when applying approved fix', async () => {
      const applyPromise = firstValueFrom(
        client.applyRemediation({
          auditId: 'audit-123',
          findingId: 'f-1',
          approvedRemediation: {
            originalHtml: '<button></button>',
            proposedHtml: '<button aria-label="Save">Save</button>',
            explanation: 'Fix button name'
          },
          approvedBy: 'lead_engineer'
        })
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/audits/audit-123/findings/f-1/apply-remediation'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body.approvedBy).toBe('lead_engineer');

      req.flush({ success: true, appliedAt: '2026-09-03T00:00:00Z' });

      const res = await applyPromise;
      expect(res.success).toBe(true);
    });
  });

  describe('MockAuditApiClient', () => {
    it('should return mock audit report with findings and summary', async () => {
      const mockClient = new MockAuditApiClient();
      const report = await firstValueFrom(mockClient.startScan({ url: 'https://demo.a11yfix.dev' }));

      expect(report.targetUrl).toBe('https://demo.a11yfix.dev');
      expect(report.findings.length).toBeGreaterThan(0);
      expect(report.summary.totalFindings).toBe(report.findings.length);
      expect(report.summary.criticalCount).toBeGreaterThan(0);
    });

    it('should simulate remediation and verification', async () => {
      const mockClient = new MockAuditApiClient();
      const remediation = await firstValueFrom(
        mockClient.proposeRemediation({ auditId: 'a1', findingId: 'f-001' })
      );
      expect(remediation.proposedHtml).toBeTruthy();

      const verification = await firstValueFrom(
        mockClient.verifyFinding({ auditId: 'a1', findingId: 'f-001' })
      );
      expect(verification.passed).toBe(true);
    });
  });
});
