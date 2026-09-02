# ADR 0001: Frontend Architecture, Layering and Clean Code Principles

## Status
Accepted

## Context
A11yFix is an agent-native application requiring robust, maintainable, and decoupled code. Without explicit architectural boundaries, presentation logic, API communication, agent tool handling, and UI state easily become coupled, resulting in brittle components and regression risks.

## Decision
We adopt a Clean Architecture model with three strictly decoupled layers:

```text
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│  - Atomic Design System (Atoms, Molecules, Organisms)    │
│  - Feature Views (Dashboard, Audit Workspace, etc.)     │
│  - Zero business rules in templates or components       │
└───────────────────────────┬─────────────────────────────┘
                            │ Calls Facade
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│  - Feature Facades (e.g. AuditFacade, RemediationFacade)│
│  - Deterministic UI State Machines (Signals)            │
│  - Use Case Coordination & Security Gates               │
└──────────────┬────────────────────────────┬─────────────┘
               │ Implements                 │ Uses
               ▼                            ▼
┌───────────────────────────────┐ ┌───────────────────────┐
│     Infrastructure Layer      │ │ Infrastructure Layer  │
│  - HTTP API Adapters          │ │  - WebMCP Adapter     │
│  - DTO Mappers to API         │ │  - Tool Registrations │
└───────────────────────────────┘ └───────────────────────┘
```

### Clean Code, SOLID, OOP & KISS Guidelines
1. **Single Responsibility (SRP)**: Each component does one visual job. Facades coordinate state. Adapters communicate over HTTP.
2. **KISS (Keep It Simple, Stupid)**: Avoid unnecessary abstractions, indirection, or global state libraries.
3. **OOP & Domain Modeling**: Encapsulate entities with strongly typed contracts, interfaces, and methods. Use polymorphism for pattern handling.
4. **No Business Leaks**: Server-side audit rules, Playwright execution, and database logic remain exclusively in `a11yfix-api`.

## Consequences
### Positive
- Components are lightweight, reusable, and easy to test in isolation with Storybook.
- Application facades serve both the human UI and the WebMCP tool layer with zero code duplication.
- API contract changes are isolated to the Infrastructure adapter layer.

### Negative
- Requires discipline to route interactions through application facades rather than calling HTTP services directly from components.
