import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MockAuditApiClient } from '../../core/adapters/mock-audit-api.client';
import { AuditFacade } from '../../core/facades/audit.facade';
import { AUDIT_API_CLIENT } from '../../core/ports/audit-api.port';
import { FindingsListComponent } from './findings-list.component';

describe('FindingsListComponent', () => {
  let fixture: ComponentFixture<FindingsListComponent>;
  let component: FindingsListComponent;
  let facade: AuditFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindingsListComponent],
      providers: [
        AuditFacade,
        {
          provide: AUDIT_API_CLIENT,
          useClass: MockAuditApiClient
        }
      ]
    }).compileComponents();

    facade = TestBed.inject(AuditFacade);
    await facade.runScan('https://demo.a11yfix.dev');

    fixture = TestBed.createComponent(FindingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render findings list with filter controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.finding-item').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('app-filter-chip-group').length).toBe(2);
  });

  it('should update severity filter when chip is selected', () => {
    component.onSeverityChange(['critical']);
    fixture.detectChanges();

    expect(facade.filter().severity).toBe('critical');
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.finding-item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should select finding on click or keyboard interaction', () => {
    const findings = facade.filteredFindings();
    const secondFinding = findings[1];

    component.selectFinding(secondFinding);
    fixture.detectChanges();

    expect(facade.selectedFindingId()).toBe(secondFinding.id);
    expect(component.isSelected(secondFinding)).toBe(true);
  });
});
