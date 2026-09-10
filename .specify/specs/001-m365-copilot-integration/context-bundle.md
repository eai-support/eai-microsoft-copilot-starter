---
feature: microsoft-365-copilot-integration
created: 2026-09-02T01:15:24Z
audience: downstream-agents
workflowProfile: enterpriseai
---

# Context Bundle

## Compact Summary

EAI is evaluating Microsoft 365 Copilot as a customer channel and Microsoft co-sell opportunity. The design is now a reusable EAI Connection for Microsoft Copilot: Microsoft 365 Copilot/Teams in front, EAI External ID for employee and external identity, a narrow task-tool contract, and PublicAPI V4 as the non-bypassable EAI control boundary. Authz remains authoritative, ResourceAPI stores tenant/app-owned data, AzureAPI owns separately consented Microsoft Graph/Entra integration, and AICore remains EAI's AI orchestration layer.

Capability research confirms that PublicAPI already has V4 Content Understanding and strict resource routes and that EAI already owns hierarchical domain prompts and AI profiles. Start with an OpenAPI plugin over task-level PublicAPI operations. Do not expose analyzer administration, AICore's outbound MCP executor, downstream services, or Foundry administration to Copilot. The design has been tested against 100 ranked use cases and all fit six common connection patterns.

## Selected Scenario

| Item | Detail |
| --- | --- |
| Business outcome | Let Microsoft 365 customers use governed EAI capabilities in their normal work tools. |
| Primary users | Customer knowledge workers and operational users with EAI access. |
| Value metric | Pilot task completion, active users, safe tool calls, and cost per completed journey. |
| EnterpriseAI app | Existing EAI applications plus a new Microsoft 365 agent channel. |
| App classification | Architecture/product research; application delivery begins after pilot selection. |
| Pipeline mode | Shared non-app research stages. |

## Carry-Forward Decisions

- Copilot is a channel, not a replacement for PublicAPI, Authz, or AICore.
- Do not expose downstream EAI services or the full PublicAPI OpenAPI surface directly.
- Prefer user OAuth into EAI External ID; do not accept arbitrary customer Entra issuers without a separate security design.
- Default to live EAI retrieval; synced Microsoft Graph indexing requires explicit approval.
- Keep preview Microsoft capabilities out of the mandatory production path.
- Keep Microsoft agent instructions short and channel-specific; domain prompts remain in EAI.
- Use existing PublicAPI V4 document analysis for the candidate pilot, with bounded asynchronous tool responses.
- Defer Foundry Agent Service, Foundry Toolbox, and inbound EAI MCP until a use case justifies another runtime or dynamic tool catalog.
- Correct AICore MCP risk classification before using dynamically discovered tools in mutating workflows.
- Treat EAI External ID and Microsoft Copilot entitlement as separate controls.
- Map external users by issuer plus subject, then resolve current EAI membership and tenant hierarchy.
- Store business records once in ResourceAPI and expose the same command through Copilot and EAI application channels.
- Use strict V4 `POST {data}` and `PUT {data, version}` contracts with confirmation, idempotency and audit receipts.

## Next Agent Instructions

- Read `copilot-eai-reference-architecture.md` and `copilot-eai-100-use-cases.md` first, then use `research.md`, `capability-architecture.md`, `business-value-priorities.md`, `assumptions.md`, and `reuse-scan.md` for supporting evidence.
- Stop before implementation until the business owner selects the first journey, customer, Microsoft organization and data posture.
- Preserve strict PublicAPI V4 contracts; use a narrow adapter if Microsoft tool schemas require a simpler shape.
