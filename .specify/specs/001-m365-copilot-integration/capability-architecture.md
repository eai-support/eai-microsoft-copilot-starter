# Microsoft Copilot Capability Architecture

## Recommendation

Use Microsoft 365 Copilot as the user channel and a declarative EAI agent as the first integration. Give that agent a small, versioned set of PublicAPI V4 tools. Keep Content Understanding, tenant prompts, AI profiles, workflow rules, authorization, and audit under EAI control.

Do not connect Copilot directly to AICore, ResourceAPI, Content Understanding, or the Foundry project. Those are implementation services and administration planes, not customer-facing security boundaries.

```text
Microsoft 365 Copilot / Teams
        |
        | EAI declarative agent
        | short channel instructions
        | API plugin first; MCP plugin later if justified
        | per-user OAuth token
        v
Regional PublicAPI V4
        |
        +--> Authz: tenant, resource, and action decision
        +--> AICore: prompts, models, Content Understanding, retrieval, tools
        +--> ResourceAPI: tenant data and configuration
        +--> AzureAPI: Microsoft Graph and Entra integration
        +--> Audit and usage evidence
```

Microsoft supports both OpenAPI and MCP plugins for declarative agents. Plugins can read and mutate external systems, but are only available as actions inside a declarative agent. Microsoft also warns that large tool sets and large payloads reduce quality, which reinforces the need for a small EAI contract rather than exposing the complete PublicAPI schema. [Microsoft 365 Copilot plugins](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-plugins)

## Configuration Ownership

| Configuration | Authoritative owner | Copilot receives | Reason |
| --- | --- | --- | --- |
| Agent name, purpose, channel instructions, conversation starters | Microsoft agent package | Full channel configuration | This controls how the EAI agent appears and when it offers tools. |
| Tool names, descriptions, input/output schemas, confirmation metadata | EAI-owned plugin contract generated from PublicAPI models | Only approved tools | Prevents accidental exposure of unrelated V4 routes. |
| User identity and token acquisition | EAI External ID plus Microsoft token-store configuration | EAI-audience user token | PublicAPI can apply existing membership and Authz controls. |
| Tenant and workflow prompts | PublicAPI/ResourceAPI `shared-chatbot-config` | No copied prompt; only result of governed execution | Avoids prompt drift between EAI and Microsoft. |
| Model, temperature, and token profile | PublicAPI/ResourceAPI `shared-ai-profile` and AICore | No direct model choice in the normal agent | Keeps cost, safety, and model policy centralized. |
| Content Understanding analyzer schema and lifecycle | PublicAPI V4/AICore, provisioned through EAI administration | Task-level analyze tools only | Analyzer mutation is a privileged control-plane operation. |
| Foundry connection, model deployment, search, and storage settings | Infra2025 and AICore | Nothing directly | These are service configuration, not end-user agent settings. |
| MCP server endpoints and tool risk | EAI integration registry; later optionally Foundry Toolbox | Approved tool subset | Unknown tools must not become implicitly safe. |
| Authorization, confirmation, idempotency, and audit | PublicAPI/Authz and owning services | Clear tool response and receipt | Prompt instructions are not an authorization control. |

## Content Understanding

### What EAI Already Has

PublicAPI already provides V4 document and Content Understanding capabilities, including:

- document upload, classification, classification by URL, job status, and result-file retrieval;
- tenant analyzer upsert and inspection paths;
- classifier publishing, lifecycle, inheritance, binding, and guarded deletion;
- tenant consistency checks and downstream AICore orchestration.

The main routes are in `mid/PublicAPI/src/app/routers/v4/data_documents.py` and `mid/PublicAPI/src/app/routers/v4/standalone_sources/documents.py`. AICore owns the provider client and reads the Content Understanding endpoint, GA API version, model, and deployment configuration in `mid/AICore/src/core/dependencies.py`.

Azure Content Understanding is well suited to agent workflows because it returns strongly typed extracted fields, grounding, and confidence data that can be routed to human review. It can extract, classify, or generate fields from documents while preserving structure for RAG. [Content Understanding document overview](https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/document/overview)

### Copilot Tool Shape

The initial Copilot agent should receive business-task tools, not analyzer administration tools:

| Tool | Behavior | Risk |
| --- | --- | --- |
| `submit_document_for_analysis` | Claims or uploads a document into an EAI-owned tenant scope and starts the approved analyzer. Returns an opaque job ID. | Data write, confirmation and file policy required. |
| `get_document_analysis_status` | Returns queued, processing, review-required, completed, or failed. | Read-only. |
| `get_document_analysis_result` | Returns bounded structured fields, confidence, citations, and review links. | Read-only but potentially sensitive. |
| `create_follow_up_from_analysis` | Creates a draft EAI action from approved fields after user confirmation. | Mutation, version-aware and idempotent. |

Do not expose analyzer upsert, publish, enable, disable, or delete to a general customer Copilot agent. Those operations should remain in EAI administration workflows and require the existing tenant and ownership policies.

### Document Sequence

1. The user provides or selects a document in Microsoft 365 Copilot.
2. The agent asks permission to send the document or approved reference to EAI.
3. PublicAPI validates the user and tenant, claims the file into EAI-owned storage, selects an approved analyzer, and returns a job ID.
4. AICore runs Content Understanding asynchronously and EAI persists the governed result.
5. Copilot polls the job tool and receives only bounded fields, confidence, source references, and a review link.
6. Any downstream mutation is a separate confirmed tool call and is authorized again.

SAS URLs, provider operation URLs, analyzer credentials, and raw provider payloads must not be returned to Copilot.

## Foundry Agents And Tools

### Current EAI Position

AICore already uses `AIProjectClient` to resolve Foundry project connections for Azure OpenAI, Azure AI Search, and storage. The current source does not implement persisted Foundry prompt agents, hosted agents, agent applications, or Foundry Toolboxes. Adding those would be a new orchestration capability, not a configuration switch.

