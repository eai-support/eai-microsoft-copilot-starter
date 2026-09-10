# Microsoft 365 Copilot Integration Research

## Executive Finding

The right answer is not “in front” or “behind” PublicAPI exclusively. The user experience belongs in front of EAI, inside Microsoft 365 Copilot and Teams. Every EAI read or action belongs behind PublicAPI so EAI keeps control of identity, tenant scope, authorization, audit, regional routing, and downstream orchestration.

Recommended first product: an **EAI agent for Microsoft 365 Copilot** with a narrow set of PublicAPI V4 tools. The user works in Copilot; the agent authenticates the user to EAI; PublicAPI and Authz decide what that user may see or do.

The capability-level design is documented in `capability-architecture.md`. It covers Content Understanding, Foundry agents and Toolboxes, inbound and outbound MCP, prompt ownership, existing EAI reuse, and a phased delivery plan.

## Capability Finding

EAI already has more of the required capability than a Microsoft-first design would suggest:

- PublicAPI V4 already exposes governed document classification, analyzer lifecycle, classifier publication, jobs, and bounded Content Understanding result retrieval.
- AICore already owns Content Understanding configuration and uses Foundry project connections for models, search, and storage.
- PublicAPI/ResourceAPI already provide tenant, workflow, stage, and step prompt selection plus AI profiles.
- AICore already calls external MCP-like integrations, but its protocol and risk classification are not suitable as a Copilot-facing MCP server.

The recommended first integration is therefore a declarative Microsoft 365 agent with a small OpenAPI plugin over existing PublicAPI V4 task routes. Foundry Agent Service, Foundry Toolbox, and a standards-compliant EAI MCP ingress remain later options for complex orchestration or shared tool governance; they are not prerequisites for the pilot.

## Microsoft Options

| Option | What it does | Commercial fit | EAI fit | Recommendation |
| --- | --- | --- | --- | --- |
| Declarative agent with API or MCP actions | Adds EAI knowledge and approved actions inside Microsoft 365 Copilot and Teams using Microsoft's orchestrator and models. | Strongest alignment to Microsoft 365 Copilot licence sales. | Good for focused EAI journeys with bounded tools. | **Pilot first.** |
| Custom engine agent | Uses EAI's own orchestration and models while publishing the experience into Microsoft channels. | Supports licensed and some consumption-based users, but EAI also carries hosting/model cost. | Strong fit when EAI's AICore reasoning, proactive workflows, or complex orchestration must remain authoritative. | Phase 2 or use-case driven. |
| Federated Copilot connector | Retrieves read-only EAI data live over MCP without indexing it into Microsoft 365. | Strong discovery story and lower data-copy risk, but partner gallery submission and newer platform maturity apply. | Good long-term read-only EAI knowledge channel. | Evaluate after the agent pilot. |
| Synced Copilot connector | Copies selected EAI content and ACLs into Microsoft Graph for Copilot and Microsoft Search. | Broad Microsoft 365 discovery value. | Useful only when search across EAI and Microsoft content outweighs sync, retention, deletion, and ACL complexity. | Optional, not the default. |
| Copilot APIs in the EAI app | Brings Microsoft 365 retrieval or Copilot chat into an EAI-owned interface. | Uses Copilot value inside EAI, but does not primarily drive use inside Microsoft's products. | Potentially useful for Microsoft-work-context features. Chat and pay-as-you-go capabilities include preview constraints. | Separate later product, not the first integration. |
| Embedded Copilot Studio web channel | Places a Copilot Studio agent in an EAI web app. | Separate Copilot Studio/channel consumption model; does not by itself prove Microsoft 365 Copilot licence value. | Adds another chat surface and identity boundary to EAI. | Use only for a specific customer requirement. |

Microsoft officially distinguishes declarative agents, which use Microsoft's orchestrator and models, from custom engine agents, which bring custom orchestration and models. Agents can run in Copilot, Teams, Outlook, and other Microsoft 365 surfaces. [Microsoft agents overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agents-overview)

## Recommended Reference Architecture

