---
feature: 001-m365-copilot-integration
created: 2026-09-11T00:00:00Z
audience: business-and-delivery
status: active
---

# Build Map: Microsoft Teams And Copilot Starter Kit

```mermaid
flowchart LR
    user["Customer or employee"] --> channels["Copilot, Teams or EAI web"]
    channels --> identity["EAI External ID and tenant access"]
    identity --> tools["Four approved case tools"]
    tools --> publicapi["PublicAPI V4 and Authz"]
    publicapi --> data["One ResourceAPI case record"]
    tools --> evidence["Confirmation and audit receipt"]
```

| Area | Status | Current work | Business impact |
| --- | --- | --- | --- |
| Customer journey | Ready | Customer Case Assistant selected | One simple story demonstrates the complete proposition |
| Web experience | Planned | Template-derived case dashboard | Non-Copilot users retain equivalent access |
| Teams and Copilot | Planned | Declarative agent and OpenAPI package | EAI work is available in Microsoft channels |
| Identity and tenant security | Ready boundary | Reuse External ID, PublicAPI and Authz | External users do not weaken tenant isolation |
| Data | Planned | Synthetic demo then dedicated DEV harness | No customer data is used for public demonstration |
| Validation | Planned | Contract, UI, package and live-state gates | Mock success cannot be presented as live proof |

## Latest Update

- **Working on**: repository foundation and contract-first tests
- **Why it matters**: the starter must demonstrate real EAI value without customer risk
- **Status**: planned and approved for implementation
- **Next**: create the repository and make the synthetic case journey work

