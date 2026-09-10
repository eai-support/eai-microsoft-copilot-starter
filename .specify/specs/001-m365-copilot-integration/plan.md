---
feature: 001-m365-copilot-integration
spec: spec.md
research: research.md
status: ready
created: 2026-09-11T00:00:00Z
---

# Implementation Plan: Microsoft Teams And Copilot Starter Kit

## Executive Summary

- Create `eai-support/eai-microsoft-copilot-starter` from the public `eai-support/eai-app-template` GitHub template.
- Demonstrate one Customer Case Assistant through an EAI web application and a Microsoft Teams/Copilot declarative agent.
- Use the same strict PublicAPI V4 resource contract in both channels; synthetic mode mirrors that contract without customer data.
- Keep EAI External ID, PublicAPI and Authz authoritative. The starter never calls ResourceAPI or AICore directly.
- Publish a PR only. Do not merge or deploy to customer tenants as part of repository creation.

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 24  
**Primary Dependencies**: Next.js 16, React 19, Auth.js, EAI Platform SDK, Microsoft 365 Agents Toolkit CLI 1.1.16  
**Storage**: In-memory synthetic case store for public demo; ResourceAPI through PublicAPI V4 for live mode  
**Testing**: Jest, Node test runner, Playwright, Microsoft package validation  
**Target Platform**: Web, Microsoft Teams and Microsoft 365 Copilot  
**App Stack Policy**: EAI app template and EAI Platform first; Microsoft agent package is the channel adapter  
**Project Type**: Single Next.js application plus Microsoft 365 agent package  
**Constraints**: Five or fewer tools, no secrets, no customer data in synthetic mode, no direct downstream service access  
**Package Profile**: External/public reference application

## Architecture

```text
Microsoft Teams/Copilot              EAI web application
          |                                   |
          | approved OpenAPI tools            | EAI BFF
          +----------------+------------------+
                           |
          synthetic: local contract-compatible case API
          live: regional PublicAPI V4 resource routes
                           |
                    PublicAPI + Authz
                           |
                       ResourceAPI
```

The Microsoft agent package calls a fixed set of case operations. In synthetic mode, local route handlers implement the same request and response shapes. In live mode, the generated OpenAPI server points to regional PublicAPI and OAuth obtains an EAI-audience user token. The web app uses the EAI SDK and BFF against the same case object type.

## Integration Points

| Component | Integration | Boundary |
| --- | --- | --- |
| EAI app template | GitHub template source at pinned commit | Copy and controlled drift, not permanent fork |
| Microsoft 365 agent | `appPackage/` and `m365agents.yml` | Declarative agent plus OpenAPI plugin |
| EAI identity | OAuth configuration and existing Auth.js setup | External ID token; no arbitrary issuer trust |
| PublicAPI V4 | `/v4/data/resources/{tenant}/customer-case` | Only EAI data ingress |
| ResourceAPI | Reached only through PublicAPI | Tenant and app-owned records |
| Synthetic demo | Contract-compatible local route | No customer data or platform mutation |

## Implementation Phases

### Phase 1: Repository Foundation

- Generate the public repo from `eai-support/eai-app-template` main commit `049e5852903841448eea99873cfac48d5682199a`.
- Create `codex/microsoft-copilot-starter` and record template provenance.
- Rename product metadata, documentation and runtime contract.
- Add Microsoft Agents Toolkit as a pinned development dependency.

Verification: repository origin, source commit, clean dependency install and baseline template tests are proven.

### Phase 2: Case Contract And Synthetic Runtime

- Define `CustomerCase` object type and strict create/update types.
- Add a bounded synthetic store with deterministic sample records.
- Add list, get, create and update route handlers mirroring PublicAPI V4 paths and envelopes.
- Reject unknown tenant, flat mutation bodies, missing version and stale version.

Verification: contract tests prove read, create, update, stale version, idempotency and tenant rejection.

### Phase 3: Web Experience

