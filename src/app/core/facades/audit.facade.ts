import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Finding, FindingSeverity, WcagLevel } from '../models';
import { AUDIT_API_CLIENT } from '../ports/audit-api.port';
import { AuditStateMachine } from '../state/audit.state';

export interface FindingFilter {
  readonly severity?: FindingSeverity | 'all';
  readonly wcagLevel?: WcagLevel | 'all';
  readonly searchQuery?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditFacade {
  private readonly apiClient = inject(AUDIT_API_CLIENT);
  private readonly stateMachine = new AuditStateMachine();

  // Internal filters
  private readonly _filter = signal<FindingFilter>({
    severity: 'all',
    wcagLevel: 'all',
    searchQuery: ''
  });

  // Selected finding ID
  private readonly _selectedFindingId = signal<string | null>(null);

  // Expose reactive state signals
  readonly state = this.stateMachine.state;
  readonly status = this.stateMachine.status;
  readonly isScanning = this.stateMachine.isScanning;
  readonly isCompleted = this.stateMachine.isCompleted;
  readonly isFailed = this.stateMachine.isFailed;
  readonly report = this.stateMachine.report;
  readonly error = this.stateMachine.error;

  readonly filter = this._filter.asReadonly();
  readonly selectedFindingId = this._selectedFindingId.asReadonly();

  // Filtered findings computed signal
  readonly filteredFindings = computed(() => {
    const findings = this.stateMachine.findings();
    const filter = this._filter();

    return findings.filter((finding) => {
      // Severity filter
      if (filter.severity && filter.severity !== 'all' && finding.severity !== filter.severity) {
        return false;
      }

      // WCAG Level filter
      if (filter.wcagLevel && filter.wcagLevel !== 'all' && finding.wcagCriterion?.level !== filter.wcagLevel) {
        return false;
      }

      // Search query filter
      if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
        const query = filter.searchQuery.toLowerCase();
        const matchesMessage = finding.message.toLowerCase().includes(query);
        const matchesRule = finding.ruleId.toLowerCase().includes(query);
        const matchesSelector = finding.selector.toLowerCase().includes(query);
        const matchesWcag = finding.wcagCriterionId.toLowerCase().includes(query);
        if (!matchesMessage && !matchesRule && !matchesSelector && !matchesWcag) {
          return false;
        }
      }

      return true;
    });
  });

  readonly selectedFinding = computed(() => {
    const id = this._selectedFindingId();
    if (!id) return null;
    const findings = this.stateMachine.findings();
    return findings.find((f) => f.id === id) ?? null;
  });

  readonly summary = computed(() => {
    const rep = this.report();
    return rep ? rep.summary : null;
  });

  async runScan(url: string): Promise<void> {
    if (!url || !url.trim()) {
      this.stateMachine.failScan('URL cannot be empty');
      return;
    }

    try {
      this.stateMachine.startScan(url.trim());
      this.stateMachine.updateProgress(30);

      const report = await firstValueFrom(this.apiClient.startScan({ url: url.trim() }));
      this.stateMachine.updateProgress(100);
      this.stateMachine.completeScan(report);

      // Select first finding by default if present
      if (report.findings.length > 0) {
        this._selectedFindingId.set(report.findings[0].id);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during audit scan';
      this.stateMachine.failScan(errorMsg);
    }
  }

  setSeverityFilter(severity: FindingSeverity | 'all'): void {
    this._filter.update((f) => ({ ...f, severity }));
  }

  setWcagLevelFilter(wcagLevel: WcagLevel | 'all'): void {
    this._filter.update((f) => ({ ...f, wcagLevel }));
  }

  setSearchQuery(query: string): void {
    this._filter.update((f) => ({ ...f, searchQuery: query }));
  }

  selectFinding(findingId: string | null): void {
    this._selectedFindingId.set(findingId);
  }

  reset(): void {
    this.stateMachine.reset();
    this._selectedFindingId.set(null);
    this._filter.set({ severity: 'all', wcagLevel: 'all', searchQuery: '' });
  }
}
