# ♿ A11yFix Web — Agent-Native Accessibility QA & WebMCP Host

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Angular 21](https://img.shields.io/badge/Framework-Angular_21_Standalone-DD0031.svg?logo=angular)](https://angular.dev)
[![State](https://img.shields.io/badge/Reactivity-Angular_Signals-38bdf8.svg)](https://angular.dev/guide/signals)
[![WCAG 2.2](https://img.shields.io/badge/Accessibility-WCAG_2.2_Level_AAA-16a34a.svg)](https://www.w3.org/WAI/WCAG22/)
[![WebMCP](https://img.shields.io/badge/Protocol-WebMCP_Browser--Native-6366f1.svg)](https://github.com/modelcontextprotocol)
[![Testing](https://img.shields.io/badge/Tests-67_Passed_%7C_Vitest-4ade80.svg)](https://vitest.dev)

> **A11yFix** is an agent-native, browser-hosted accessibility QA application built with **Angular 21**, **Angular Signals**, and **WebMCP** (`document.modelContext`). It provides an autonomous end-to-end accessibility workflow: **Detect $\rightarrow$ Understand $\rightarrow$ Propose $\rightarrow$ Approve $\rightarrow$ Fix $\rightarrow$ Verify $\rightarrow$ Prevent Regression**.

---

## 📑 Repositories & Architecture Overview

The A11yFix platform is decoupled into two dedicated repositories following clean architecture principles:

| Repository | Role | Tech Stack | Repository URL |
| :--- | :--- | :--- | :--- |
| **`A11yFix-Front`** *(This repo)* | Browser WebMCP Host, Signal Facades, WAI-ARIA Pattern Engine, Accessible UI | Angular 21, Signals, SCSS Tokens, Vitest, Storybook | [Frontend Repository](https://github.com/rcellas/A11yFix-Front) |
| **`A11yFix-back`** | Audit Scanner API, Playwright Headless Runner, axe-core engine, LLM Remediation | NestJS / Express, Playwright, axe-core, TypeScript | [Backend Repository](https://github.com/rcellas/A11yFix-back) |

---

## 🌐 Live Deployment & Cold Start Notice

> [!IMPORTANT]
> **Render Free Tier Cold Start Notice**:
> If the live deployment connects to a backend hosted on Render's free tier, the instance automatically sleeps after periods of inactivity.
> 
> The **initial audit request may take 30–50 seconds** while the backend container boots up. Subsequent requests execute at full speed.

---

## 🤖 WebMCP Host Implementation (`document.modelContext`)

A11yFix Web acts as a **browser-native WebMCP client host**. Rather than using server-side stdio or SSE protocols, tools are registered directly into the browser's JavaScript execution environment via `document.modelContext.registerTool` (with graceful fallback to `navigator.modelContext` and direct GUI execution).

### Tool Registration Standard

Every WebMCP tool in A11yFix implements the browser-native registration interface:

```typescript
// Browser-Native WebMCP Registration in A11yFix Web
document.modelContext.registerTool({
  name: "propose_remediation",
  description: "Generate a context-aware WAI-ARIA APG remediation proposal and code diff for an accessibility finding",
  inputSchema: {
    type: "object",
    properties: {
      findingId: {
        type: "string",
        description: "The unique identifier of the accessibility finding"
      },
      proposedHtml: {
        type: "string",
        description: "Optional custom HTML replacement"
      },
      explanation: {
        type: "string",
        description: "Technical rationale referencing WCAG 2.2 criteria"
      }
    },
    required: ["findingId"]
  },
  execute: async (input: { findingId: string; proposedHtml?: string; explanation?: string }) => {
    // Executes via RemediationFacade and updates Signal state
    return await remediationFacade.requestAiRemediation(auditId, input.findingId);
  }
});
```

### 🛡️ Permission Tiers & Mandatory Human Approval Barrier

WebMCP tools are categorized into three strict security tiers:

```mermaid
graph LR
  subgraph READ_TIER["Tier 1: READ"]
    get_audit["get_audit"]
    get_findings["get_findings"]
    inspect_finding["inspect_finding"]
    inspect_pattern["inspect_pattern"]
  end

  subgraph PROPOSE_TIER["Tier 2: PROPOSE"]
    create_audit["create_audit"]
    propose_remediation["propose_remediation"]
    generate_regression_test["generate_regression_test"]
  end

  subgraph WRITE_TIER["Tier 3: WRITE (Protected)"]
    apply_remediation["apply_remediation"]
  end

  PROPOSE_TIER -->|"Generates Proposal"| BARRIER{{"🔒 Human Approval Barrier"}}
  BARRIER -->|"Engineer Clicks 'Approve'"| WRITE_TIER
  BARRIER -.->|"Rejected / Unapproved"| REJECT["❌ Execution Denied"]
```

1. **`READ`**: `get_audit`, `get_findings`, `inspect_finding`, `inspect_pattern`.
2. **`PROPOSE`**: `create_audit`, `propose_remediation`, `generate_regression_test`.
3. **`WRITE`**: `apply_remediation`.
   - **Mandatory Human Approval**: `apply_remediation` strictly **rejects** execution if human approval has not been granted in the application state. Automated agents cannot modify production code without verified human consent.

---

## ♿ WCAG 2.2 & WAI-ARIA APG Pattern Engine

A11yFix evaluates rules against the official **WCAG 2.2** specification (Levels A, AA, and AAA) and embeds an authoring practices guide for **9 interactive patterns**:

- 🗔 **Modal Dialog** (`dialog`): Focus trap, initial focus, escape key dismiss, focus return, `aria-modal="true"`.
- 📑 **Tabs** (`tabs`): Roving tabindex, arrow key navigation (Left/Right, Home, End), `role="tablist"`, `role="tab"`, `role="tabpanel"`.
- 📂 **Disclosure / Accordion** (`disclosure` / `accordion`): Toggle state via `aria-expanded` and `aria-controls`.
- 🔍 **Combobox** (`combobox`): Input with autocomplete listbox, `aria-activedescendant`, up/down keyboard navigation.
- 📋 **Menu Button** (`menu_button`): Popup actions menu with roving focus.
- 🍞 **Breadcrumb** (`breadcrumb`): Semantic `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"`.
- 💬 **Tooltip** (`tooltip`): Focus/hover disclosure with Escape key dismissal.
- ⚠️ **Alert Dialog** (`alert_dialog`): Urgent confirmation modal with assertive announcements.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/rcellas/A11yFix-Front.git
cd A11yFix-Front

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create or edit `src/environments/environment.ts` to point to your backend API:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000' // Or your deployed A11yFix-back URL
};
```

### 3. Start Development Server

```bash
pnpm dev
# or: pnpm start
```

Navigate to `http://localhost:4200/` in your browser.

---

## 🧪 Testing & Verification

### Unit & Component Tests (Vitest)

All state machines, facades, WebMCP tools, and component logic are tested with Vitest:

```bash
# Run all unit tests (single run)
pnpm ng test --watch=false

# Run in watch mode
pnpm ng test
```

### Component Catalog & Isolated A11y Verification (Storybook)

Storybook is configured with `@storybook/addon-a11y` to verify component accessibility in isolation:

```bash
# Start Storybook server
pnpm storybook
```

Navigate to `http://localhost:6006/` to explore the **Design System** and **WAI-ARIA APG Pattern Catalog**.

---

## 🏗️ Architecture & Clean Code Guidelines

```text
src/app/
├── components/          # Atomic Design System (Badge, Button, Card, CodeDiffViewer, TextField, FilterChipGroup)
├── core/
│   ├── adapters/        # Infrastructure: HTTP client, Backend DTOs, Mappers, Contextual Remediation Helper
│   ├── facades/         # Application Layer: AuditFacade, RemediationFacade (Signals & Use Cases)
│   ├── models/          # Domain Layer: Finding, AuditReport, WCAG 2.2 Catalog, APG Patterns
│   ├── ports/           # Secondary Ports: AuditApiClient Port interface
│   ├── state/           # State Modeling: Discriminated unions (Idle, Scanning, Completed, Error, AwaitingApproval)
│   └── webmcp/          # WebMCP Host: Tool registry, polymorphic executors, document.modelContext bridge
├── design-system/       # Tokens: Colors, Typography (Inter, JetBrains Mono), Spacing, Elevation
└── features/            # Presentation Views: Audit Workspace, Findings List, Finding Detail, Compliance Success
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
