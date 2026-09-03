import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WebMcpHostService } from './core/webmcp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  readonly webMcpHost = inject(WebMcpHostService);

  ngOnInit(): void {
    // Automatically register WebMCP tools on browser modelContext if present
    this.webMcpHost.initialize();
  }
}
