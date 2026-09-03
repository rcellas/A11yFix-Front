import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
  readonly densityMode = signal<'compact' | 'detailed'>('compact');

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
    return this.auditFacade.selectedFinding()?.id === finding.id;
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const list = this.auditFacade.filteredFindings();
    if (list.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = Math.min(index + 1, list.length - 1);
      this.selectFinding(list[nextIndex]);
      this.focusItemByIndex(nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      this.selectFinding(list[prevIndex]);
      this.focusItemByIndex(prevIndex);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectFinding(list[index]);
    }
  }

  private focusItemByIndex(index: number): void {
    setTimeout(() => {
      const items = document.querySelectorAll<HTMLElement>('.finding-item');
      if (items[index]) {
        items[index].focus();
        items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }
}