```text
Microsoft 365 Copilot / Teams
        |
        | EAI agent + approved API/MCP tools
        | user OAuth, explicit action confirmation
        v
Regional EAI PublicAPI V4
        |
        +--> Authz / tenant membership / audit
        +--> AICore for EAI-owned reasoning and retrieval
        +--> AzureAPI for Microsoft Graph and Entra integration
        +--> ResourceAPI and other governed platform services

EAI application
        |
        | server-side BFF, same EAI identity and PublicAPI contracts
        v
Regional EAI PublicAPI V4
```

### Boundary Decisions

1. **Copilot is a channel, not EAI's security boundary.** Microsoft chooses when to invoke a tool, but PublicAPI and Authz independently validate the user, tenant, resource, and action.
2. **Do not expose ResourceAPI, AICore, AzureAPI, or Configurator directly.** Existing EAI architecture makes PublicAPI the regional orchestration boundary.
3. **Do not expose the full PublicAPI OpenAPI document as an AI toolset.** Publish a small Copilot-specific contract containing only approved operations. Microsoft's API plugin support currently has limitations including nested request bodies, so an adapter may be required without weakening the underlying V4 contracts. [Known extensibility issues](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/known-issues)
4. **Use per-user OAuth.** Microsoft supports OAuth for API and MCP plugins and can send credentials on behalf of the signed-in user. EAI should issue or accept an EAI-audience token and continue to apply its own membership and Authz checks. [Plugin authentication](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api-plugin-authentication)
5. **Prefer EAI External ID federation over accepting arbitrary customer-tenant tokens.** Current PublicAPI validation trusts the configured EAI B2B and External ID issuers and audiences only. Directly accepting every customer Entra issuer would materially expand the platform trust boundary.
6. **Keep app tokens server-side.** The EAI app template already uses a BFF pattern and does not expose its access token in the browser session. Copilot integration should preserve the same principle.

## Identity Gap To Resolve

PublicAPI currently validates tokens only from the configured EAI internal Entra tenant or EAI External ID tenant. A token issued directly by a customer's Microsoft 365 tenant will be rejected even if Microsoft Copilot obtained it correctly.

The preferred pilot flow is:

1. The customer installs the EAI agent through their Microsoft 365 organizational catalog.
2. The user signs in to EAI through OAuth Authorization Code with PKCE.
3. EAI External ID federates or links the customer's work identity to the EAI user and tenant membership.
4. The Microsoft token store supplies an EAI-audience access token to the tool.
5. PublicAPI validates that token and Authz evaluates every read or mutation.

This avoids broad multi-issuer acceptance in PublicAPI. Seamless SSO and cross-tenant identity mapping need a dedicated security design before implementation.

## Data Options

### Live EAI Data, No Microsoft Index

