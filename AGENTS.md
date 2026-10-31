# AGENTS.md: admin

Read in order: CLAUDE.md, WORKLOG.md, .claude-session.json, docs/CONTRACTS.md, docs/ARCHITECTURE.md, docs/KICKOFF-PROMPT.md.
Master docs: platform/docs/ (WORKLOG, CONTRACTS, REPO-KIT, PROMPTS) at github.com/gokulsaraswat/platform.
Rules: ask when unsure, never invent names (`[REQ_CONTEXT]`), small steps, update WORKLOG.md each step, never push to main as a collaborator.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
