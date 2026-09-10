# EAI Connection For Microsoft Copilot

## Executive Design

Build one reusable **EAI Connection for Microsoft Copilot**. It lets a Microsoft 365 Copilot agent use EAI business capabilities without giving Microsoft direct access to EAI databases or internal services.

The connection has two jobs:

1. **Identity and control:** EAI External ID authenticates employees, customers, partners and citizens. EAI tenant membership and Authz decide what each person can see and do.
2. **Business data and action:** PublicAPI V4 exposes a small set of task-level tools. ResourceAPI stores app-owned tenant data, AICore performs governed AI work, and AzureAPI connects to Microsoft Graph when separately approved.

Microsoft 365 Copilot licensing remains a Microsoft requirement. EAI CIAM expands who can securely use EAI; it does not give a user a Copilot licence. Every capability therefore has two channels over the same policy and data:

- licensed users work through Microsoft 365 Copilot or Teams;
- other authorized users work through an EAI web or mobile application.

## Business Outcome

The design turns a Copilot app from a conversational front end into a governed business application. It adds:

- customer and partner access outside the enterprise workforce tenant;
- tenant-isolated, app-owned operational data rather than document-only knowledge;
- controlled create, update and action workflows;
- reusable business rules, prompts, models and document analyzers;
- audit receipts, version control and evidence for every material action;
- one business capability that works in Copilot and non-Copilot channels.

## Reference Architecture

```text
Licensed employee, customer or partner          Non-Copilot customer or partner
Microsoft 365 Copilot / Teams                   EAI web or mobile application
              |                                             |
              | OAuth authorization code                     | EAI BFF session
              +----------------------+----------------------+
                                     |
                          EAI External ID (CIAM)
                 federation, sign-in, token, user identity
                                     |
                                     v
                    EAI Copilot Connection / PublicAPI V4
                 versioned task tools, tenant and app context
                                     |
                  +------------------+------------------+
                  |                  |                  |
               Authz              AICore            AzureAPI
          tenant/resource/      prompts, RAG,       Graph and
          action decisions      models, CU          Entra adapters
                  |                  |                  |
                  +------------------+------------------+
                                     |
                                ResourceAPI
                    tenant and app-owned semantic data,
                         files, indexes and versions
                                     |
                            Audit and usage evidence
```

## Connection Model

### 1. Agent Package

Each EAI-enabled Copilot app is delivered as a versioned Microsoft agent package containing:

- the Microsoft app manifest;
- a declarative agent manifest;
- short channel instructions and conversation starters;
- an API plugin manifest;
- a generated OpenAPI document containing only approved EAI tools.

Start with an OpenAPI API plugin. It provides a fixed and reviewable contract in which each function maps to a known `operationId`. Microsoft also supports MCP plugins, but dynamic tool discovery should be introduced only after EAI has a mature tool registry, risk model and promotion process. [Microsoft API plugin structure](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/instructions-api-plugins)

### 2. User Authentication

Use the OAuth authorization code flow supported by Microsoft Copilot plugins. Microsoft Enterprise token store obtains and sends a user token whose issuer is EAI External ID and whose audience is PublicAPI. [Microsoft plugin authentication](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication)

For a customer whose users already have organizational Microsoft accounts, EAI External ID can federate that customer's Entra ID tenant through OpenID Connect. The user signs in with the familiar organizational account, but EAI still receives a token from its approved CIAM trust boundary. [Microsoft Entra ID federation for External ID](https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-entra-id-federation-customers)

PublicAPI then:

1. validates issuer, audience, signature, expiry and required identity claims;
2. resolves the immutable external identity to an EAI user using issuer and subject, never email alone;
3. resolves the selected EAI tenant and app installation;
4. checks current tenant membership and account status;
5. asks Authz for the exact resource and action decision.

An arbitrary customer Entra token must not be trusted directly. Federation into EAI External ID provides one controlled issuer and avoids weakening PublicAPI token validation.

