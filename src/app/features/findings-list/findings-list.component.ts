import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BadgeComponent, CardComponent, FilterChipGroupComponent, FilterOption, TextFieldComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { Finding, FindingSeverity, WcagLevel } from '../../core/models';

@Component({
  selector: 'app-findings-list',
  standalone: true,
  imports: [CardComponent, BadgeComponent, FilterChipGroupComponent, TextFieldComponent, UpperCasePipe],
  templateUrl: './findings-list.component.html',
  styleUrl: './findings-list.component.css'
})
export class FindingsListComponent {
  readonly auditFacade = inject(AuditFacade);

  readonly severityOptions: readonly FilterOption[] = [
    { id: 'all', label: 'All Severities' },
    { id: 'critical', label: 'Critical' },
    { id: 'serious', label: 'Serious' },
    { id: 'moderate', label: 'Moderate' },
    { id: 'minor', label: 'Minor' }
  ];

  readonly wcagLevelOptions: readonly FilterOption[] = [
    { id: 'all', label: 'All Levels' },
    { id: 'A', label: 'Level A' },
    { id: 'AA', label: 'Level AA' },
    { id: 'AAA', label: 'Level AAA' }
  ];

  readonly selectedSeverityIds = computed(() => [this.auditFacade.filter().severity ?? 'all']);
  readonly selectedWcagLevelIds = computed(() => [this.auditFacade.filter().wcagLevel ?? 'all']);
  readonly searchQuery = computed(() => this.auditFacade.filter().searchQuery ?? '');

  onSeverityChange(ids: string[]): void {
    const selected = ids[0] ?? 'all';
    this.auditFacade.setSeverityFilter(selected as FindingSeverity | 'all');
  }

  onWcagLevelChange(ids: string[]): void {
    const selected = ids[0] ?? 'all';
    this.auditFacade.setWcagLevelFilter(selected as WcagLevel | 'all');
  }

  onSearchChange(query: string): void {
    this.auditFacade.setSearchQuery(query);
  }

  selectFinding(finding: Finding): void {
    this.auditFacade.selectFinding(finding.id);
  }

  isSelected(finding: Finding): boolean {
    return this.auditFacade.selectedFindingId() === finding.id;
  }
}
