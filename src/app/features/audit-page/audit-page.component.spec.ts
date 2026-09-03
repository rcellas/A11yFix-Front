import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../../core/adapters/mock-audit-api.client';
import { AuditFacade } from '../../core/facades/audit.facade';
import { RemediationFacade } from '../../core/facades/remediation.facade';
import { AUDIT_API_CLIENT } from '../../core/ports/audit-api.port';
import { AuditPageComponent } from './audit-page.component';

describe('AuditPageComponent', () => {
  let fixture: ComponentFixture<AuditPageComponent>;
  let component: AuditPageComponent;
  let facade: AuditFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPageComponent],
      providers: [
        AuditFacade,
        RemediationFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditPageComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(AuditFacade);
    fixture.detectChanges();
  });

  it('should render audit workspace scanner on initial load', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-audit-workspace')).not.toBeNull();
  });

  it('should display workspace grid when audit scan completes with findings', async () => {
    await facade.runScan('https://demo.a11yfix.dev');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.workspace-grid')).not.toBeNull();
    expect(compiled.querySelector('app-findings-list')).not.toBeNull();
    expect(compiled.querySelector('app-finding-detail')).not.toBeNull();
  });
});
