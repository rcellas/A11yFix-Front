import { Component, inject } from '@angular/core';
import { AuditFacade } from '../../core/facades/audit.facade';
import { AuditWorkspaceComponent } from '../audit-workspace/audit-workspace.component';
import { ComplianceSuccessComponent } from '../compliance-success/compliance-success.component';
import { FindingDetailComponent } from '../finding-detail/finding-detail.component';
import { FindingsListComponent } from '../findings-list/findings-list.component';

@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [
    AuditWorkspaceComponent,
    FindingsListComponent,
    FindingDetailComponent,
    ComplianceSuccessComponent
  ],
  template: `
    <div class="main-container">
      <!-- Scanner & WebMCP Inspector Bar -->
      <app-audit-workspace />

      @if (auditFacade.isCompleted()) {
        @if ((auditFacade.report()?.findings?.length ?? 0) === 0) {
          <!-- Full-Width 100% WCAG 2.2 Compliance Pass Report -->
          <app-compliance-success />
        } @else {
          <!-- Split Workspace: Findings List + Finding Detail -->
          <div class="workspace-grid">
            <aside class="grid-col findings-col" aria-label="Findings Navigation">
              <app-findings-list />
            </aside>
            <section class="grid-col detail-col" aria-label="Finding Inspection and Remediation">
              <app-finding-detail />
            </section>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .main-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-6, 1.5rem);
      display: flex;
      flex-direction: column;
      gap: var(--space-6, 1.5rem);
    }
    .workspace-grid {
      display: grid;
      grid-template-columns: minmax(380px, 440px) 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    .grid-col { min-width: 0; }
    .findings-col {
      position: sticky;
      top: 80px;
      max-height: calc(100vh - 110px);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    @media (max-width: 960px) {
      .workspace-grid { grid-template-columns: 1fr; }
      .findings-col {
        position: static;
        max-height: none;
      }
    }
  `]
})
export class AuditPageComponent {
  readonly auditFacade = inject(AuditFacade);
}
