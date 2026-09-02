import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../adapters/mock-audit-api.client';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { RemediationFacade } from './remediation.facade';

describe('RemediationFacade', () => {
  let facade: RemediationFacade;
  let mockApiClient: MockAuditApiClient;

  beforeEach(() => {
    mockApiClient = new MockAuditApiClient();
    TestBed.configureTestingModule({
      providers: [
        RemediationFacade,
        {
          provide: AUDIT_API_CLIENT,
          useValue: mockApiClient
        }
      ]
    });

    facade = TestBed.inject(RemediationFacade);
  });

  it('should initialize finding remediation state', () => {
    facade.initializeForFinding('f-001', {
      originalHtml: '<button></button>',
      proposedHtml: '<button aria-label="Close">X</button>',
      explanation: 'Add accessible name'
    });

    expect(facade.status()).toBe('awaiting_approval');
    expect(facade.isAwaitingApproval()).toBe(true);
    expect(facade.hasProposedRemediation()).toBe(true);
  });

  it('should prevent applying fix before human approval', async () => {
    facade.initializeForFinding('f-001', {
      originalHtml: '<button></button>',
      proposedHtml: '<button aria-label="Close">X</button>',
      explanation: 'Add accessible name'
    });

    await expect(facade.applyApprovedRemediation('audit-100')).rejects.toThrowError(
      /Human Approval Barrier Violation/
    );
  });

  it('should permit applying fix after explicit human approval', async () => {
    facade.initializeForFinding('f-001', {
      originalHtml: '<button></button>',
      proposedHtml: '<button aria-label="Close">X</button>',
      explanation: 'Add accessible name'
    });

    facade.approveProposal('lead_a11y_reviewer');
    expect(facade.isApproved()).toBe(true);

    const result = await facade.applyApprovedRemediation('audit-100');
    expect(result.success).toBe(true);
    expect(facade.isApplied()).toBe(true);
  });
});
