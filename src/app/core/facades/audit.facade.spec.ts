import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../adapters/mock-audit-api.client';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { AuditFacade } from './audit.facade';

describe('AuditFacade', () => {
  let facade: AuditFacade;
  let mockApiClient: MockAuditApiClient;

  beforeEach(() => {
    mockApiClient = new MockAuditApiClient();
    TestBed.configureTestingModule({
      providers: [
        AuditFacade,
        {
          provide: AUDIT_API_CLIENT,
          useValue: mockApiClient
        }
      ]
    });

    facade = TestBed.inject(AuditFacade);
  });

  it('should initialize with idle status', () => {
    expect(facade.status()).toBe('idle');
    expect(facade.isScanning()).toBe(false);
    expect(facade.report()).toBeNull();
    expect(facade.filteredFindings()).toEqual([]);
  });

  it('should run scan and update report and findings reactively', async () => {
    await facade.runScan('https://demo.a11yfix.dev');

    expect(facade.status()).toBe('completed');
    expect(facade.isCompleted()).toBe(true);
    expect(facade.report()?.targetUrl).toBe('https://demo.a11yfix.dev');
    expect(facade.filteredFindings().length).toBeGreaterThan(0);
    expect(facade.selectedFinding()).not.toBeNull();
  });

  it('should filter findings by severity reactively', async () => {
    await facade.runScan('https://demo.a11yfix.dev');
    const allCount = facade.filteredFindings().length;

    facade.setSeverityFilter('critical');
    const criticalFindings = facade.filteredFindings();

    expect(criticalFindings.length).toBeLessThanOrEqual(allCount);
    expect(criticalFindings.every((f) => f.severity === 'critical')).toBe(true);
  });

  it('should filter findings by search query', async () => {
    await facade.runScan('https://demo.a11yfix.dev');

    facade.setSearchQuery('contrast');
    const matched = facade.filteredFindings();

    expect(matched.length).toBeGreaterThan(0);
    expect(matched.some((f) => f.message.toLowerCase().includes('contrast'))).toBe(true);
  });
});
