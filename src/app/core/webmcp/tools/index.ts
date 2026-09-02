import { Provider } from '@angular/core';
import { WEBMCP_TOOLS } from '../contracts/webmcp-tool.interface';
import { CreateAuditTool } from './propose/create-audit.tool';
import { GenerateRegressionTestTool } from './propose/generate-regression-test.tool';
import { ProposeRemediationTool } from './propose/propose-remediation.tool';
import { GetAuditTool } from './read/get-audit.tool';
import { GetFindingsTool } from './read/get-findings.tool';
import { InspectFindingTool } from './read/inspect-finding.tool';
import { InspectPatternTool } from './read/inspect-pattern.tool';
import { ApplyRemediationTool } from './write/apply-remediation.tool';

export * from './base-tool';
export * from './read/get-audit.tool';
export * from './read/get-findings.tool';
export * from './read/inspect-finding.tool';
export * from './read/inspect-pattern.tool';
export * from './propose/create-audit.tool';
export * from './propose/propose-remediation.tool';
export * from './propose/generate-regression-test.tool';
export * from './write/apply-remediation.tool';

export const ALL_WEBMCP_TOOL_CLASSES = [
  GetAuditTool,
  GetFindingsTool,
  InspectFindingTool,
  InspectPatternTool,
  CreateAuditTool,
  ProposeRemediationTool,
  GenerateRegressionTestTool,
  ApplyRemediationTool
] as const;

/**
 * Convenience provider configuration for all standard WebMCP tools
 */
export function provideWebMcpTools(): Provider[] {
  return ALL_WEBMCP_TOOL_CLASSES.map((toolClass) => ({
    provide: WEBMCP_TOOLS,
    useClass: toolClass,
    multi: true
  }));
}
