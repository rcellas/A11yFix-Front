import { InjectionToken } from '@angular/core';
import { WebMcpPermissionTier, WebMcpToolParameter } from './webmcp.types';

export interface WebMcpTool<TInput = Record<string, any>, TOutput = any> {
  readonly name: string;
  readonly description: string;
  readonly tier: WebMcpPermissionTier;
  readonly parameters?: Record<string, WebMcpToolParameter>;

  execute(input: TInput): Promise<TOutput> | TOutput;
}

export const WEBMCP_TOOLS = new InjectionToken<readonly WebMcpTool[]>('WEBMCP_TOOLS');
