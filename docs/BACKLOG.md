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
| ADM-F-001 | Invite-only access requests: `access_requests` table, `request_access` / `decide_access_request` RPCs, /access-requests page | P1 | blocked | needs: Gokul applies `20261125120000_access_requests.sql` + runs `supabase/tests/access_requests_test.sql`; blocks: GSpace sign-in gate | SQL + page committed 2026-11-25 (feat(access-requests)). SQL + test verified locally in PGlite with 5 mutation checks. Contract in platform/docs/CONTRACTS.md. Not runtime-checked in the browser (migration not applied). |
| ADM-F-003 | App members with emails: `list_app_members(app)` RPC for app admins; remove member = delete `user_roles` row | P1 | blocked | needs: Gokul applies `20261125130000_app_members.sql` + runs `supabase/tests/app_members_test.sql`; blocks: GSpace members screen | SQL + test 2026-11-25 (feat(auth): Google sign-in + list_app_members). PGlite: all 3 tests pass, 6 mutation checks caught. Contract in platform/docs/CONTRACTS.md. No admin UI for members yet (add when needed). |

## Ideas (unscoped, not committed to)
| ID | Idea | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Tech debt
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|
| ADM-D-001 | node_modules incomplete (typescript, tailwindcss, @gokulsaraswat/* missing) so typecheck/build cannot run; no typecheck script | P2 | open | | Seen 2026-11-25. Fix: `NODE_AUTH_TOKEN=$(gh auth token) npm ci`; optionally add "typecheck": "tsc --noEmit". 2026-11-25: that `npm ci` restored node_modules locally; tsc, lint, build pass. Typecheck script still missing. |

## Done (recent)
| ID | Title | Commit | Date |
|---|---|---|---|
| ADM-F-002 | Google sign-in on /login (`signInWithGoogle` + `/auth/callback`), password form kept | feat(auth): Google sign-in + list_app_members | 2026-11-25 |
