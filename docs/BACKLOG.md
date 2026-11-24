# BACKLOG: admin (ADM)

Rules: `RULES.md` section 4. Architecture: `docs/ARCHITECTURE.md`. Public-safe: no secrets, no employer material.
Priority: P0 broken/blocking or security, P1 important, P2 worthwhile, P3 nice to have.
Status: open, doing, blocked, done, dropped. Cross-repo: `needs:` waits on, `blocks:` is waited on by.

## Bugs
| ID | Title | Pri | Status | Needs/Blocks | Notes (where, repro, evidence) |
|---|---|---|---|---|---|

## Improvements
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| ADM-I-001 | UI/motion upgrade: dense, scannable admin shell, tables, hub editor (presentation only) | P2 | open | needs: ADM-D-001; master: PLT-I-001 | Prompt: docs/KICKOFF-PROMPT.md "UI UPGRADE ADD-ON". Installed 2026-11-25: motion, @formkit/auto-animate (unused so far). Verify: lint, tsc --noEmit, build. |

## Features
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Ideas (unscoped, not committed to)
| ID | Idea | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Tech debt
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| ADM-D-001 | node_modules incomplete (typescript, tailwindcss, @gokulsaraswat/* missing) so typecheck/build cannot run; no typecheck script | P2 | open | | Seen 2026-11-25. Fix: `NODE_AUTH_TOKEN=$(gh auth token) npm ci`; optionally add "typecheck": "tsc --noEmit". |

## Done (recent)
| ID | Title | Commit | Date |
|---|---|---|---|
