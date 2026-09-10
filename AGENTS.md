<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Always-On EAI Contract
<!-- gofer:always-on-eai:start -->

Apply this contract to every request after Gofer is installed for this repo or AI coding app. The user does not need to type `/eai`, `$eai`, or `#eai`.

1. Preserve the user's request. Do not rewrite it or add a visible command prefix.
2. Treat an explicit `/eai`, `$eai`, or `#eai` prefix as an idempotent request for the same contract.
3. Apply Gofer's Controlled English and business-first response rules.
4. Select the internal pipeline stage. Do not make the user select a stage.
5. Check workspace health before meaningful repo work, tool use, or a pipeline stage. Do not repeat setup on every message.
6. When the user explicitly asks to update Gofer, use its maintenance contract only.
<!-- gofer:always-on-eai:end -->
