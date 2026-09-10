# EAI Microsoft Teams And Copilot Starter

A working reference application that puts governed EAI customer cases inside an EAI web app and a Microsoft 365 declarative agent.

The value is not another chatbot. EAI remains responsible for external identity, tenant membership, authorization and operational data. Microsoft Teams and Copilot become approved channels over that governed platform.

## What Works

- A responsive Customer Case Assistant with list, create and version-aware update journeys.
- A synthetic PublicAPI-compatible API containing fake records only.
- Strict V4 mutations: `POST { data, idempotencyKey? }` and `PUT { data, version }`.
- Tenant denial, stale-version and invalid-body evidence.
- An installable Microsoft package with four allowlisted OAuth operations.
- Copilot confirmation prompts for create and update.
- EAI `CustomerCase` object type for a dedicated live harness.
- Automated contract, package, unit, build and Playwright validation.

## Safe Quick Start

```bash
git clone https://github.com/eai-support/eai-microsoft-copilot-starter.git
cd eai-microsoft-copilot-starter
npm ci
cp .env.example .env.local
./run.sh dev 3107
```

On Windows:

```powershell
Copy-Item .env.example .env.local
.\run.ps1 dev 3107
```

Open `http://localhost:3107`. The default is synthetic safe mode and cannot access a customer tenant.

## Validate

```bash
npm run verify
npm run test:smoke
npm run test:contract
npm run m365:validate
npm run test:business-scenarios
npm run test:e2e
npm run test:playwright
npm run build
```

For a live development organization, provision the EAI External ID registration, add Microsoft’s Copilot OAuth redirect URI, and run `npm run m365:configure:dev` before `atk provision --env dev`. Concrete tenant, client and secret values remain in ignored local files.

`m365:validate` builds the application package, runs Microsoft 365 Agents Toolkit validation and inspects the resulting ZIP for unresolved settings, secrets and unexpected files.

Pull request CI uses `m365:validate:ci` for deterministic package and contract checks. Run `m365:validate` before release to include Microsoft's external validation service.

A screenshot is only visual evidence. The browser journey must also pass and assert the create and version-aware update outcomes.

## AI Agent Handoff

Start with `eai start --check`, then run `eai start` before implementation. Give the provider the business outcome and business specification, and ask the provider to read the project before changing it. Treat each agent chat in this repository as if the public `eai` entrypoint is active, including the diagnose, repair and revalidation loop.

Use `./run.sh dev 3107` on macOS or Linux and `run.ps1 dev 3107` on Windows instead of calling `npm run dev` directly. The runner performs the repository preflight before opening the application.

## Architecture

```text
Teams / Microsoft 365 Copilot       EAI web application
               |                           |
               | OAuth API plugin          | Auth.js BFF
               +-------------+-------------+
                             |
                       PublicAPI V4
                             |
                     Authz + ResourceAPI
```

The Microsoft agent calls PublicAPI directly with an EAI-audience delegated token. It does not call ResourceAPI, databases or Azure services directly. The browser uses the app-template BFF so tokens remain server-side.

## Microsoft Package

The package under `appPackage/` follows the current Microsoft 365 Agents Toolkit format and exposes only:

| Operation     | PublicAPI V4 contract                                |
| ------------- | ---------------------------------------------------- |
| `listMyCases` | `GET /v4/data/resources/{tenant}/customer-case`      |
| `getCase`     | `GET /v4/data/resources/{tenant}/customer-case/{id}` |
| `createCase`  | `POST` with `{ data, idempotencyKey? }`              |
| `updateCase`  | `PUT` with `{ data, version }`                       |

See [Microsoft setup](docs/microsoft-setup.md) for OAuth, development-organization provisioning and catalog publication.

## Evidence Boundaries

- Synthetic green proves the public sample and strict contract behavior.
- Package green proves Microsoft schema and packaging validity.
- EAI live requires a dedicated development harness and authenticated PublicAPI evidence.
- Microsoft live requires an entitled Microsoft development organization and interactive consent.

These are reported separately. A package build or local mock is not a live deployment.

## Documentation

- [Architecture and security](docs/architecture.md)
- [Microsoft Teams and Copilot setup](docs/microsoft-setup.md)
- [Five-minute demonstration](docs/demo-script.md)
- [Template provenance](TEMPLATE_PROVENANCE.md)

## Official Microsoft References

- [Microsoft 365 Agents Toolkit CLI](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/microsoft-365-agents-toolkit-cli)
- [Plugins for Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-plugins)
- [API plugin authentication](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api-plugin-authentication)
- [Confirmation prompts](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/plugin-confirmation-prompts)

## Licence And Identity Boundary

EAI External ID can securely include customers and partners who are outside a customer's workforce Entra tenant. It does not grant a Microsoft 365 Copilot licence. Microsoft licensing and EAI membership remain separate controls.