### 3. Tenant And App Context

The Copilot package identifies the EAI app, but the server determines the effective tenant. The client cannot make itself a member by sending a tenant header.

- One valid tenant membership: select it automatically.
- Several valid memberships: require the user to select from the hierarchy they can access and remember only a revocable preference.
- No valid membership: deny the tool call and provide an EAI access-request link.
- Revoked membership: deny the next call, even if the Microsoft conversation remains open.

Every request carries or derives:

- EAI user ID;
- EAI tenant ID;
- EAI app key and installation ID;
- agent package and tool-contract version;
- request and correlation IDs;
- idempotency key for retry-safe mutations.

### 4. Business Tool Boundary

Copilot receives task tools, not the whole PublicAPI or generic database access. Examples are:

- `find_customer_cases`
- `summarize_case_evidence`
- `submit_document_for_analysis`
- `create_draft_follow_up`
- `approve_supplier_evidence`

The tool facade sits in regional PublicAPI V4. It composes existing PublicAPI routes and downstream services while preserving their security boundaries. Copilot never calls ResourceAPI, AICore, AzureAPI, Content Understanding, Foundry or a database directly.

Each tool declares:

- business purpose and allowed caller roles;
- input and bounded output schema;
- data classification and tenant scope;
- read, write, destructive or privileged risk;
- whether user confirmation is required;
- idempotency and optimistic-version behavior;
- audit fields and safe error codes.

Microsoft declarative agents can use API or MCP plugins to read and mutate external systems. A small allowlisted tool set improves reliability and limits accidental capability exposure. [Microsoft 365 Copilot plugins](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-plugins)

### 5. Data Storage

ResourceAPI remains the system of record for app-owned operational data. Each EAI app manifest defines its object types, relationships, files, indexes and actions. The installation binds those definitions to one EAI tenant.

Data scope is always:

```text
EAI tenant -> app installation -> object type -> record/file/index
```

The Copilot connection stores business records through strict PublicAPI V4 contracts:

- create: `POST` with `{ "data": { ... } }`;
- update: `PUT` with `{ "data": { ... }, "version": n }`;
- action: the typed action route with current version and confirmation evidence where required;
- delete: an explicit authorized route with retention and cascade rules.

Do not add a Copilot-specific database. The Copilot and EAI application channels must read and update the same ResourceAPI records through the same PublicAPI command.

### 6. Microsoft 365 And Graph Data

There are two distinct data directions:

1. **EAI data into Copilot:** The plugin calls PublicAPI and receives a bounded result, source references and an EAI deep link. EAI data is not copied into Microsoft Graph by default.
2. **Microsoft data into an EAI task:** AzureAPI retrieves an approved SharePoint, Teams, Outlook or OneDrive item through a separately consented delegated Microsoft Graph flow. PublicAPI remains the orchestrator and Authz still controls the EAI action.

An EAI External ID token does not automatically grant Graph access to a customer's Microsoft tenant. Graph access requires customer-admin consent, suitable delegated scopes, user authorization and a separate token exchange or connection. Service credentials are used only for approved background jobs and never to impersonate a user.

### 7. AI, Content Understanding And Prompts

AICore owns model routing, RAG, evaluations and multi-step AI work. EAI tenant and workflow prompts remain the source of truth. Microsoft agent instructions describe the channel and when to call tools; they must not duplicate business policy.

Document work follows this sequence:

1. user selects a document and consents to send it to EAI;
2. PublicAPI validates identity, tenant, file policy and analyzer permission;
3. EAI claims the document into tenant-owned storage and returns an opaque job ID;
4. AICore runs the approved Content Understanding analyzer;
5. ResourceAPI stores typed fields, confidence, grounding and review status;
6. Copilot receives a bounded result and EAI review link;
7. any follow-up mutation is a separate authorized and confirmed call.

Provider credentials, SAS URLs, raw operation URLs and unrestricted analyzer administration are never returned to Copilot.

