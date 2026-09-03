import { inject, Injectable, signal } from '@angular/core';
import { WEBMCP_TOOLS, WebMcpTool } from '../contracts/webmcp-tool.interface';
import { ModelContext, ToolDeclaration, WebMcpPermissionTier } from '../contracts/webmcp.types';

export interface WebMcpExecutionLog {
  readonly id: string;
  readonly toolName: string;
  readonly tier: WebMcpPermissionTier;
  readonly timestamp: string;
  readonly input: unknown;
  readonly output?: unknown;
  readonly error?: string;
  readonly status: 'success' | 'failed' | 'denied';
}

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
  readonly executionLogs = signal<WebMcpExecutionLog[]>([]);
  readonly isPanelOpen = signal<boolean>(false);

  togglePanel(): void {
    this.isPanelOpen.update((open) => !open);
  }

  getToolsList(): readonly WebMcpTool[] {
    return this.tools;
  }

  async executeToolDirect(name: string, args: Record<string, unknown> = {}): Promise<unknown> {
    const tool = this.tools.find((t) => t.name === name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    const logId = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString();

    try {
      const result = await tool.execute(args);
      this.addLog({
        id: logId,
        toolName: tool.name,
        tier: tool.tier,
        timestamp,
        input: args,
        output: result,
        status: 'success'
      });
      return result;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const isSecurityDenied =
        errorMsg.includes('Human Approval') || errorMsg.includes('Security Policy');

      this.addLog({
        id: logId,
        toolName: tool.name,
        tier: tool.tier,
        timestamp,
        input: args,
        error: errorMsg,
        status: isSecurityDenied ? 'denied' : 'failed'
      });
      throw err;
    }
  }

  initialize(): void {
    const toolDeclarations: ToolDeclaration[] = [];

    for (const tool of this.tools) {
      toolDeclarations.push({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        execute: (args: Record<string, unknown>) => this.executeToolDirect(tool.name, args)
      });
    }

    // Determine target context or provide browser-native WebMCP bridge
    let context: ModelContext | undefined;
    if (typeof document !== 'undefined' && document.modelContext) {
      context = document.modelContext;
    } else if (
      typeof navigator !== 'undefined' &&
      (navigator as unknown as { modelContext?: ModelContext }).modelContext
    ) {
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
        executeTool: (name: string, args: Record<string, unknown> = {}) =>
          this.executeToolDirect(name, args)
      };
    }

    this.registeredToolNames.set(registered);
    this.isSupported.set(registered.length > 0);

    console.info(
      `[WebMCP Host] Successfully registered ${registered.length} client tools:`,
      registered.join(', ')
    );
  }

  private addLog(log: WebMcpExecutionLog): void {
    this.executionLogs.update((logs) => [log, ...logs.slice(0, 49)]);
  }
}
