# Copilot Case Tool Contract

| Operation ID | Method and path | Input | Output |
| --- | --- | --- | --- |
| `listMyCases` | `GET /v4/data/resources/{tenant}/customer-case` | bounded `limit` | `{ docs, total }` |
| `getCase` | `GET /v4/data/resources/{tenant}/customer-case/{id}` | record ID | `{ id, version, data }` |
| `createCase` | `POST /v4/data/resources/{tenant}/customer-case` | `{ data, idempotencyKey? }` | created record and receipt |
| `updateCase` | `PUT /v4/data/resources/{tenant}/customer-case/{id}` | `{ data, version }` | updated record and receipt |

The Microsoft plugin receives these four operations only. Synthetic routes implement the same contract. Live configuration points the OpenAPI server directly to regional PublicAPI.