### 8. Read And Mutation Patterns

#### Read

1. Copilot calls a task tool with the user token and app context.
2. PublicAPI resolves tenant membership and Authz decision.
3. ResourceAPI returns only authorized records.
4. PublicAPI limits and redacts the response to no more than 25 items and supplies a deep link or a separate bounded query for more. Microsoft currently documents a 25-item plugin response limit and recommends avoiding large or paginated result journeys. [Microsoft declarative agent architecture](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-architecture)

#### Create

1. Copilot shows the proposed record and asks for confirmation when the tool is material.
2. PublicAPI validates the signed-in user, tenant, app and idempotency key.
3. PublicAPI calls strict V4 create with a `data` envelope.
4. The result returns record ID, version, correlation ID and an audit receipt.

#### Update Or Action

1. The tool reads the current record and version.
2. Copilot shows the proposed change and obtains confirmation.
3. PublicAPI reauthorizes at execution time.
4. The action or strict V4 `PUT` uses the current version.
5. A stale version returns a safe conflict response and requires refresh and reconfirmation. It must not silently overwrite.

#### Long-Running Job

1. The start tool validates and queues the work.
2. It returns an opaque job ID, not provider internals.
3. A status tool returns queued, processing, review-required, completed or failed.
4. A result tool returns bounded output or an EAI deep link.

## Platform Records

| Record | Purpose | Sensitive content rule |
| --- | --- | --- |
| `copilot-agent-definition` | Versioned agent, plugin, tool and instruction package | No secrets or tokens |
| `copilot-agent-installation` | Maps Microsoft organization and package installation to an EAI tenant and app installation | Store immutable IDs, not display names as identity |
| `external-identity-link` | Maps issuer plus subject to an EAI user | Email is descriptive only |
| `agent-tool-grant` | Allowlisted tools, roles, risk and confirmation policy | Default deny |
| `agent-action-receipt` | Request, idempotency, version, confirmation and outcome evidence | Redact payloads by classification |
| `agent-conversation-link` | Optional opaque link between a Microsoft session and EAI work item | Do not retain full chat by default |
| Existing app object types | Customer cases, documents, workflows and other business records | Tenant and app scoped in ResourceAPI |

Tokens, refresh tokens, customer secrets and raw prompts are not business records and must not be stored in ResourceAPI.

## Installation Lifecycle

### Publish

1. The developer declares app key, object types, workflows, Copilot tools, permissions and risk in the EAI app manifest.
2. CI validates tool schemas, strict V4 mutations, authorization coverage, response limits and documentation.
3. EAI publishes an immutable app version and generates the Microsoft agent package and OpenAPI contract from the same source.

### Install

1. An EAI tenant admin installs the app into one EAI tenant.
2. EAI provisions app-owned schemas, workflows and tool grants.
3. A Microsoft admin approves the agent package and OAuth/Graph consent for the selected Microsoft organization.
4. EAI records the installation mapping without granting membership automatically.
5. A pilot user signs in and completes an end-to-end entitlement check.

### Operate

- Tool definitions and prompts are immutable and versioned per release.
- Usage, AI cost, Microsoft credit consumption and EAI service cost are reported separately.
- Customer admins can disable one tool, the Copilot channel or the whole installation.

### Remove

- Revoking a user or tenant membership blocks future calls immediately.
- Removing the Microsoft agent stops the channel but does not silently delete EAI business data.
- EAI app deletion uses an explicit reviewed cascade for app-owned records, files, indexes, workflows and installation metadata while preserving shared tenant resources.

## Security Invariants

1. PublicAPI V4 is the only external EAI tool ingress.
2. Authz independently authorizes every read, write and action.
3. The server derives effective tenant membership; client headers are not authority.
4. Every record is tenant and app scoped.
5. No downstream EAI service or database is exposed to Copilot.
6. Mutations are allowlisted, version-aware, retry-safe and audited.
7. High-risk and destructive changes require explicit confirmation and may require a second approver.
8. Graph permissions are separate from EAI permissions and use least privilege.
9. External ID expands authenticated audiences but does not provide Copilot licensing.
10. The non-Copilot EAI channel provides equivalent governed access where licensing or audience rules prevent Copilot use.