Foundry Agent Service now supports prompt agents, hosted agents, reusable Toolboxes, tracing, evaluations, versioning, and stable published endpoints. A Toolbox exposes a governed, versioned tool collection through one MCP-compatible endpoint. [Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

### Recommended Use

- **Phase 1:** Do not add a second agent runtime. Let the Microsoft declarative agent call narrow PublicAPI V4 tools. Existing PublicAPI and AICore workflows continue to execute the business behavior.
- **Phase 2:** Use a Foundry Toolbox inside AICore if several EAI agents need the same approved tools, authentication, versioning, tracing, and promotion process.
- **Phase 3:** Use a Foundry prompt or hosted agent only when a journey needs EAI-owned multi-step orchestration, model choice, memory, or cross-tool reasoning that Microsoft orchestration cannot reliably provide.

Even with Foundry, PublicAPI/Authz remains the business authorization boundary. Foundry approval metadata is useful UX metadata, but Microsoft documents that the agent runtime, not the Toolbox endpoint, enforces the approval prompt. EAI must still reject unauthorized or stale mutations at the API. [Foundry Toolbox approvals](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/toolbox)

Do not expose the Foundry management MCP server to customer Copilot. It is an administration surface for Foundry resources, not an EAI business capability.

## MCP Design

### Two Different MCP Directions

EAI currently has an outbound MCP executor in `mid/AICore/src/services/mcp_executor.py`. It calls simplified `/tools/list` and `/tools/call` endpoints so AICore can use external integrations. It is not a standards-compliant remote MCP ingress for Microsoft Copilot.

The current executor also marks every discovered tool as `read_only`. That is unsafe for dynamic or third-party MCP catalogs and must be corrected before those tools can participate in autonomous or mutating workflows.

| Direction | Purpose | Status | Decision |
| --- | --- | --- | --- |
| AICore to external MCP servers | Let EAI workflows call external capabilities | Exists, but risk metadata needs strengthening | Keep internal; default-deny unknown tools and require configured risk/approval. |
| Microsoft Copilot to EAI MCP server | Let Copilot discover and call EAI business tools | Does not exist | API plugin first; build only after the tool contract stabilizes. |
| AICore to Foundry Toolbox | Share governed tools across EAI agents | Does not exist | Phase 2 option. |

If an EAI remote MCP server is later built, it should:

- implement standard Streamable HTTP MCP at a versioned HTTPS endpoint;
- use per-user OAuth or Entra SSO and map every call to an EAI identity and tenant;
- expose an allowlisted, pinned tool set by default rather than unrestricted dynamic discovery;
- describe read, write, destructive, and idempotency behavior correctly;
- translate tools to typed PublicAPI V4 calls rather than call downstream services;
- require approval for writes and destructive actions while independently enforcing Authz;
- bound response size and return source links or opaque result IDs for large content;
- log correlation, user, tenant, tool version, arguments classification, result, and cost without logging secrets.

Microsoft recommends allowlisting MCP tools and requiring approval for high-risk operations. [Foundry MCP guidance](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol)

## Prompt Architecture

Use four prompt layers with one owner per layer:

| Layer | Purpose | Owner |
| --- | --- | --- |
| Microsoft agent instructions | Channel purpose, boundaries, tool-selection guidance, confirmation language, and handoff behavior | Microsoft agent package |
| EAI tenant/workflow prompts | Domain policy and instructions at tenant, workflow, stage, and step level | ResourceAPI/PublicAPI |
| AICore orchestration prompts | Internal reasoning, transformation, and tool sequencing | AICore, versioned and evaluated |
| Content Understanding field definitions | Typed extraction, classification, generation, confidence, and grounding rules | EAI analyzer configuration |

PublicAPI already selects `shared-chatbot-config` by workflow step, stage, workflow, then tenant base, and resolves `shared-ai-profile`. That is the correct source of truth for domain behavior. Copilot should pass the user's request and bounded context, not replace the EAI system prompt.

Copilot Studio can create reusable prompt tools with text, image, document, and dynamic inputs. Those are useful for Microsoft-only formatting or channel tasks, but duplicating EAI domain prompts there would create two release and governance paths. [Copilot Studio prompts](https://learn.microsoft.com/en-us/microsoft-copilot-studio/create-custom-prompt)

## Delivery Options

| Option | Use when | Benefits | Limits | Recommendation |
| --- | --- | --- | --- | --- |
| Declarative agent plus OpenAPI plugin | Initial bounded EAI journeys | Simple, contract-testable, fixed tools, aligns with existing PublicAPI | Agent package must be updated as tools change | **Start here.** |
| Declarative agent plus EAI MCP plugin | Tool catalog changes frequently or rich MCP UI is needed | Dynamic discovery, MCP apps, broader host compatibility | New ingress service, more governance, tool drift risk | Phase 2 after API contract proves value. |
| Foundry prompt agent published to Microsoft 365 | EAI needs its own managed orchestration and tools | Versioning, evaluation, tracing, stable endpoint | Adds another agent runtime and cost | Use-case driven, not pilot default. |
| Foundry hosted agent | Complex custom orchestration, protocols, or multi-agent logic | Full code control with managed hosting | Highest operational and compute burden | Later only where justified. |
| Copilot Studio prompt/action flow | Customer-specific low-code workflow | Fast business prototyping and Microsoft governance | Prompt and environment drift from EAI | Use for channel-specific composition, not EAI core policy. |

## Phased Plan

### Phase 1: One Governed Journey

- Package a declarative EAI agent for a customer organizational catalog.
- Generate a Copilot-specific OpenAPI/plugin contract with no more than five focused tools.
- Reuse PublicAPI V4 document classification and workflow routes.
- Implement EAI OAuth/federation, tenant selection, audit correlation, bounded responses, and confirmation receipts.
- Add owning-repo contract tests plus a deployed user/tenant/action canary.

Suggested journey: analyze a customer document, return grounded structured fields, identify review-required values, and create one draft follow-up only after confirmation.

### Phase 2: Shared Tool Governance

- Correct AICore MCP risk discovery and add default-deny policy.
- Evaluate Foundry Toolbox for internal shared tools and version promotion.
- Build a standards-compliant EAI MCP facade only if dynamic discovery or MCP Apps produces material value.
- Add prompt and tool evaluation sets across the EAI app and Copilot channel.

### Phase 3: EAI-Owned Agent Runtime

- Introduce a Foundry prompt or hosted agent for journeys that require EAI-controlled orchestration.
- Publish immutable agent/tool/prompt versions through CI and capture traces and evaluations.
- Keep the Microsoft declarative agent as the channel and PublicAPI as the external business boundary.

## Acceptance Evidence

- The same user receives the same tenant-scoped result in the EAI app and Copilot.
- Revoking EAI membership immediately blocks the Copilot tool call.
- Microsoft agent instructions, EAI prompts, analyzer versions, and tool versions are independently identifiable in audit evidence.
- A document remains EAI-owned; Copilot receives only approved outputs and references.
- Every mutation requires confirmation, uses a strict V4 body and method, handles stale versions, and produces an idempotent receipt.
- Unknown or incorrectly classified MCP tools cannot execute.
- Tool, model, Content Understanding, Microsoft credit, and EAI usage costs can be reported separately.

## Decision Needed

Confirm whether the first pilot should use the document journey above. If yes, the next specification should select one tenant, one analyzer/classifier, the exact output fields, one draft mutation, and the Microsoft 365 pilot user group.
