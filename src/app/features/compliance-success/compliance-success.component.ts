import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BadgeComponent, ButtonComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';

@Component({
  selector: 'app-compliance-success',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, DatePipe],
  templateUrl: './compliance-success.component.html',
  styleUrl: './compliance-success.component.css'
})
export class ComplianceSuccessComponent {
  readonly auditFacade = inject(AuditFacade);
  readonly report = this.auditFacade.report;

  readonly auditSummary = computed(() => this.auditFacade.summary());

  exportJsonReport(): void {
    const currentReport = this.report();
    if (!currentReport) return;

    const data = JSON.stringify(currentReport, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `a11y-compliance-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
