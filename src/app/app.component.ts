import { Component, inject } from '@angular/core';
import { BadgeComponent } from './components';
import { AuditFacade } from './core/facades/audit.facade';
import { AuditWorkspaceComponent } from './features/audit-workspace/audit-workspace.component';
import { FindingDetailComponent } from './features/finding-detail/finding-detail.component';
import { FindingsListComponent } from './features/findings-list/findings-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BadgeComponent,
    AuditWorkspaceComponent,
    FindingsListComponent,
    FindingDetailComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  readonly auditFacade = inject(AuditFacade);
}
