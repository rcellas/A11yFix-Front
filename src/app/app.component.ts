import { Component, inject, OnInit } from '@angular/core';
import { BadgeComponent, ButtonComponent } from './components';
import { AuditFacade } from './core/facades/audit.facade';
import { WebMcpHostService } from './core/webmcp';
import { AuditWorkspaceComponent } from './features/audit-workspace/audit-workspace.component';
import { FindingDetailComponent } from './features/finding-detail/finding-detail.component';
import { FindingsListComponent } from './features/findings-list/findings-list.component';
import { WebMcpPanelComponent } from './features/webmcp-panel/webmcp-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    AuditWorkspaceComponent,
    FindingsListComponent,
    FindingDetailComponent,
    WebMcpPanelComponent
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
