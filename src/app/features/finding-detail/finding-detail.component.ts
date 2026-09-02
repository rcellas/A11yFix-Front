import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { BadgeComponent, ButtonComponent, CodeDiffViewerComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { RemediationFacade } from '../../core/facades/remediation.facade';
import { APG_PATTERNS } from '../../core/models';

@Component({
  selector: 'app-finding-detail',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, CodeDiffViewerComponent, UpperCasePipe],
  templateUrl: './finding-detail.component.html',
  styleUrl: './finding-detail.component.css'
})
export class FindingDetailComponent {
  readonly auditFacade = inject(AuditFacade);
  readonly remediationFacade = inject(RemediationFacade);

  readonly selectedFinding = this.auditFacade.selectedFinding;
  readonly feedbackMessage = signal<string | null>(null);

  readonly diffText = computed(() => {
    const rem = this.selectedFinding()?.remediation;
    if (!rem) return '';
    return `--- original.html\n+++ remediation.html\n-${rem.originalHtml.split('\n').join('\n-')}\n+${rem.proposedHtml.split('\n').join('\n+')}`;
  });

  constructor() {
    // Whenever selected finding changes, sync remediation facade
    effect(() => {
      const finding = this.selectedFinding();
      if (finding) {
        this.remediationFacade.initializeForFinding(finding.id, finding.remediation);
        this.feedbackMessage.set(null);
      }
    });
  }

  get apgPatternRule() {
    const finding = this.selectedFinding();
    if (finding && finding.patternType) {
      return APG_PATTERNS[finding.patternType];
    }
    return null;
  }

  approveRemediation(): void {
    this.remediationFacade.approveProposal('auditor_engineer');
    this.feedbackMessage.set('Remediation approved by human auditor. Ready to apply.');
  }

  rejectRemediation(): void {
    this.remediationFacade.rejectProposal('Rejected by auditor');
    this.feedbackMessage.set('Remediation rejected.');
  }

  async applyRemediation(): Promise<void> {
    const report = this.auditFacade.report();
    if (!report) return;

    try {
      await this.remediationFacade.applyApprovedRemediation(report.id);
      this.feedbackMessage.set('Remediation successfully applied to the source code!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error applying remediation';
      this.feedbackMessage.set(msg);
    }
  }
}
