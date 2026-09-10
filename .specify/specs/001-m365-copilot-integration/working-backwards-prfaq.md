---
feature: microsoft-365-copilot-integration
created: 2026-09-02T01:15:24Z
updated: 2026-09-02T01:15:24Z
status: research-draft
stage: 1_gofer_research
primary_customer: Microsoft 365 enterprise customers using EAI
business_owner: pending
---

# Working Backwards PR/FAQ: EAI For Microsoft 365 Copilot

## Press Release

### Headline

EAI brings governed business knowledge and actions into Microsoft 365 Copilot.

### Subheadline

Customers can use approved EAI capabilities from Copilot and Teams while EAI retains tenant isolation, authorization, and audit control.

### Customer Problem

Customers increasingly work through Microsoft 365 Copilot, but their governed EAI data and workflows sit in a separate platform. A simple chatbot embed would fragment identity and permissions, while copying all EAI data into Microsoft 365 would create unnecessary governance and lifecycle risk.

### The Proposed Launch

A customer-approved EAI agent appears in Microsoft 365 Copilot and Teams. Users sign in to EAI, ask for approved EAI information, and carry out confirmation-gated actions. PublicAPI and Authz enforce the same access rules used by EAI applications.

### Customer Benefit

Customers gain a familiar Microsoft experience without creating a second EAI permission model or weakening platform controls. Microsoft gains a credible Copilot licence use case, and EAI gains an additional governed customer channel.

### How To Get Started

Select one pilot workflow, approve the EAI agent for a named customer user group, and validate read equivalence and one reversible action against the existing EAI app.

## External FAQ

### Is this Microsoft 365 Copilot or a separate EAI chatbot?

The initial offer is an EAI agent available inside Microsoft 365 Copilot and Teams. EAI continues to provide the governed data and workflow services behind it.

### Does EAI data move into Microsoft 365?

Not by default. The pilot retrieves data live from EAI. A synced Microsoft Graph connector is a separate option requiring customer approval, ACL mapping, retention, and deletion controls.

### Does every user need a Microsoft 365 Copilot licence?

The full experience aligns to licensed users. Microsoft also supports some Copilot Chat and pay-as-you-go scenarios, but the customer cost and capability differences must be confirmed before commercial quoting.

### Can Copilot change EAI data?

Only through explicitly published tools. PublicAPI and Authz recheck every request, and sensitive mutations require user confirmation and audit evidence.

### What is not included yet?

No customer tenant deployment, marketplace listing, synced connector, production identity consent, or broad EAI tool catalog has been approved or built.

## Internal FAQ

### Business Direction

- **Recommended product**: Microsoft 365 Copilot agent as a new EAI channel.
- **First release**: customer-specific organizational catalog pilot.
- **Commercial choice needed**: licensed users only versus licensed plus Copilot Credit consumption.

### Architecture

- **Ingress**: Microsoft 365 Copilot/Teams agent.
- **Control boundary**: regional PublicAPI V4.
- **Authorization**: EAI Authz and tenant membership on every tool call.
- **Microsoft integration**: AzureAPI behind PublicAPI.
- **EAI AI**: AICore when EAI orchestration or models are required.

### Risk

- Customer Microsoft identities cannot be trusted directly by current PublicAPI without an approved federation or multi-tenant identity design.
- Synced connectors can overshare data if ACLs or identity mapping are wrong.
- Several newer Microsoft capabilities have preview or changing commercial terms.

## Review Ask

Approve or revise the recommended direction, then select the first customer journey, data posture, and identity model so specification can begin.
