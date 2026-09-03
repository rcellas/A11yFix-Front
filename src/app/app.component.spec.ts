import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './app.component';
import { routes } from './app.routes';
import { MockAuditApiClient } from './core/adapters/mock-audit-api.client';
import { AuditFacade } from './core/facades/audit.facade';
import { RemediationFacade } from './core/facades/remediation.facade';
import { AUDIT_API_CLIENT } from './core/ports/audit-api.port';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
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
    fixture.detectChanges();
  });

  it('should render application header with A11yFix branding, navigation links and skip link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.skip-link')).not.toBeNull();
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('A11yFix');
    expect(compiled.querySelector('.header-nav')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should initialize WebMCP host on startup', () => {
    expect(component.webMcpHost).toBeDefined();
    expect(component.webMcpHost.registeredToolNames().length).toBeGreaterThanOrEqual(0);
  });
});
