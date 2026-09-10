# TDD Session

## Contract Red And Green

The contract tests were written before the synthetic handlers. They initially failed because list, create and update routes did not exist.

The implementation then passed tests for:

- strict create `{ data, idempotencyKey? }`;
- strict update `PUT { data, version }`;
- flat-body and PATCH rejection;
- stale-version conflict;
- repeated idempotency key behavior;
- unknown tenant rejection.

## Security Regression

The Microsoft live run showed that Agents Toolkit writes generated IDs into its runtime environment file. A regression test now requires that file and the user-secret file to remain ignored, while only a blank example is tracked.
