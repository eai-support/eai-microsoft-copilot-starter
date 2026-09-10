---
feature: microsoft-365-copilot-integration
created: 2026-09-02T01:15:24Z
workflowProfile: enterpriseai
---

# Reuse-Before-Create Scan

## Scan Results

| Asset | Evidence | Decision |
| --- | --- | --- |
| PublicAPI regional gateway | `mid/PublicAPI/AGENTS.md`; V4 routers and Entra middleware | Reuse as the only external EAI tool boundary. |
| PublicAPI Entra validation | `mid/PublicAPI/src/app/services/entra_auth_service.py` | Extend only through an approved identity design; current trust is limited to configured EAI B2B and External ID tenants. |
| PublicAPI OBO patterns | Existing token exchange services and tests | Reuse for downstream EAI service calls, not as permission to trust arbitrary customer tokens. |
| Authz policies | `mid/Authz/policies` and SpiceDB schema | Reuse as the authoritative resource/action decision point. |
| AzureAPI Graph client | `mid/AzureAPI/src/app/services/entra_service.py` | Extend for customer Microsoft Graph/connector lifecycle behind PublicAPI. Existing code is not a complete customer multi-tenant connector. |
| AICore provider and MCP routing | `mid/AICore/AGENTS.md`, `src/services/mcp_executor.py` | Reuse for EAI-owned reasoning and integrations; do not make it the Copilot ingress. |
| PublicAPI V4 Content Understanding | `mid/PublicAPI/src/app/routers/v4/data_documents.py`, `standalone_sources/documents.py` | Reuse document classification, jobs, classifier lifecycle, and bounded results. Expose only task-level operations in the Copilot plugin. |
| AICore Content Understanding client | `mid/AICore/src/services/content_understanding/client.py`, `src/core/dependencies.py` | Reuse provider integration and managed configuration behind PublicAPI. Do not expose analyzer credentials or provider URLs. |
| Tenant/workflow prompt configuration | `mid/PublicAPI/src/app/services/chat_service.py` | Keep as the domain prompt source of truth; do not copy prompts into Copilot Studio. |
| Foundry project connections | `mid/AICore/src/core/dependencies.py` | Reuse model, search, and storage connection discovery. This is not evidence that Foundry Agent Service or Toolboxes are implemented. |
| EAI app BFF auth | `front/eai-app-template/src/auth.ts`, `/src/app/api/eai` | Preserve for EAI app use; access tokens remain server-side. |
| Microsoft agent package | No existing EAI implementation found | Create after architecture approval, preferably from Microsoft 365 Agents Toolkit or Copilot Studio export. |
| Copilot tool contract | No dedicated plugin contract found | Generate a narrow OpenAPI/plugin document from approved existing or new PublicAPI V4 task routes. Do not expose the full API. |
| Copilot-facing MCP server | No standards-compliant inbound MCP service found | Defer until a fixed API-plugin pilot proves a need for dynamic tools or MCP Apps. |
| Foundry agents and Toolboxes | No persisted agent, Agent Application, or Toolbox implementation found | Treat as new optional architecture for later EAI-owned orchestration and shared tool governance. |

## Create-New Exceptions Required

The Microsoft agent package, identity consent lifecycle, and Copilot-specific tool contract are genuinely new. A standards-compliant inbound MCP service and Foundry Agent/Toolbox lifecycle would also be new if selected. They require architecture and security approval because they introduce a new external execution channel, new tool governance, and customer Microsoft tenant administration.
