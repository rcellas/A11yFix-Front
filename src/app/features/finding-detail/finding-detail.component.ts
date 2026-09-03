import { UpperCasePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { BadgeComponent, ButtonComponent, CodeDiffViewerComponent } from '../../components';
import { AuditFacade } from '../../core/facades/audit.facade';
import { RemediationFacade } from '../../core/facades/remediation.facade';
import { APG_PATTERNS } from '../../core/models';
import { PlaywrightGeneratorService } from '../../core/webmcp/services/playwright-generator.service';

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
  private readonly playwrightGenerator = inject(PlaywrightGeneratorService);

  readonly selectedFinding = this.auditFacade.selectedFinding;
  readonly feedbackMessage = signal<string | null>(null);
  readonly copyStatus = signal<string | null>(null);
  readonly isGeneratingRemediation = signal<boolean>(false);

  readonly currentRemediation = computed(() => {
    return this.remediationFacade.proposedRemediation() ?? this.selectedFinding()?.remediation ?? null;
  });

  readonly hasRemediation = computed(() => this.currentRemediation() !== null);

  readonly diffText = computed(() => {
    const rem = this.currentRemediation();
    if (!rem) return '';
    return `--- original.html\n+++ remediation.html\n-${rem.originalHtml.split('\n').join('\n-')}\n+${rem.proposedHtml.split('\n').join('\n+')}`;
  });

  readonly generatedPlaywrightTest = computed(() => {
    const finding = this.selectedFinding();
    const report = this.auditFacade.report();
    if (!finding) return '';
    const targetUrl = report?.targetUrl || 'https://target.audit';
    return this.playwrightGenerator.generateTestSnippet(targetUrl, finding);
  });

  constructor() {
    // Whenever selected finding changes, sync remediation facade
    effect(() => {
      const finding = this.selectedFinding();
      if (finding) {
        this.remediationFacade.initializeForFinding(finding.id, finding.remediation);
        this.feedbackMessage.set(null);
        this.copyStatus.set(null);
      }
    });
  }

  async generateRemediation(): Promise<void> {
    const finding = this.selectedFinding();
    const report = this.auditFacade.report();
    if (!finding) return;

    this.isGeneratingRemediation.set(true);
    this.feedbackMessage.set(null);
    try {
      await this.remediationFacade.requestAiRemediation(report?.id || 'current-audit', finding.id);
    } finally {
      this.isGeneratingRemediation.set(false);
    }
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

  async copyPlaywrightTest(): Promise<void> {
    const code = this.generatedPlaywrightTest();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      this.copyStatus.set('✓ Copied to clipboard!');
      setTimeout(() => this.copyStatus.set(null), 3000);
    } catch {
      this.copyStatus.set('Failed to copy');
    }
  }

  downloadPlaywrightTest(): void {
    const code = this.generatedPlaywrightTest();
    const finding = this.selectedFinding();
    if (!code || !finding) return;

    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `a11y-${finding.ruleId.replace(/[^a-z0-9]/gi, '_')}.spec.ts`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
