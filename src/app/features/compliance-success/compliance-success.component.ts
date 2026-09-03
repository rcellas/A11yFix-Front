import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BadgeComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';

@Component({
  selector: 'app-compliance-success',
  standalone: true,
  imports: [BadgeComponent, DatePipe],
  templateUrl: './compliance-success.component.html',
  styleUrl: './compliance-success.component.css'
})
export class ComplianceSuccessComponent {
  readonly auditFacade = inject(AuditFacade);
  readonly report = this.auditFacade.report;

  readonly auditSummary = computed(() => this.auditFacade.summary());
}
