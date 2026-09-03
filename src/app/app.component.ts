import { Component, inject, OnInit } from '@angular/core';
import { AuditFacade } from './core/facades/audit.facade';
import { WebMcpHostService } from './core/webmcp';
import { AuditWorkspaceComponent } from './features/audit-workspace/audit-workspace.component';
import { ComplianceSuccessComponent } from './features/compliance-success/compliance-success.component';
import { FindingDetailComponent } from './features/finding-detail/finding-detail.component';
import { FindingsListComponent } from './features/findings-list/findings-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AuditWorkspaceComponent,
    FindingsListComponent,
    FindingDetailComponent,
    ComplianceSuccessComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  readonly auditFacade = inject(AuditFacade);
  readonly webMcpHost = inject(WebMcpHostService);

  ngOnInit(): void {
    // Automatically register WebMCP tools on browser modelContext if present
    this.webMcpHost.initialize();
  }
}
