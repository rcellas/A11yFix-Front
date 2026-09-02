import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../../core/adapters/mock-audit-api.client';
import { AuditFacade } from '../../core/facades/audit.facade';
import { RemediationFacade } from '../../core/facades/remediation.facade';
import { AUDIT_API_CLIENT } from '../../core/ports/audit-api.port';
import { FindingDetailComponent } from './finding-detail.component';

describe('FindingDetailComponent', () => {
  let fixture: ComponentFixture<FindingDetailComponent>;
  let component: FindingDetailComponent;
  let auditFacade: AuditFacade;
  let remediationFacade: RemediationFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingDetailComponent],
      providers: [
        AuditFacade,
        RemediationFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        }
      ]
    }).compileComponents();

    auditFacade = TestBed.inject(AuditFacade);
    remediationFacade = TestBed.inject(RemediationFacade);

    await auditFacade.runScan('https://demo.a11yfix.dev');

    fixture = TestBed.createComponent(FindingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render selected finding details and code diff viewer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.detail-rule')).not.toBeNull();
    expect(compiled.querySelector('app-code-diff-viewer')).not.toBeNull();
  });

  it('should approve proposal and update state when Approve is clicked', () => {
    component.approveRemediation();
    fixture.detectChanges();

    expect(remediationFacade.isApproved()).toBe(true);
    expect(component.feedbackMessage()).toContain('approved by human auditor');
  });

  it('should apply remediation when Apply is clicked after approval', async () => {
    component.approveRemediation();
    await component.applyRemediation();
    fixture.detectChanges();

    expect(remediationFacade.isApplied()).toBe(true);
    expect(component.feedbackMessage()).toContain('successfully applied');
  });
});
