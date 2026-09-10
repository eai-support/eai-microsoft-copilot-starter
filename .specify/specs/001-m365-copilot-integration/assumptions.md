# Assumptions And Decisions

| ID | Assumption or decision | Status | Revalidate when |
| --- | --- | --- | --- |
| A1 | “Microsoft Copilot” means Microsoft 365 Copilot and Copilot Chat, not GitHub Copilot. | Assumed | Business owner corrects scope |
| A2 | The commercial objective is to complement Microsoft 365 Copilot licences with EAI workflows, not replace EAI's existing AI stack. | Assumed | Commercial model is reviewed |
| A3 | Customer users must retain their EAI tenant permissions when working from Copilot. | Required | Never relax without security approval |
| A4 | The initial pilot should avoid copying EAI data into Microsoft Graph unless the selected use case needs broad Microsoft 365 search. | Proposed | Pilot journey is selected |
| A5 | EAI's tenant prompts, AI profiles, analyzer definitions, and workflow configuration remain authoritative; Microsoft configuration is limited to channel behavior and approved tool metadata. | Proposed | Architecture review |
| A6 | Existing PublicAPI V4 Content Understanding routes are sufficient foundations for a document-analysis pilot, but a smaller Copilot plugin contract and bounded response models are still required. | Evidence-backed | Detailed route specification |
| A7 | EAI External ID can federate customer organizational Entra identities, but EAI authentication does not grant Microsoft 365 Copilot entitlement or Microsoft Graph permission. | Evidence-backed | Microsoft identity or licensing changes |
| A8 | One reusable Copilot connection can support the 100 catalogued use cases through configurable task tools and app-owned schemas. | Design-validated | Pilot implementation evidence |
| A9 | Copilot and non-Copilot EAI channels must operate on the same PublicAPI commands, Authz decisions and ResourceAPI records. | Required | Never relax without architecture approval |
| A10 | Email is not a durable identity key; external users map by token issuer plus immutable subject. | Required | Never relax without security approval |
| A11 | `eai-support/eai-app-template` is the public GitHub template and is the correct source for a starter repository. | Evidence-backed | Repository ownership or release model changes |
| A12 | A template-derived repository is preferable to a permanent fork because the starter has a distinct purpose, Microsoft package and release lifecycle. | Proposed | Architecture review |
| D1 | Select the first journey: knowledge retrieval, governed action, or both. | Open | Before specification |
| D2 | Select distribution: customer-specific organizational catalog or commercial marketplace package. | Open | Before implementation planning |
| D3 | Confirm whether customers use EAI External ID federation or require a new multi-tenant Entra consent model. | Open | Before identity design |
| D4 | Confirm whether the offer must work for unlicensed Copilot Chat users through pay-as-you-go. | Open | Before commercial packaging |
| D5 | Use a fixed OpenAPI plugin for phase one rather than build a Copilot-facing MCP server. | Proposed | Pilot architecture approval |
| D6 | Do not add Foundry Agent Service in phase one; add it only when EAI-owned multi-step orchestration has a demonstrated requirement. | Proposed | Journey complexity review |
| D7 | Confirm whether the first pilot is document analysis: submit, classify/extract, review grounded fields, then create one confirmed draft follow-up. | Open | Before detailed specification |
| D8 | Select one of the three recommended pilots: supplier onboarding, customer case self-service, or contract obligation assistant. | Open | Before implementation planning |
| D9 | Confirm the pilot Microsoft organization and its admin owner for agent deployment and OAuth/Graph consent. | Open | Before implementation |
| D10 | Confirm whether phase one requires Microsoft Graph content. Default is no. | Open | Before tool contract approval |
| D11 | Approve the first five task tools and exactly one permitted confirmed mutation. | Open | Before implementation |
| D12 | Approve `eai-support/eai-microsoft-copilot-starter` and the Customer Case Assistant demonstration. | Open | Before repository creation |

## Assumption Drift Control

| Assumption ID | Expires | Reopen stage | Trigger |
| --- | --- | --- | --- |
| A1-A2 | 2026-10-02 | `1_gofer_research` | Copilot product or commercial scope changes |
| A3-A5 | 2026-12-01 | `2_gofer_specify` | EAI security or ownership boundary changes |
| A6-A10 | 2026-10-02 | `1_gofer_research` | Microsoft identity, licensing or API behavior changes |
| A11-A12 | 2026-12-01 | `3_gofer_plan` | Template ownership or starter release model changes |
