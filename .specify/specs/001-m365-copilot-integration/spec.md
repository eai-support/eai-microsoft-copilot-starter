# Feature Specification: Microsoft 365 Copilot Integration

**Feature Branch**: `001-m365-copilot-integration`  
**Created**: 2026-09-02  
**Status**: Starter-kit implementation and development-boundary validation complete

## Executive Summary

- Add EAI as a governed agent inside Microsoft 365 Copilot and Teams.
- Keep all EAI data access and actions behind regional PublicAPI V4 and Authz.
- Use AzureAPI for Microsoft Graph and Entra integration and AICore for EAI-owned AI orchestration.
- Start with live retrieval and a narrow tool allowlist; do not copy EAI data into Microsoft Graph by default.
- Reuse existing PublicAPI V4 Content Understanding and EAI prompt configuration; do not duplicate analyzer or domain prompt administration in Microsoft.
- Start with a fixed OpenAPI plugin. Foundry Agent Service, Toolboxes, and inbound MCP are optional later capabilities.
- Use one reusable EAI Connection for Microsoft Copilot rather than build a separate integration for each app.
- The connection design has been tested against 100 ranked use cases. The Customer Case Assistant is the implemented starter journey.

## Goal Ledger Alignment

| Goal ID | Outcome | Target |
| --- | --- | --- |
| G1 | A commercially viable Microsoft 365 Copilot channel that preserves EAI governance | One approved and measurable customer pilot |

## Application Classification

- **Mode**: architecture and product research; application delivery pending.
- **Profile**: dynamic because the final design can span more than three platform workstreams and introduces an external identity and execution channel.
- **Confirmation gate**: business and architecture approval required before specification is expanded or implementation starts.

## Candidate P1 Journey

As a customer user in Microsoft 365 Copilot, I can find and summarize the EAI items I am already authorized to see and, after explicit confirmation, create one reversible follow-up action. The same user and tenant must receive equivalent access in the EAI app and Copilot channel.

The preferred concrete journey is document analysis: submit a document, run an approved EAI Content Understanding classifier/analyzer, receive bounded grounded fields and review warnings, and create one draft follow-up after confirmation.

The strongest alternative pilots are customer case self-service, supplier onboarding and contract obligation management. See `copilot-eai-100-use-cases.md` for the ranked catalogue.

For a reusable public demonstration, use the Customer Case Assistant journey in a new template-derived `eai-support/eai-microsoft-copilot-starter` repository. See `copilot-starter-kit-recommendation.md`.

## Product Boundary

The product is a reusable **EAI Connection for Microsoft Copilot** with:

- a generated Microsoft declarative agent and OpenAPI plugin package;
- OAuth authorization-code sign-in to EAI External ID;
- a narrow PublicAPI V4 task-tool facade;
- tenant and app installation resolution enforced by the server;
- Authz decisions for every resource and action;
- ResourceAPI storage for tenant and app-owned business records;
- optional separately consented Microsoft Graph access through AzureAPI;
- AICore orchestration, prompts, RAG and Content Understanding behind PublicAPI;
- confirmation, optimistic versioning, idempotency and audit receipts for mutations;
- an equivalent EAI application channel for authorized users without Microsoft 365 Copilot entitlement.

The full technical design is in `copilot-eai-reference-architecture.md`.

## Functional Requirements

### Identity And Access

- **FR-001:** The plugin must use a per-user OAuth token issued by an approved EAI External ID tenant and addressed to PublicAPI.
- **FR-002:** PublicAPI must validate issuer, audience, signature, expiry and immutable subject claims before tenant resolution.
- **FR-003:** External identities must map by issuer plus subject, never email alone.
- **FR-004:** The server must resolve effective EAI tenant membership and reject client attempts to invent tenant scope.
- **FR-005:** Users with several memberships must select from authorized tenant hierarchy; revoked membership must block the next call.
- **FR-006:** Authz must independently authorize every tool's exact tenant, app, resource and action.
- **FR-007:** Microsoft Graph permissions must be separately consented and must not be inferred from EAI authentication.

### Agent And Tool Contract

- **FR-008:** Each published EAI app version must generate a versioned Microsoft agent, plugin and OpenAPI package from one approved source.
- **FR-009:** The package must expose task-level allowlisted tools, not the full PublicAPI surface or downstream service APIs.
- **FR-010:** Every tool must declare purpose, caller roles, tenant scope, input/output, data classification, risk, confirmation, idempotency and audit behavior.
- **FR-011:** Phase one must use a fixed OpenAPI plugin with five or fewer tools.
- **FR-012:** Tool responses must be bounded, redacted and paginated or deep-linked when the result is larger than the channel limit.
- **FR-013:** MCP discovery must remain out of phase one and default-deny if introduced later.

