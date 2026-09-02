import { WebMcpTool } from '../contracts/webmcp-tool.interface';
import { WebMcpPermissionTier, WebMcpToolParameter } from '../contracts/webmcp.types';

export abstract class BaseWebMcpTool<TInput = Record<string, any>, TOutput = any>
  implements WebMcpTool<TInput, TOutput>
{
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly tier: WebMcpPermissionTier;
  readonly parameters?: Record<string, WebMcpToolParameter>;

  abstract execute(input: TInput): Promise<TOutput> | TOutput;
}
