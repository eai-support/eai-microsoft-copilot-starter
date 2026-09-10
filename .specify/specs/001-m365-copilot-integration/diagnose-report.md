# Diagnose Report

## Bounded Repair Loop

1. The initial smoke gate found missing Gofer guidance and browser aliases in the new README. The guidance was added and the same smoke gate passed.
2. The first Playwright run reused a stale server from this checkout. The exact owned process was stopped and the browser journey passed on a fresh server.
3. The first Microsoft provision used a display label instead of the OpenAPI security-scheme key for OAuth registration. The workflow now uses `eaiExternalId`; a regression test was added and the idempotent live provision passed all six actions.

## Workspace Bootstrap

The repository-local bootstrap helper initially selected the same source and destination after first refresh. The installed Gofer bundle performed the bootstrap, the current 3.12.7 bundle refreshed all surfaces, and the final workspace check reported healthy with no missing core or host files.

No validation was weakened. No customer tenant was used.
