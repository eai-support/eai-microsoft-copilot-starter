# Starter Kit Traceability

| Requirement | Code | Tests | Status |
| --- | --- | --- | --- |
| FR-001 | `m365agents.yml`, `appPackage/ai-plugin.json` | Microsoft OAuth registration provisioned | Verified |
| FR-002 | EAI PublicAPI boundary, not reimplemented | live PublicAPI user-token calls | Platform-owned |
| FR-003 | EAI External ID boundary, not reimplemented | live development registration | Platform-owned |
| FR-004 | `src/lib/cases/http.ts` | unknown-tenant contract test | Verified |
| FR-005 | EAI membership boundary, not reimplemented | tenant rejection test | Platform-owned |
| FR-006 | PublicAPI and Authz boundary, not reimplemented | live V4 list/create/update/read | Platform-owned |
| FR-007 | `docs/architecture.md` | Graph is absent from the package | Verified |
| FR-008 | `appPackage/`, `m365agents.yml` | Microsoft package validation | Verified |
| FR-009 | `appPackage/ai-plugin.json` | exact four-function assertion | Verified |
| FR-010 | OpenAPI and plugin manifests | package contract tests | Verified |
| FR-011 | `appPackage/ai-plugin.json` | four functions, no discovery | Verified |
| FR-012 | bounded case schemas | route and OpenAPI tests | Verified |
| FR-013 | fixed plugin only | package content inspection | Verified |
| FR-014 | web and plugin case contracts | component, contract and browser tests | Verified |
| FR-015 | server-fixed tenant route | tenant rejection and live harness | Verified |
| FR-016 | create route and OpenAPI | flat-body rejection and live POST | Verified |
| FR-017 | update route and OpenAPI | PATCH rejection, version test and live PUT | Verified |
| FR-018 | plugin confirmation metadata | mutation confirmation assertions | Verified |
| FR-019 | synthetic store idempotency | duplicate-key contract test | Verified |
| FR-020 | version conflict handling | stale-version contract test | Verified |
| FR-021 | `docs/architecture.md` | not in starter lifecycle scope | Platform-owned |
| FR-022 | `docs/architecture.md` | domain prompts are not duplicated | Platform-owned |
| FR-023 | declarative agent instructions | package content inspection | Verified |
| FR-024 | `docs/architecture.md` | documents are outside starter scope | Platform-owned |
| FR-025 | `docs/architecture.md` | long-running AI is outside starter scope | Platform-owned |
| FR-026 | `docs/architecture.md` | human review is outside starter scope | Platform-owned |
| FR-027 | `docs/microsoft-setup.md` | dedicated harness provisioning evidence | Platform-owned |
| FR-028 | `docs/microsoft-setup.md` | Microsoft development organization provision | Verified |
| FR-029 | `docs/microsoft-setup.md` | removal is an organization-admin action | Platform-owned |
| FR-030 | OpenAPI, PublicAPI and version responses | live boundary evidence, no secrets logged | Platform-owned |
| FR-031 | `TEMPLATE_PROVENANCE.md` | source repository and SHA recorded | Verified |
| FR-032 | `src/app`, `appPackage/` | Playwright and Microsoft provision | Verified |
| FR-033 | synthetic routes and local env guards | secret, tenant and mode checks | Verified |
| FR-034 | `docs/microsoft-setup.md` | organization publication path documented | Verified |

## Goal Trace

| Goal | Requirements | Code | Tests |
| --- | --- | --- | --- |
| G1 | FR-001, FR-006, FR-008, FR-014, FR-016, FR-017, FR-031, FR-032, FR-033, FR-034 | web channel, Microsoft package and PublicAPI contract | synthetic, package, EAI live and Microsoft live gates |

## Live Boundary Evidence

| Boundary | Result |
| --- | --- |
| Synthetic application | List, get, create and version-aware update pass without customer data. |
| EAI Platform | Dedicated development harness converged four object types. PublicAPI V4 list, create, update and read returned the expected record version. |
| Microsoft 365 | Existing development app reprovisioned successfully. Teams app, OAuth registration, package update and Copilot agent publication all passed. |
| Production release | Not requested. The branch remains unmerged and no customer tenant was changed. |
