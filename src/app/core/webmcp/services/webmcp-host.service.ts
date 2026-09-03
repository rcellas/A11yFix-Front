import { inject, Injectable, signal } from '@angular/core';
import { WEBMCP_TOOLS, WebMcpTool } from '../contracts/webmcp-tool.interface';
import { ModelContext, ToolDeclaration } from '../contracts/webmcp.types';

export interface GlobalWebMcpApi {
  listTools: () => readonly ToolDeclaration[];
  executeTool: (name: string, args?: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Window {
    modelContext?: ModelContext;
    a11yfixWebMcp?: GlobalWebMcpApi;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebMcpHostService {
  private readonly tools = inject<readonly WebMcpTool[]>(WEBMCP_TOOLS, { optional: true }) ?? [];

  readonly isSupported = signal<boolean>(true);
  readonly registeredToolNames = signal<string[]>([]);

  initialize(): void {
    const registeredToolsMap = new Map<string, WebMcpTool>();
    const toolDeclarations: ToolDeclaration[] = [];

    for (const tool of this.tools) {
      registeredToolsMap.set(tool.name, tool);
      toolDeclarations.push({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        execute: (args: Record<string, unknown>) => tool.execute(args)
      });
    }

    // Determine target context or provide browser-native WebMCP bridge
    let context: ModelContext | undefined;
    if (typeof document !== 'undefined' && document.modelContext) {
      context = document.modelContext;
    } else if (typeof navigator !== 'undefined' && (navigator as unknown as { modelContext?: ModelContext }).modelContext) {
      context = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    } else if (typeof window !== 'undefined' && window.modelContext) {
      context = window.modelContext;
    }

    // If browser doesn't have native modelContext, create high-compatibility client bridge
    if (!context || typeof context.registerTool !== 'function') {
      const toolRegistry = new Map<string, ToolDeclaration>();

      const bridgeContext: ModelContext = {
        registerTool: (declaration: ToolDeclaration) => {
          toolRegistry.set(declaration.name, declaration);
        }
      };

      if (typeof document !== 'undefined') {
        document.modelContext = bridgeContext;
      }
      if (typeof window !== 'undefined') {
        window.modelContext = bridgeContext;
      }
      context = bridgeContext;
    }

    const registered: string[] = [];

    for (const declaration of toolDeclarations) {
      try {
        context.registerTool(declaration);
        registered.push(declaration.name);
      } catch (err) {
        console.warn(`[WebMCP Host] Failed to register tool: ${declaration.name}`, err);
      }
    }

    // Expose convenient global helper on window for AI agents / console verification
    if (typeof window !== 'undefined') {
      window.a11yfixWebMcp = {
        listTools: () => toolDeclarations,
        executeTool: async (name: string, args: Record<string, unknown> = {}) => {
          const tool = registeredToolsMap.get(name);
          if (!tool) {
            throw new Error(`WebMCP Tool "${name}" is not registered.`);
          }
          return tool.execute(args);
        }
      };
    }

    this.registeredToolNames.set(registered);
    this.isSupported.set(registered.length > 0);

    console.info(
      `[WebMCP Host] Successfully registered ${registered.length} client tools:`,
      registered.join(', ')
    );
  }
}
