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
            useValue: { baseUrl: 'https://api.a11yfix.dev' }
          }
        ]
      });

      client = TestBed.inject(HttpAuditApiClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should issue POST /audits on startScan', async () => {
      const scanPromise = firstValueFrom(client.startScan({ url: 'https://mysite.com' }));

      const req = httpMock.expectOne('https://api.a11yfix.dev/audits');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ url: 'https://mysite.com' });

      req.flush({ id: 'audit-123', targetUrl: 'https://mysite.com', findings: [], summary: {} });

      const result = await scanPromise;
      expect(result.id).toBe('audit-123');
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
        'https://api.a11yfix.dev/audits/audit-123/findings/f-1/apply-remediation'
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
