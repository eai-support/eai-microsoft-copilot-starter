# Architecture

## Business Outcome

The starter demonstrates one customer case journey in an EAI web application and in Microsoft Teams or Microsoft 365 Copilot. Both channels act on the same tenant-owned record and are governed by the same user identity and authorization policy.

```text
Microsoft Teams / Copilot         EAI web application
            |                            |
            | OAuth API plugin           | Auth.js BFF
            +-------------+--------------+
                          |
                    PublicAPI V4
                          |
                  Authz + ResourceAPI
```

## Security Boundary

- EAI External ID signs in employees, customers and partners. A Microsoft 365 licence does not replace EAI tenant membership.
- Microsoft stores the plugin OAuth registration in its enterprise token store. Secrets belong in `env/.env.dev.user`, never in git.
- PublicAPI receives the delegated user token and applies tenant and app authorization before ResourceAPI is reached.
- The agent has four operations only: list, get, create and update customer cases.
- Create uses `POST { data, idempotencyKey? }`. Update uses `PUT { data, version }`. Flat bodies and `PATCH` are deliberately unsupported.
- Copilot confirms both mutating operations. A stale update must be read and reconfirmed before retry.

## Demo And Live Modes

Synthetic mode is the safe public demonstration. It exposes deterministic fake records only when `EAI_STARTER_DATA_MODE=synthetic`, and rejects every tenant except the configured synthetic tenant.

Live mode sends the browser through the EAI BFF and points the Microsoft OpenAPI plugin at the regional PublicAPI. A live proof requires a dedicated development harness tenant, app provisioning, schema convergence, an EAI External ID OAuth client and Microsoft 365 consent. Synthetic and package validation are not presented as live platform evidence.
