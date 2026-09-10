# Blast Radius Report

## Scope

This is a new public starter repository. It changes no shared EAI service, policy, database or customer tenant.

## Interfaces

- Inbound browser traffic stays inside the Next.js app and existing EAI BFF pattern.
- Microsoft calls only four allowlisted PublicAPI V4-compatible operations.
- Live data remains behind PublicAPI, Authz and ResourceAPI.
- Synthetic mode is local and uses fake data only.

## Containment

- Tenant scope is server-fixed and unknown tenants are rejected.
- Mutations require the V4 data envelope, current version and Microsoft confirmation.
- Runtime identities, tenant IDs and secrets are ignored by git.
- Rollback is branch or repository removal plus removal of the isolated development registrations.

## Residual Risk

The development-only Microsoft toolkit dependency chain has known transitive audit findings. It is excluded from production dependencies and recorded as a visible warning.
