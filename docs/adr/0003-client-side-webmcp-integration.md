# ADR 0003: Browser-Native Client-Side WebMCP Integration and Security Barrier

## Status
Accepted

## Context
A11yFix is an agent-native application where the frontend acts as a WebMCP host. WebMCP enables browser-based AI agents to interact with the application via structured tools instead of brittle DOM scraping. However:
1. WebMCP is currently an experimental browser-native capability (`document.modelContext`), not a server protocol.
2. Destructive or state-mutating actions (`apply_remediation`) must require explicit human authorization.
3. Users on browsers without WebMCP support must still be able to use the entire application.

## Decision
1. **Client-Side Registration**:
   - Register tools directly via `document.modelContext.registerTool({ name, description, inputSchema, execute })`, with fallback inspection of `navigator.modelContext`.
   - Never implement WebMCP via SSE, stdio, or WebSocket backend bridges in this frontend.
2. **Tool Permission Classification**:
   - **READ**: Information retrieval (`get_audit`, `get_findings`, `inspect_finding`, `inspect_pattern`).
   - **PROPOSE**: Proposal generation (`create_audit`, `propose_remediation`, `generate_regression_test`).
   - **WRITE**: Modifications (`apply_remediation`).
3. **Mandatory Human Approval Barrier**:
   - The `apply_remediation` tool directly calls the `RemediationFacade.applyRemediation()` use case.
   - If the current remediation state is not `approved` with a valid approval token, the tool throws a `PermissionDeniedException: Remediation must be explicitly approved by human reviewer in the UI before applying.`
4. **Graceful Degradation**:
   - Provide a `WebMcpService` that feature-detects `modelContext`. If absent, log an informative notice and expose all capabilities through the standard Angular UI.

## Consequences
### Positive
- Browser-native agent interaction with zero external process overhead.
- Total security against unauthorized agent writes: human approval cannot be bypassed.
- 100% functional for standard browser users without WebMCP.

### Negative
- Requires maintaining input schemas (JSON Schema) alongside application facade contracts.