### Data And Mutations

- **FR-014:** Copilot and the EAI app must use the same PublicAPI command and ResourceAPI record for the same business capability.
- **FR-015:** ResourceAPI records must be scoped by EAI tenant, app installation, object type and record.
- **FR-016:** Resource creation must use strict V4 `POST` with a `data` envelope.
- **FR-017:** Resource updates must use strict V4 `PUT` with a `data` envelope and current positive version.
- **FR-018:** Material writes must require explicit user confirmation and reauthorization at execution time.
- **FR-019:** Mutations must accept an idempotency key and return record ID, version, request/correlation IDs and an audit receipt.
- **FR-020:** Stale updates must return conflict and require refresh and reconfirmation; they must never silently overwrite.
- **FR-021:** Agent removal must not silently delete business data; app data deletion requires an explicit app-owned cascade that preserves shared tenant resources.

### AI And Documents

- **FR-022:** EAI tenant/workflow prompts, AI profiles and analyzer definitions must remain authoritative.
- **FR-023:** Microsoft agent instructions must contain channel guidance only and must not become an authorization or domain-policy control.
- **FR-024:** Documents sent to EAI must be claimed into tenant-owned storage before governed processing.
- **FR-025:** Long-running AI work must return opaque job IDs and bounded status/result responses, never provider credentials or operation URLs.
- **FR-026:** Low-confidence or policy-sensitive outputs must enter a human review state before consequential action.

### Lifecycle And Evidence

- **FR-027:** An EAI tenant admin must approve app installation, tool grants and EAI data scope.
- **FR-028:** A Microsoft admin must approve the agent package and any OAuth or Graph consent required in that Microsoft organization.
- **FR-029:** Admins must be able to disable one tool, the Copilot channel or the complete installation without weakening the EAI app's security boundary.
- **FR-030:** Audit evidence must identify user, tenant, app installation, tool and package version, confirmation, input classification, record version, outcome and cost correlation without logging secrets.
- **FR-031:** The public starter must be generated from `eai-support/eai-app-template`, record its source commit and report material upstream drift without overwriting starter-specific files.
- **FR-032:** The starter must include both a Microsoft Copilot/Teams channel and an EAI web channel over the same case records and PublicAPI business contract.
- **FR-033:** Public demonstration mode must use synthetic data; live tenant mode must require explicit EAI and Microsoft organization configuration.
- **FR-034:** Initial publication must target an organizational catalog; marketplace publication is a later commercial gate.

## Non-Negotiable Requirements

- PublicAPI V4 is the only EAI ingress for agent tools.
- Authz independently authorizes every resource and action.
- Customer identity resolves to an EAI user and tenant membership.
- No arbitrary customer Entra issuer is trusted by default.
- No downstream EAI service is exposed directly.
- Mutating tools are allowlisted, confirmation-gated, version-aware, idempotent where applicable, and audited.
- Microsoft Graph indexing is excluded until ACL, identity, retention, deletion, and customer-admin controls are approved.
- EAI tenant/workflow prompts and AI profiles remain the domain source of truth; Microsoft agent instructions are channel-specific only.
- Analyzer administration and Foundry administration are never exposed as general Copilot tools.
- Dynamically discovered MCP tools are default-deny unless their risk, approval, tenant, and authorization behavior is explicitly configured.

## Success Criteria

- Read results match the user's EAI app entitlements.
- Cross-tenant and revoked users receive no data.
- The pilot mutation creates one auditable result and handles repeat or stale requests safely.
- Customer admins can approve, scope, disable, and remove the agent.
- Microsoft licence/credit cost and EAI consumption are separately measurable.
- A customer or partner identity federated through External ID can use the same authorized EAI capability as an employee without being added to the enterprise workforce tenant.
- A user without Microsoft 365 Copilot entitlement can complete the same authorized capability through the EAI application channel.
- The generated agent package contains only approved tools and cannot call ResourceAPI, AICore, AzureAPI or storage directly.
- Create, update, action, stale-version, duplicate-retry, revoked-user and cross-tenant denial tests pass in a deployed non-production tenant.

## Use-Case Validation

The reference architecture has been exercised on paper against exactly 100 use cases across customer service, partner collaboration, documents, compliance, projects, operations, finance, workforce, analytics, industry workflows and agent administration.

All 100 fit six reusable patterns: external access, governed retrieval, controlled mutation, document intelligence, Microsoft context and long-running workflow. None requires a direct downstream-service or database bypass.

The delivered starter scope was rechecked against the goal ledger and traceability matrix on 2026-09-10 UTC.

The specification remains aligned after the final research refresh.