## Failure Behavior

| Failure | User response | Platform behavior |
| --- | --- | --- |
| No EAI membership | Explain that access is not granted and link to access request | No data lookup occurs |
| Several EAI tenants | Ask the user to choose an authorized tenant | Never infer from email domain alone |
| Revoked access | Explain that access changed | Deny immediately and audit |
| Stale record version | Ask the user to refresh and reconfirm | Return conflict; never overwrite |
| Duplicate retry | Return the first receipt | Idempotency prevents duplicate action |
| Graph consent missing | Explain which Microsoft permission is needed | Do not fall back to broad app credentials |
| AI result uncertain | Show confidence and request human review | Store review-required status |
| Oversized result | Summarize and provide pagination or deep link | Do not send bulk tenant data to the model |
| Downstream unavailable | Return a safe retryable error and correlation ID | No partial mutation without a receipt |

## Validation Architecture

The solution is not complete until the same release passes:

- PublicAPI contract tests for every generated tool and strict V4 mutation shape;
- Authz tests for allowed, denied, cross-tenant, revoked and multi-membership users;
- ResourceAPI tests for tenant/app isolation, optimistic versioning, files and deletion;
- identity tests for EAI workforce and External ID/federated customer users;
- Microsoft package and OpenAPI validation;
- passive-install create, update, action and read regression tests;
- end-to-end tests proving the same user gets the same result in Copilot and the EAI app;
- confirmation, stale-version, duplicate-retry and audit-receipt tests;
- Graph consent-denied and least-privilege tests where Microsoft content is used;
- deployed non-production canaries using real identity, tenant and storage boundaries.

## Delivery Roadmap

### Phase 1: Prove One Connection

- One tenant, one app and one Microsoft organization.
- One External ID user and one workforce user.
- No more than five task tools.
- One bounded read, one confirmed create/update and one document-analysis job.
- Same capability through Copilot and the EAI app.

### Phase 2: Productize Installation

- Generate agent packages from the EAI app manifest.
- Add tenant-admin install, disable, upgrade and remove workflows.
- Add Graph delegated connections and customer-admin consent where required.
- Add usage, audit and commercial reporting.

### Phase 3: Expand Tooling

- Add a standards-compliant EAI MCP facade only when dynamic discovery is justified.
- Use Foundry Toolbox inside AICore where several EAI agents need the same governed tools.
- Add EAI-owned multi-step agents only for journeys that require centralized orchestration.

## Decisions Required Before Build

1. Select the first customer, EAI tenant and Microsoft organization.
2. Select one P1 use case from the companion catalogue.
3. Confirm whether the pilot user is workforce, federated external, or both.
4. Approve the first five tools and the one permitted mutation.
5. Confirm whether any Microsoft Graph content is required in phase 1.
6. Approve data classification, retention, audit and human-confirmation rules.
7. Confirm Microsoft Copilot licensing and deployment route for the pilot users.

## Source Basis

- [Microsoft 365 Copilot extensibility overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview)
- [Microsoft 365 Copilot plugins](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-plugins)
- [Microsoft declarative agent architecture](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-architecture)
- [Microsoft plugin authentication](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-authentication)
- [Microsoft declarative agent architecture](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-architecture)
- [Microsoft External ID for customers](https://learn.microsoft.com/en-us/entra/external-id/customers/)
- [Microsoft Foundry Agent Service tools](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/toolbox)

The EAI-specific design is also grounded in the current PublicAPI token validation and OBO services, strict V4 resource routes, generated-app runtime facade, app-template External ID/BFF pattern, Authz boundary and ResourceAPI passive-install model in this workspace.
