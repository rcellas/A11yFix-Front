import { inject, Injectable, signal } from '@angular/core';
import { WEBMCP_TOOLS, WebMcpTool } from '../contracts/webmcp-tool.interface';
import { ModelContext } from '../contracts/webmcp.types';

@Injectable({
  providedIn: 'root'
})
export class WebMcpHostService {
  private readonly tools = inject<readonly WebMcpTool[]>(WEBMCP_TOOLS, { optional: true }) ?? [];

  readonly isSupported = signal<boolean>(false);
  readonly registeredToolNames = signal<string[]>([]);


  initialize(): void {
    let context: ModelContext | undefined;
    if (typeof document !== 'undefined' && document.modelContext) {
      context = document.modelContext;
    } else if (typeof navigator !== 'undefined' && navigator.modelContext) {
      context = navigator.modelContext;
    }

    if (!context || typeof context.registerTool !== 'function') {
      this.isSupported.set(false);
      return;
    }

    this.isSupported.set(true);
    const registered: string[] = [];

    for (const tool of this.tools) {
      try {
        context.registerTool({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
          execute: (args: Record<string, any>) => tool.execute(args)
        });
        registered.push(tool.name);
      } catch (err) {
        console.warn(`Failed to register WebMCP tool: ${tool.name}`, err);
      }
    }

    this.registeredToolNames.set(registered);
  }
}
