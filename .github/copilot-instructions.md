# Copilot Instructions

## Project Overview

**eai-microsoft-copilot-starter** is a TypeScript project using Next.js.

## Gofer Pipeline

This project uses Gofer for spec-driven development. Run `/0_gofer_start` to
start the core pipeline: business scenario -> research -> specify -> plan ->
tasks -> implement -> validate.

Key commands: `/1_gofer_research`, `/2_gofer_specify`, `/3_gofer_plan`,
`/4_gofer_tasks`, `/5_gofer_implement`, `/6_gofer_validate`. `/6_gofer_validate`
is the terminal quality gate and includes the final engineering review loop. Use
`/7_gofer_save` for checkpoints and `/8_gofer_branding` for branded
document/deck templates. Artifacts in `.specify/specs/{feature}/`.

## Code Quality

### TypeScript Conventions

- Use strict mode (`"strict": true` in tsconfig.json)
- Use ESM imports (`import`/`export`), never `require()`
- Add explicit return types to all public functions
- Prefer `unknown` over `any`; use proper type narrowing
- Use `readonly` for properties that should not be reassigned
- Prefer interfaces over type aliases for object shapes

### Next.js App Router Guardrail

- In `src/app/**/route.ts`, export only HTTP methods such as `GET`, `POST`,
  `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`
- Only export supported route config fields such as `dynamic`, `runtime`, and
  `revalidate`
- Do not export helper functions, dependency interfaces, or test seams from
  `route.ts`
- Put reusable logic in a sibling `handler.ts` or a module under `src/lib/`,
  then keep `route.ts` as a thin wrapper

## Task Management

1. **Plan First**: Write plan with checkable items before starting
2. **Track Progress**: Mark items complete as you go
3. **Verify**: Run tests and demonstrate correctness before marking done
4. **Capture Lessons**: Update lessons file after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