Use agent API/MCP actions against PublicAPI. Microsoft states that external workflow data used through agents remains in the external application rather than being copied into Microsoft Graph. This is the safest default for EAI operational and regulated data. [Microsoft data, privacy, and security guidance](https://learn.microsoft.com/en-my/microsoft-365-copilot/extensibility/data-privacy-security)

### Federated Read-Only Retrieval

Microsoft's federated connectors retrieve data in real time through MCP, use the user's identity and permissions, and do not index external data into Microsoft 365. Partner gallery connectors are read-only and require Microsoft approval. [Federated connector overview](https://learn.microsoft.com/en-us/microsoftsearch/federated-connectors-overview), [partner submission requirements](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/submit-federated-connector)

### Synced Microsoft Graph Index

Synced connectors index selected external content in Microsoft Graph. They require accurate ACLs, identity mapping, deletion propagation, retention decisions, monitoring, and customer-admin consent. Microsoft warns that incorrect connector permissions can overshare sensitive content. [Connector models](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-copilot-connector), [connector access controls](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/manage-access-permissions)

## Where Each EAI Component Fits

| EAI component | Responsibility |
| --- | --- |
| PublicAPI | External Copilot tool boundary; EAI token validation; tenant context; typed V4 routes; action confirmation metadata; audit correlation; orchestration. |
| Authz | User/resource/action authorization independent of Copilot's decision to call a tool. |
| AzureAPI | Microsoft Graph, Entra, connector provisioning, and customer Microsoft tenant integration behind PublicAPI. Existing Graph capability can be extended, but customer multi-tenant consent is new work. |
| AICore | EAI-owned reasoning, model routing, RAG, MCP/REST execution, and domain AI. It is not the entry point from Copilot. |
| ResourceAPI | Governed tenant data behind PublicAPI only. Never expose it directly to a Copilot agent or connector. |
| EAI app / BFF | Existing EAI user experience. It can link to or coexist with the Microsoft agent and may later consume Copilot APIs for a separately approved use case. |
| Infra2025 | Entra registrations, Azure configuration, secrets/references, consent automation, observability, and environment rollout. |
| eai-testing-dev | Deployed auth/tenant canaries and release evidence after the owning repos have contract tests. |

## Commercial And Licensing Implications

- Licensed Microsoft 365 Copilot users receive the fullest Microsoft 365 agent experience and can use Copilot APIs without additional Copilot API charges under Microsoft's current guidance.
- Eligible Microsoft 365 users can access Copilot Chat, while tenant-data grounding for users without a Copilot add-on can create Copilot Credit consumption.
- Declarative agents have no separate EAI hosting requirement for the Microsoft orchestrator, while custom engine agents retain EAI/Azure hosting and model costs.
- Customer admins control installation, approval, user/group availability, connectors, and agents. EAI cannot make a production agent available tenant-wide without customer administration.
- An ISV product can be packaged for Microsoft Commercial Marketplace, but an initial pilot should use a customer organizational catalog to reduce publication lead time.

Current licensing is described in Microsoft's [licensing and cost guidance](https://learn.microsoft.com/en-au/microsoft-365/copilot/extensibility/cost-considerations). It must be rechecked with Microsoft before a customer quote because licence names, entitlements, and Copilot Credit rates can change.

## Risks And Controls

| Risk | Control |
| --- | --- |
| Copilot invokes an unintended mutation | Expose only allowlisted tools; mark mutating actions clearly; require confirmation; reauthorize in PublicAPI/Authz; use idempotency and version checks. |
| Cross-tenant data leakage | EAI-audience user tokens, explicit EAI tenant context, Authz evaluation, tenant-bound resources, and cross-service tests. |
| Customer token trusted too broadly | Do not accept arbitrary Microsoft 365 tenant issuers; use EAI External ID federation or a separately reviewed multi-tenant identity design. |
| Sensitive data copied into Microsoft Graph | Default to live API retrieval; require a data classification and ACL/deletion design before synced connectors. |
| Plugin schema drifts from PublicAPI | Generate a narrow agent contract from owned source models; contract-test adapter and V4 route together; publish versioned tool manifests. |
| Preview feature dependency | Keep Chat API, Work IQ, federated connectors, and other preview capabilities out of mandatory production paths until separately approved. |
| Confusing customer cost | Quote Microsoft licence, Copilot Credits, EAI subscription, and EAI/Azure consumption as separate cost lines. |

## Pilot Recommendation

Choose one high-value, low-risk journey with two read tools and at most one reversible or confirmation-gated action. Example: “Find my active EAI business requests, summarize the evidence, and create a draft follow-up task after confirmation.”

Pilot gates:

1. Customer administrator approves the agent for a named user group.
2. Users authenticate to EAI and resolve to exactly one authorized EAI tenant context.
3. Reads return only resources the same user can access in the EAI app.
4. A mutation requires explicit user confirmation and produces an EAI audit record.
5. Removal of EAI membership immediately removes access through Copilot.
6. Cost and usage are measurable by licensed user, customer tenant, EAI tenant, and tool operation.

## Decision Required Before Specification

The business owner should select:

- the first customer journey;
- customer-specific catalog pilot or marketplace-first distribution;
- licensed-users-only or licensed plus pay-as-you-go users;
- live EAI retrieval only or permission to evaluate Microsoft indexing;
- the customer identity/federation model.
# Validation Refresh

The original Microsoft and EAI research remains current after live development validation on 2026-09-10 UTC.
