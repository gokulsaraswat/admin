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
| ADM-F-004 | Shared sign-in: GitHub on /login (generalized `signInWithOAuth`), Connected accounts page `/account` (link/unlink), auth/config 0.2.0, app id `converter` (+ migration `20261125140000_app_converter.sql`) | P1 | blocked | needs: Gokul: GitHub OAuth app + enable GitHub provider + Allow manual linking + redirect URLs, apply `20261125140000_app_converter.sql` + run `supabase/tests/app_converter_test.sql`; master: PLT-F-005 | Code done 2026-11-25. Verified: tsc, lint, build; dev :3001 /login shows both buttons, GitHub click reaches Supabase authorize (answers "provider is not enabled" until the manual step), Google still reaches accounts.google.com; callback error routing via curl. PGlite: all 4 SQL tests pass, 2 mutation checks caught. NOT verified: signed-in /account (needs a session) and a real link/unlink round trip. |
| ADM-F-003 | App members with emails: `list_app_members(app)` RPC for app admins; remove member = delete `user_roles` row | P1 | blocked | needs: Gokul applies `20261125130000_app_members.sql` + runs `supabase/tests/app_members_test.sql`; blocks: GSpace members screen | SQL + test 2026-11-25 (feat(auth): Google sign-in + list_app_members). PGlite: all 3 tests pass, 6 mutation checks caught. Contract in platform/docs/CONTRACTS.md. No admin UI for members yet (add when needed). |

## Ideas (unscoped, not committed to)
| ID | Idea | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Tech debt
| ID | Title | Pri | Status | Needs/Blocks | Notes |
|---|---|---|---|---|---|

## Done (recent)
| ID | Title | Commit | Date |
|---|---|---|---|
| ADM-D-001 | node_modules incomplete; no typecheck script (`npm ci` restores; `npm run typecheck` + `npm test` added) | fix(auth): keep the OAuth callback redirect on this origin | 2026-11-25 |
| ADM-B-001 | OAuth callback `next` check passed `/<tab>/host` (URL parser strips tab/CR/LF -> `//host`, off-origin redirect after a successful code exchange; an invalid port there threw a 500). Now resolved + origin-compared; 6 `node:test` cases (old code fails 3) | fix(auth): keep the OAuth callback redirect on this origin | 2026-11-25 |
| ADM-F-002 | Google sign-in on /login (`signInWithGoogle` + `/auth/callback`), password form kept | feat(auth): Google sign-in + list_app_members | 2026-11-25 |
