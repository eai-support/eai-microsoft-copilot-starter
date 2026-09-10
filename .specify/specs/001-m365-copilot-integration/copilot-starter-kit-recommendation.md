# Microsoft Teams And Copilot Starter Kit

## Recommendation

Create `eai-support/eai-microsoft-copilot-starter` as a new public repository generated from `eai-support/eai-app-template`.

Do not create it as a permanent GitHub fork. The public EAI app template is already a GitHub template in the same organization. A template-derived repository gives the starter its own product identity, issues and release history while preserving the normal EAI template maintenance path.

The starter should remain close to `eai-app-template`, but it should be a working reference application rather than another general-purpose template.

## Why This Is The Best Demonstration

The starter can show the complete commercial proposition in one small application:

- a Microsoft 365 Copilot and Teams channel for licensed users;
- an EAI web channel for customers or partners without Copilot entitlement;
- EAI External ID sign-in for workforce and external identities;
- the same PublicAPI V4 tools in both channels;
- the same tenant and app-owned ResourceAPI records;
- controlled create and version-aware update behavior;
- authorization, confirmation and audit evidence that remain effective regardless of channel.

This is stronger than a manifest-only Copilot sample because customers can see the EAI differentiation. It is also safer and easier to maintain than copying the full platform or exposing generic PublicAPI operations.

Microsoft's application model supports this split: the Microsoft 365 app package contains manifests and icons, while application logic and data remain hosted externally behind HTTPS. [Microsoft 365 app model for agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-are-apps)

## Demonstration Application

Use a **Customer Case Assistant** as the first starter journey.

### User Journey

1. A user opens the EAI agent in Microsoft 365 Copilot or Teams.
2. Microsoft obtains a per-user EAI token through OAuth.
3. The user selects an authorized EAI tenant if they have more than one.
4. The user asks for their open cases and receives a bounded tenant-scoped result.
5. The user creates a new draft case after confirmation.
6. The user reads the current case version and confirms a status or note update.
7. PublicAPI rejects stale, unauthorized or cross-tenant updates.
8. The user opens the EAI web application and sees the same records and audit history.
9. Removing the user's EAI membership blocks both channels at the next protected call.

### Initial Tools

Keep the package to five business operations:

| Tool | Purpose | Risk |
| --- | --- | --- |
| `list_my_cases` | Return a bounded list of cases visible to the caller | Read |
| `get_case` | Return one authorized case with current version and source link | Read |
| `create_case` | Create a draft case through strict V4 `POST {data}` | Confirmed write |
| `add_case_note` | Add a user-authored note with an idempotency key | Confirmed write |
| `update_case_status` | Update an allowed status through strict V4 `PUT {data, version}` | Confirmed, version-aware write |

The starter must not expose raw object-type CRUD, arbitrary routes, tenant administration, analyzer administration or downstream EAI services.

## Repository Shape

```text
eai-microsoft-copilot-starter/
  appPackage/
    manifest.json
    declarativeAgent.json
    plugins/eai-cases-plugin.json
    apiSpecification/eai-cases.openapi.yml
    adaptiveCards/
    color.png
    outline.png
  m365agents.yml
  env/
    .env.local.example
    .env.dev.example
  src/
    app/                         # EAI web channel and Teams tab
    auth.ts                      # EAI External ID sign-in
    components/                  # selected EAI app-template components
    eai.config/                  # app, object-type and runtime contracts
    hooks/                       # canonical EAI SDK hooks
    lib/platform/                # BFF, routing and strict V4 helpers
  tests/
    business-scenarios/
    copilot-contract/
    e2e/
  docs/
    architecture.md
    install-in-microsoft-365.md
    install-in-eai.md
    demo-script.md
    security-and-data-boundaries.md
  scripts/
    verify-agent-package.mjs
    verify-template-drift.mjs
  eai.runtime.json
  package.json
  README.md
```

Use Microsoft 365 Agents Toolkit to generate and validate the declarative-agent action from the approved OpenAPI document rather than hand-maintaining unrelated manifest variants. Microsoft currently provides templates for declarative agents using existing OpenAPI APIs and supports organization-catalog publication through its lifecycle configuration. [Agents Toolkit templates](https://github.com/microsoft/skills/blob/main/.github/plugins/microsoft-365-agents-toolkit/skills/teams-app-developer/toolkit/templates.md) [Publish custom apps](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/publish)

## Components To Reuse From EAI App Template

Reuse the components that prove EAI platform value:

- External ID/Auth.js server-side session configuration;
- the `/api/eai` BFF for the web channel;
- server-authoritative tenant routing;
- `useResources`, `useDocuments` and `useChat` where the journey uses them;
- canonical object-type naming and strict V4 resource helpers;
- `src/eai.config` app and object-type registration;
- runtime, schema provenance and platform readiness checks;
- cross-platform `run.sh`, `run.ps1` and `run.bat` launchers;
- Gofer workspace assets and business-scenario testing;
- Playwright, unit, route-export and runtime validation.

Do not carry every generic component merely because it exists. The starter should remain understandable in under 30 minutes and the demo path should be obvious from the root README.

## New Starter-Specific Components

- Microsoft app, declarative-agent and API-plugin manifests;
- generated, narrow OpenAPI contract for the five case tools;
- OAuth configuration referencing the EAI External ID authorization service;
- adaptive cards for case list, case detail and confirmed mutation receipts;
- organization-catalog publish configuration;
- a mock/demo mode using synthetic records only;
- a real EAI tenant mode requiring explicit configuration;
- package validation and Microsoft 365 deployment instructions;
- a parity test proving Copilot and web channels use the same business contract.

## Maintenance Model

The starter should record the app-template source commit from which it was generated and use the existing `eai update` and template-drift process.

Add a scheduled or manually triggered check that:

1. reads the current `eai-support/eai-app-template` source commit;
2. reports security, authentication, SDK, runtime and Gofer drift;
3. opens an update issue or PR for review;
4. never overwrites starter-specific Microsoft manifests or the demonstration journey;
5. reruns web, plugin-contract and two-channel parity tests after refresh.

This is preferable to GitHub fork synchronization because the starter intentionally has a different purpose and structure from the general app template.

## Evidence The Starter Must Show

The demo is complete only when it proves:

- one workforce user and one External ID customer can sign in;
- both channels return the same authorized case data;
- a non-member and a cross-tenant user receive no case data;
- create uses `POST {data}` and update uses `PUT {data, version}`;
- Copilot asks for confirmation before writes;
- a stale version is rejected and requires refresh and reconfirmation;
- a duplicate mutation returns the original idempotent receipt;
- membership revocation blocks the next call;
- ResourceAPI contains one record, not separate Copilot and web copies;
- package validation, repository CI and deployed non-production tests pass.

## Distribution

Start by publishing to one customer's Microsoft 365 organizational catalog. Agents Toolkit supports organization-catalog publication and the customer admin approves the app in Microsoft administration. Move to Microsoft commercial marketplace submission only after the identity, support, privacy, lifecycle and multi-customer installation model is proven. [Publish agents for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/publish)

## Build Decision

Proceed if the business owner approves:

1. repository name `eai-support/eai-microsoft-copilot-starter`;
2. Customer Case Assistant as the demonstration;
3. the five-tool limit above;
4. organizational-catalog deployment before marketplace publication;
5. synthetic demo data for public use and an explicitly configured EAI tenant for live validation.

