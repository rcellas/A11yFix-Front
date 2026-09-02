import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AuditReport, calculateAuditSummary, Finding, FindingRemediation, WCAG_22_CATALOG } from '../models';
import {
  ApplyRemediationRequest,
  AuditApiClient,
  ProposeRemediationRequest,
  ScanRequest,
  VerificationResult,
  VerifyFindingRequest
} from '../ports/audit-api.port';

const MOCK_FINDINGS: Finding[] = [
  {
    id: 'f-001',
    ruleId: 'color-contrast',
    wcagCriterionId: '1.4.3',
    wcagCriterion: WCAG_22_CATALOG['1.4.3'],
    selector: '#hero-cta-btn',
    htmlSnippet: '<button class="bg-gray-200 text-gray-400">Get Started</button>',
    message: 'Element has insufficient color contrast of 2.14:1 (expected minimum 4.5:1 for normal text).',
    severity: 'critical',
    remediation: {
      originalHtml: '<button class="bg-gray-200 text-gray-400">Get Started</button>',
      proposedHtml: '<button class="bg-primary text-white font-medium">Get Started</button>',
      explanation: 'Adjusted background and foreground token colors to achieve an accessible 7.2:1 contrast ratio.'
    }
  },
  {
    id: 'f-002',
    ruleId: 'dialog-focus-trap',
    wcagCriterionId: '2.1.2',
    wcagCriterion: WCAG_22_CATALOG['2.1.2'],
    selector: '#cookie-consent-dialog',
    htmlSnippet: '<div role="dialog" class="modal">...</div>',
    message: 'Modal dialog allows tab focus to escape to background inert content (keyboard trap / focus leak).',
    severity: 'critical',
    patternType: 'dialog',
    remediation: {
      originalHtml: '<div role="dialog" class="modal">...</div>',
      proposedHtml: '<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" cdkTrapFocus>...</div>',
      explanation: 'Applied aria-modal="true" and active focus trapping per WAI-ARIA APG Modal Dialog pattern.',
      apgPattern: 'dialog'
    }
  },
  {
    id: 'f-003',
    ruleId: 'button-name',
    wcagCriterionId: '4.1.2',
    wcagCriterion: WCAG_22_CATALOG['4.1.2'],
    selector: 'header > button.icon-only',
    htmlSnippet: '<button class="p-2"><svg class="icon-menu"></svg></button>',
    message: 'Button element has no accessible name for screen readers.',
    severity: 'serious',
    remediation: {
      originalHtml: '<button class="p-2"><svg class="icon-menu"></svg></button>',
      proposedHtml: '<button class="p-2" aria-label="Open main navigation menu"><svg class="icon-menu" aria-hidden="true"></svg></button>',
      explanation: 'Provided an explicit aria-label descriptive name and hid decorative SVG from assistive tech.'
    }
  },
  {
    id: 'f-004',
    ruleId: 'target-size',
    wcagCriterionId: '2.5.8',
    wcagCriterion: WCAG_22_CATALOG['2.5.8'],
    selector: 'footer a.inline-tag',
    htmlSnippet: '<a href="/terms" class="text-xs">Terms</a>',
    message: 'Interactive touch target size is 18x14px, which is below the WCAG 2.2 required 24x24px minimum.',
    severity: 'moderate',
    remediation: {
      originalHtml: '<a href="/terms" class="text-xs">Terms</a>',
      proposedHtml: '<a href="/terms" class="text-xs inline-flex min-h-[24px] min-w-[24px] items-center p-1">Terms</a>',
      explanation: 'Expanded interactive touch bounding box to satisfy WCAG 2.2 Success Criterion 2.5.8 (Target Size).'
    }
  },
  {
    id: 'f-005',
    ruleId: 'tab-roving-tabindex',
    wcagCriterionId: '2.1.1',
    wcagCriterion: WCAG_22_CATALOG['2.1.1'],
    selector: 'div.tabs-header',
    htmlSnippet: '<div class="tab-item">Tab 1</div><div class="tab-item">Tab 2</div>',
    message: 'Tabs widget lacks keyboard roving tabindex arrow navigation and role="tablist" / role="tab" semantics.',
    severity: 'serious',
    patternType: 'tabs',
    remediation: {
      originalHtml: '<div class="tab-item">Tab 1</div>',
      proposedHtml: '<button role="tab" aria-selected="true" id="tab-1" aria-controls="panel-1" tabindex="0">Tab 1</button>',
      explanation: 'Upgraded tab header items to accessible buttons with roving tabindex per WAI-ARIA APG Tabs pattern.',
      apgPattern: 'tabs'
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class MockAuditApiClient implements AuditApiClient {
  startScan(request: ScanRequest): Observable<AuditReport> {
    const report: AuditReport = {
      id: `audit-${Date.now()}`,
      targetUrl: request.url,
      timestamp: new Date().toISOString(),
      findings: MOCK_FINDINGS,
      summary: calculateAuditSummary(MOCK_FINDINGS)
    };
    return of(report).pipe(delay(400));
  }

  getAudit(auditId: string): Observable<AuditReport> {
    const report: AuditReport = {
      id: auditId,
      targetUrl: 'https://example.com',
      timestamp: new Date().toISOString(),
      findings: MOCK_FINDINGS,
      summary: calculateAuditSummary(MOCK_FINDINGS)
    };
    return of(report).pipe(delay(200));
  }

  getFinding(auditId: string, findingId: string): Observable<Finding> {
    const found = MOCK_FINDINGS.find((f) => f.id === findingId) ?? MOCK_FINDINGS[0];
    return of(found).pipe(delay(150));
  }

  proposeRemediation(request: ProposeRemediationRequest): Observable<FindingRemediation> {
    const finding = MOCK_FINDINGS.find((f) => f.id === request.findingId);
    if (finding && finding.remediation) {
      return of(finding.remediation).pipe(delay(300));
    }
    return of({
      originalHtml: '<element></element>',
      proposedHtml: '<element aria-label="Accessible"></element>',
      explanation: 'Generated AI remediation based on WCAG 2.2 guidelines.'
    }).pipe(delay(300));
  }

  applyRemediation(
    request: ApplyRemediationRequest
  ): Observable<{ success: boolean; appliedAt: string }> {
    return of({
      success: true,
      appliedAt: new Date().toISOString()
    }).pipe(delay(250));
  }

  verifyFinding(request: VerifyFindingRequest): Observable<VerificationResult> {
    return of({
      findingId: request.findingId,
      passed: true,
      details: 'Automated verification check passed with zero accessibility violations.'
    }).pipe(delay(350));
  }
}
