# Starter Kit Data Model

## CustomerCase

| Field | Type | Required | Purpose |
| --- | --- | --- | --- |
| `title` | text | yes | Short customer-visible case title |
| `summary` | text | yes | Business description of the request |
| `customerName` | text | yes | Display name only; not an identity key |
| `status` | select | yes | `draft`, `open`, `waiting_customer`, `resolved` |
| `priority` | select | yes | `low`, `normal`, `high` |
| `notes` | json | no | Bounded note entries with source and timestamp |
| `createdAt` | date | yes | Creation evidence |
| `updatedAt` | date | yes | Last update evidence |

Every resource also carries the platform `id` and positive `version`. Synthetic records use the same shape. Live records are tenant and app owned in ResourceAPI.

## Mutation Rules

- Create accepts only `{ data, idempotencyKey? }`.
- Update accepts only `{ data, version }`.
- Unknown fields at the envelope level are rejected.
- A stale version returns `409` and the current version.
- Synthetic idempotency keys return the original creation result.
- The tenant comes from deployment configuration, not a conversational choice.

