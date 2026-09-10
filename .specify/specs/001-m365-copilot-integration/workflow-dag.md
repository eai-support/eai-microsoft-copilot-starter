# Implementation Workflow

```text
preflight
  -> repository foundation
  -> failing case contract tests
  -> synthetic route implementation
  -> web UI and component tests
  -> Microsoft package generation and validation
  -> combined build and Playwright validation
  -> PR and CI
  -> optional dedicated DEV harness proof
  -> optional Microsoft development-organization proof
```

Synthetic, package, EAI live and Microsoft live evidence are independent gates. A later gate cannot be inferred from an earlier one. Each failed gate receives at most three repair attempts before the exact blocker is reported.