- Replace the generic template landing page with a clear Customer Case Assistant.
- Show channel parity, identity boundary and app-owned storage benefits.
- Add list, selected case, create and status update interactions.
- Preserve the existing EAI BFF, auth, runtime checks and cross-platform runners.

Verification: component tests and Playwright business scenario exercise the real rendered UI.

### Phase 4: Microsoft Agent Package

- Generate declarative-agent action scaffolding with Agents Toolkit.
- Add app manifest, declarative agent, plugin manifest, OpenAPI and adaptive cards.
- Limit operations to list, get, create and update case.
- Configure local synthetic and live EAI environments without committing secrets.

Verification: Agents Toolkit package validation passes and generated zip contains only expected files.

### Phase 5: Integration And Documentation

- Add installation, OAuth, organizational-catalog, live tenant and demo instructions.
- Add template-drift check that protects starter-owned files.
- Add CI for unit, contract, package, type, build and Playwright checks.
- Produce a short demo script showing Copilot and web parity.

Verification: a fresh checkout completes documented synthetic quickstart and CI passes.

### Phase 6: Live Proof

- Select or create a dedicated non-customer development harness tenant.
- Provision only the starter app and `CustomerCase` schema.
- Validate list/create/update through PublicAPI with the authenticated EAI user.
- Provision the agent to a Microsoft development organization when interactive Microsoft consent is available.

Verification: exact tenant, user, route, record/version and audit evidence is captured. If Microsoft consent is unavailable, synthetic/package validation is reported separately and live Copilot is not claimed.

## Repository Structure

```text
appPackage/
  manifest.json
  declarativeAgent.json
  plugins/eai-cases-plugin.json
  apiSpecification/eai-cases.openapi.yml
  adaptiveCards/
env/
m365agents.yml
src/
  app/
  auth.ts
  eai.config/
  lib/cases/
tests/
  business-scenarios/
  copilot-contract/
docs/
scripts/
eai.runtime.json
```

## Risk Assessment

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Starter accepts wrong token or tenant | Cross-tenant exposure | Live package calls PublicAPI directly; server fixes tenant in generated configuration; denial tests |
| Synthetic success is mistaken for live proof | False release claim | Separate mock, package and live evidence in README and validation report |
| Microsoft manifests drift | Agent cannot install | Pin Agents Toolkit and validate package in CI |
| Template security fixes do not reach starter | Vulnerability or contract drift | Record source SHA and add scoped drift check |
| Unmerged marketplace PR becomes accidental dependency | Blocked or unstable starter | Build from current main and document future adoption separately |
| Active customer tenant is modified | Customer impact | Explicit deny; use dedicated development harness only |

## Requirement Coverage

All identity, tool, data, AI and lifecycle requirements FR-001 through FR-034 are preserved. This repository directly implements FR-008 through FR-020 and FR-031 through FR-034. Existing EAI Platform services remain responsible for FR-001 through FR-007 and FR-021 through FR-030; the starter validates their public boundary rather than reimplementing them.

## Dual-State Delivery

| Capability | Current | Target | Promotion evidence |
| --- | --- | --- | --- |
| Case experience | Design | Synthetic working app | UI and contract tests |
| Microsoft package | Design | Valid installable package | Agents Toolkit validation |
| EAI data | Existing platform | Dedicated harness proof | PublicAPI live smoke |
| Microsoft Copilot | Not configured | Development-organization proof | Interactive provision and user journey |

## Loop Engineering

- Run focused tests after each phase.
- Repair and rerun up to three times.
- Stop rather than weaken authentication, tenant isolation, strict V4 bodies or version handling.
- Record synthetic, package, EAI live and Microsoft live evidence as separate states.

## Rollback

- Delete the unmerged starter PR or archive the new repo if the direction is rejected.
- Remove only the dedicated harness app/tenant records created by this work.
- Remove the Microsoft development installation through its owning admin account.
- No shared platform contract or customer tenant rollback is required.

The plan was refreshed against the delivered Next.js 16, React 19, EAI and Microsoft development evidence on 2026-09-10 UTC.

The plan remains aligned after the final research and specification refresh.
