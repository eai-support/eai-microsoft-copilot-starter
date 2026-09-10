---
feature: microsoft-365-copilot-integration
created: 2026-09-02T01:15:24Z
updated: 2026-09-02T01:15:24Z
audience: business-owner
---

# Business Owner Summary

The detailed, priority-ordered value case is in `business-value-priorities.md`.

## Executive Summary

- EAI can support Microsoft's Copilot licence strategy by making EAI available as an approved agent inside Microsoft 365 Copilot and Teams.
- The safest and clearest product keeps EAI permissions, tenant controls, and audit behind PublicAPI rather than rebuilding them in Microsoft.
- Start with one customer-specific pilot using live EAI data; defer Microsoft indexing and app embedding until there is a proven need.
- EAI already has governed document analysis, tenant prompts, and AI profiles. The first pilot can reuse them rather than recreate them in Copilot Studio.
- EAI External ID allows customers and partners outside the enterprise workforce tenant to authenticate securely, while EAI membership and Authz preserve tenant isolation. This does not provide a Microsoft 365 Copilot licence.
- The design supports 100 ranked use cases through one reusable connection and six common patterns rather than 100 separate integrations.
- Use an OpenAPI plugin first. Foundry agents, Toolboxes, and an EAI MCP server are valuable later options, not prerequisites.
- A decision is needed on the first workflow, target users, identity model, and commercial licence scope.
- The proposition is not “EAI instead of Microsoft.” Microsoft supplies the workplace, data, analytics, identity, and AI foundations; EAI supplies the reusable business operating layer that connects them to controlled outcomes.

## Option Recommendation

| Priority | Option | Business reason |
| --- | --- | --- |
| 1 | EAI agent in Microsoft 365 Copilot and Teams | Best alignment to Microsoft licence adoption and familiar customer workflow. |
| 2 | Federated read-only EAI connector | Broad live discovery without copying data, but newer and requires Microsoft approval for gallery distribution. |
| 3 | EAI custom engine agent in Microsoft channels | Retains EAI AI differentiation for complex journeys, with additional hosting cost. |
| 4 | Microsoft Copilot inside the EAI app | Useful for selected Microsoft-work-context features, but not the clearest first licence-led offer. |
| 5 | Synced Microsoft Graph connector | Valuable for broad search only after data governance and lifecycle are approved. |

## Target Pilot Outcome

A small user group completes one useful EAI journey in Copilot with the same access results as the EAI application, one confirmation-gated action, immediate access removal when EAI membership is revoked, and clear cost/usage reporting.

The three strongest pilot candidates are supplier onboarding, customer case self-service, and contract obligation management. Supplier onboarding is the broadest proof because it combines external identity, documents, structured storage, workflow and approval.

## Decisions Needed

1. Which customer journey should be first: find and summarize EAI information, carry out an EAI workflow action, or both?
2. Which customer and user group should pilot it?
3. Should phase one be restricted to Microsoft 365 Copilot licensed users?
4. Must data remain live in EAI, or may selected content be indexed into the customer's Microsoft tenant?
5. Will users sign in through EAI External ID federation, or is a new multi-tenant consent model required?
6. Which five or fewer task tools and one confirmed mutation should the first pilot expose?
