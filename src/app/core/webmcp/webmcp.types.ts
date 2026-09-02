export type WebMcpPermissionTier = 'READ' | 'PROPOSE' | 'WRITE';

export interface WebMcpToolParameter {
  readonly type: string;
  readonly description: string;
  readonly required?: boolean;
  readonly enum?: readonly string[];
}

export interface WebMcpToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly tier: WebMcpPermissionTier;
  readonly parameters?: Record<string, WebMcpToolParameter>;
  readonly handler: (params: Record<string, any>) => Promise<any> | any;
}

export interface ModelContext {
  registerTool(tool: {
    name: string;
    description: string;
    parameters?: Record<string, any>;
    execute: (params: Record<string, any>) => Promise<any> | any;
  }): void;
  unregisterTool?(name: string): void;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }
  interface Navigator {
    modelContext?: ModelContext;
  }
}
