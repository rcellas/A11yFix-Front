import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app.component';
import { MockAuditApiClient } from './core/adapters/mock-audit-api.client';
import { AuditFacade } from './core/facades/audit.facade';
import { RemediationFacade } from './core/facades/remediation.facade';
import { AUDIT_API_CLIENT } from './core/ports/audit-api.port';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let facade: AuditFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        AuditFacade,
        RemediationFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    facade = TestBed.inject(AuditFacade);
    fixture.detectChanges();
  });

  it('should render application header with A11yFix branding and skip link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skip-link')).not.toBeNull();
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('A11yFix');
  });

  it('should display workspace grid when audit scan completes', async () => {
    await facade.runScan('https://demo.a11yfix.dev');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.workspace-grid')).not.toBeNull();
    expect(compiled.querySelector('app-findings-list')).not.toBeNull();
    expect(compiled.querySelector('app-finding-detail')).not.toBeNull();
  });
});
