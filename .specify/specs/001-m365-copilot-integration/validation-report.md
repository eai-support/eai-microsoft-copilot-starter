# Validation Report

Gate: PASS WITH WARNINGS

## Automated Evidence

| Gate | Result |
| --- | --- |
| Lint | Pass, zero warnings |
| Unit and configuration | 42 suites, 177 tests passed |
| Smoke | 6 checks passed |
| Contract | 5 route tests and 4 Microsoft contract tests passed |
| Microsoft package | Package built; all 59 Microsoft rules passed; six expected files only |
| Production build | Next.js 16 optimized build passed |
| Browser | Two Chromium journeys passed, including create and version-aware update |
| Production dependencies | Zero vulnerabilities |
| Gofer | Version 3.12.7 workspace healthy for Codex |
| Gofer closed loop | 34 requirements complete; no drift or missing goal links |
| EAI connectivity | All five gateway, auth, platform, schema and local type checks passed |

## Real Boundary Evidence

- EAI: a dedicated development harness converged all four object types. PublicAPI V4 list, create, update and read passed, with the record moving from version 1 to version 2.
- Microsoft: an idempotent provision updated the existing Teams app, registered OAuth, validated and updated the package, and published the Copilot agent. All six provision actions passed.
- Synthetic: the default local mode uses fake bounded records and cannot access a customer tenant.

## Warning

The official Microsoft Agents Toolkit is development-only but currently brings 26 transitive audit findings: 1 critical, 14 high, 8 moderate and 3 low. The production dependency tree has zero vulnerabilities. This warning remains visible until Microsoft updates the toolkit chain or a reviewed replacement is selected.

No production or customer deployment was requested. The pull request must remain unmerged.

GitHub PR #1 is open for review. Final CI evidence is recorded after the exact PR head completes.

Template drift reports 36 review files and 12 UI files because this repository intentionally specializes the source template. The only upstream add is legacy `middleware.ts`; Next.js 16 uses the delivered `proxy.ts` instead.

The first PR run proved unit and contract checks, then Microsoft external validation remained in progress for more than seven minutes. CI now uses the deterministic package builder and custom contract inspection. The full 59-rule Microsoft validation and live six-action provision remain separate release evidence.
