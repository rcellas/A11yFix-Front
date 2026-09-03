import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../../core/adapters/mock-audit-api.client';
import { AuditFacade } from '../../core/facades/audit.facade';
import { AUDIT_API_CLIENT } from '../../core/ports/audit-api.port';
import { AuditWorkspaceComponent } from './audit-workspace.component';

describe('AuditWorkspaceComponent', () => {
  let fixture: ComponentFixture<AuditWorkspaceComponent>;
  let component: AuditWorkspaceComponent;
  let facade: AuditFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditWorkspaceComponent],
      providers: [
        AuditFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditWorkspaceComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(AuditFacade);
    fixture.detectChanges();
  });

  it('should render URL input field and submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#target-url-input')).not.toBeNull();
    expect(compiled.querySelector('app-button')).not.toBeNull();
  });

  it('should show error message if URL is empty on submit', async () => {
    component.onUrlChange('');
    await component.startAudit();
    fixture.detectChanges();

    expect(component.errorMessage()).toContain('Please provide a valid website URL');
  });

  it('should trigger audit scan via facade when valid URL is submitted', async () => {
    component.onUrlChange('https://test-site.org');
    await component.startAudit();
    fixture.detectChanges();

    expect(facade.status()).toBe('completed');
    expect(facade.report()?.targetUrl).toBe('https://test-site.org');
  });

  it('should automatically prepend https:// when domain is entered without protocol', async () => {
    component.onUrlChange('rociocejudo.dev');
    await component.startAudit();
    fixture.detectChanges();

    expect(component.errorMessage()).toBeNull();
    expect(facade.status()).toBe('completed');
    expect(facade.report()?.targetUrl).toBe('https://rociocejudo.dev');
  });
});
