# FEATURES: admin

Every route, page, server action and database call this app has, who may use it, and how to check it. Only what exists.
Updated: 2026-11-25. Roles: `super_admin` (row `app='*'`) > app `admin` > app `member` (+ `user_permissions`). The UI check only
shapes the screen; the database check (RLS or the function itself) is the enforcement.

## Routes and pages
| Route | Kind | What it does | UI check (app) | Database check (enforcement) | Verify |
|---|---|---|---|---|---|
| every path except `_next/static`, `_next/image`, `favicon.ico`, `robots.txt` | proxy `src/proxy.ts` | Refreshes the Supabase session cookie (`getClaims`); signed out -> `/login`, signed in on `/login` -> `/`; `/auth/*` passes; `Cache-Control: no-store` | session present | none (convenience only) | signed out: `curl -sI localhost:3001/` -> 307 `location: /login` |
| `/login` | page (static) | "Continue with Google/GitHub" + email/password form; `?error=oauth` shows "Sign-in did not finish" | none (public) | Supabase Auth | open signed out; buttons reach Supabase authorize |
| `/auth/callback` | GET route handler | Swaps the PKCE `code` for a session cookie, then redirects to `next` (same-origin path only, else `/`); provider errors -> `/login?error=oauth` or `/account?error=<code>` | none (public) | Supabase Auth (PKCE verifier cookie) | `curl -sI "localhost:3001/auth/callback?error=access_denied"` -> `/login?error=oauth`; `tests/safe-next.test.mjs` |
| `/` | page, PPR | Overview: the apps you can open | signed in + any role (Shell) | `user_roles` RLS: own rows | sign in; rail + list show only your apps |
| `/access-requests` | page, PPR | Requests you may see, pending first; Approve / Deny / Set role | nav link for any app admin or super admin; Decide buttons per row if admin of that app (role picker + "Set role" only for super admin) | `access_requests` RLS select (own or `has_app_role(app,'admin')`); writes only via `decide_access_request` | needs migration `20261125120000` applied; then sign in as app admin |
| `/account` | page, PPR | Connected accounts: list, Link Google/GitHub, Unlink (confirm; last one disabled) | signed in + any role | Supabase Auth (user's own identities; "Allow manual linking") | sign in, open `/account` |
| `/hub` | page, PPR | Hub landing: its sections | `AppArea`: member of `hub` | none (no data) | as hub member: page; others: "You don't have access to Hub" |
| `/hub/config` | page, PPR | Hub tiles editor; Publish writes `public-config/hub/config.json` | `AppArea` hub member; editor only if `has_permission('hub','config.edit')` | Storage RLS on `public-config` (`has_permission(<folder>,'config.edit')`) | needs migration `20261031130000` applied; edit, Publish, open the public URL |
| `/portfolio` | page, PPR | Portfolio landing: 9 sections | `AppArea`: member of `portfolio` | none (no data yet) | as portfolio member |
| `/portfolio/[section]` | page, PPR, 9 prerendered (`posts`, `projects`, `courses`, `snippets`, `messages`, `comments`, `chatbot`, `settings`, `backup`) | Empty state per section; unknown slug -> 404 | `AppArea`: member of `portfolio` | none (no data yet) | `/portfolio/nope` -> 404 |
| `/robots.txt` | route | `Disallow: /` (admin is never indexed; root metadata also sets `noindex`) | none | none | `curl localhost:3001/robots.txt` |
| GSpace, Studio, Gym, Converter | rail marks only | Dimmed "not set up yet" (no routes) | member of that app | none | rail shows a dimmed letter |

Error and loading states: `src/app/(admin)/error.tsx` (retry) for the admin area; `ShellFallback` while the session loads.

## Server actions (POST only; Next.js checks Origin against Host, so they are same-origin only)
| Action | File | Called from | Who | Enforcement | Errors shown |
|---|---|---|---|---|---|
| `signIn` | `src/app/login/actions.ts` | `/login` form | anyone | Supabase Auth password check | "Email or password is incorrect." / generic "unavailable" (details only in server logs) |
| `signInWithOAuth` | `src/app/login/actions.ts` | `/login` provider buttons | anyone | provider id checked with `isAuthProviderId`; redirectTo fixed to `<origin>/auth/callback?next=/` | generic per provider |
| `signOut` | `src/app/login/actions.ts` | Sign out button (sidebar, top bar, no-access screen) | signed in | Supabase Auth | none |
| `decideAccessRequest` | `src/features/access-requests/actions.ts` | `/access-requests` | app admin of the request's app; `role=admin` and "Set role" super admin | `decide_access_request` checks everything (role, app, admin rows) | the function's own messages for `42501`, `22023`, `P0002`; otherwise generic |
| `linkAccount` | `src/features/account/actions.ts` | `/account` Link buttons | signed in | Supabase `linkIdentity` (needs a session); redirectTo fixed to `/auth/callback?next=/account` | mapped codes (`src/features/account/messages.ts`) |
| `unlinkAccount` | `src/features/account/actions.ts` | `/account` Unlink | signed in, 2+ identities | `unlinkProvider` re-reads the caller's own identities (another user's id is `identity_not_found`); Supabase refuses the last one | mapped codes |
| `publishHubConfig` | `src/features/hub/config/actions.ts` | `/hub/config` Publish | `hub` admin, super admin, or member with `config.edit` | `hubConfigSchema` re-validated on the server; Storage RLS decides the write | generic "Not published ..." |

## Database calls (Supabase, RLS on every table)
| Call | Where | Grants | Rule |
|---|---|---|---|
| `auth.getClaims()` | proxy, `getSession` | - | verified JWT claims (sub, email) |
| `select user_id, app, role from user_roles where user_id = <me>` (`getUserRoles`) | `src/lib/session.ts` | `authenticated` | RLS: own rows, or rows of apps you admin |
| `rpc has_permission('hub','config.edit')` | `src/features/hub/config/load.ts` | `authenticated` only | security definer; true for hub admins, super admins, granted members |
| `storage.from('public-config').download/upload('hub/config.json')` | hub config load/action | Storage RLS | select/insert/update/delete need `has_permission(<first folder>,'config.edit')`; public URL read needs no policy (public bucket) |
| `select * from access_requests` | `src/features/access-requests/load.ts` | `authenticated`: select only | RLS: own rows or `has_app_role(app,'admin')` |
| `rpc decide_access_request(p_id, p_approve, p_role)` | access requests action | `authenticated` only | security definer: admin of the request's app; `admin` grants and changing an admin need super admin |
| `rpc request_access(p_app)` | not called by admin (GSpace and other apps) | `authenticated` only | own pending `member` request, idempotent |
| `rpc list_app_members(p_app)` | not called by admin yet (GSpace members screen) | `authenticated` only | admin of `p_app` or super admin |
| `auth.getUserIdentities / linkIdentity / unlinkIdentity`, `signInWithOAuth`, `exchangeCodeForSession`, `signInWithPassword`, `signOut` | login, callback, account | Supabase Auth | session-bound |
No service-role key is used anywhere (`SUPABASE_SERVICE_ROLE_KEY` is unreferenced in `src/`).

## Migrations (`supabase/migrations/`, applied by Gokul in the SQL editor)
| File | Status | Test (`supabase/tests/`, rolls back) |
|---|---|---|
| `20261031120000_roles_permissions.sql` | APPLIED 2026-10-31 | `roles_rls_test.sql` |
| `20261031130000_public_config_bucket.sql` | NOT APPLIED | `public_config_test.sql` |
| `20261125120000_access_requests.sql` | NOT APPLIED | `access_requests_test.sql` |
| `20261125130000_app_members.sql` | NOT APPLIED | `app_members_test.sql` |
| `20261125140000_app_converter.sql` | NOT APPLIED | `app_converter_test.sql` |
Plain-language review of each: `docs/SQL-REVIEW.md`.

## Commands
| Command | What | Expected |
|---|---|---|
| `NODE_AUTH_TOKEN=... npm ci` | install from the lockfile (GitHub Packages token, `read:packages`) | 0 vulnerabilities |
| `npm run dev` / `npx next start -p 3001` | dev / production server (use :3001 for real Supabase calls) | - |
| `npm run build` | production build (Turbopack, typechecks too) | 22 static pages, routes as above |
| `npm run lint` | ESLint (next core-web-vitals + typescript + cross-app import ban) | 0 problems |
| `npx tsc --noEmit` | typecheck | 0 errors |
| SQL tests | paste a test file into the Supabase SQL editor after its migration | one row "ALL ... PASSED" |

## Baseline (2026-11-25, Windows, Node 24.14.1, npm 11.11.0, Next.js 16.4.6)
| Metric | Value |
|---|---|
| `npm ci` | 48 s, 377 packages audited, 0 vulnerabilities, node_modules 499 MB |
| `npm run build` | cold (no `.next`) 23.7 s wall (compile 4.1 s, TypeScript 2.7 s, 22 pages 1.45 s); warm 18.2-19.6 s |
| Lint | 59 files, 0 errors, 0 warnings, 16.4 s warm |
| Typecheck (`tsc --noEmit`) | 0 errors, 13.4 s warm |
| JS tests | none (no runner yet) |
| SQL tests (local PGlite, in-memory, no network) | 5/5 pass after all 5 migrations: roles_rls, public_config, access_requests, app_members, app_converter (3.2 s) |
| Shared client JS (every page) | 7 chunks, 544.1 KB raw / 167.3 KB gzip (React + Next runtime) |
| CSS | 1 file, 31.4 KB raw |
| Fonts | 2 preloaded per page: Geist 29.3 KB, Geist Mono 23.1 KB (no monospace text anywhere in `src/`) |

Per-route client JS (shared + the route's own chunks; gzip level 9):
| Route | Chunks | Total raw KB | Total gzip KB | Route-only gzip KB | Client modules from `src/` |
|---|---|---|---|---|---|
| `/login` | 9 | 562.6 | 172.8 | 5.5 | login form, provider buttons, callback error |
| `/` | 10 | 569.6 | 175.7 | 8.4 | shell (nav-link, mobile-menu, theme-toggle), `(admin)/error.tsx` |
| `/access-requests` | 11 | 571.6 | 176.6 | 9.3 | shell + `decide-form` |
| `/account` | 11 | 574.4 | 177.7 | 10.4 | shell + `link-buttons`, `unlink-button` |
| `/hub` | 10 | 569.6 | 175.7 | 8.4 | shell only |
| `/hub/config` | 12 | 680.0 | 207.7 | 40.4 | shell + hub `editor` (+ zod via `hubConfigSchema`) |
| `/portfolio`, `/portfolio/[section]` | 10 | 569.6 | 175.7 | 8.4 | shell only (no hub code) |
Route groups stay lazy: the hub editor and zod load only on `/hub/config`; no portfolio route loads hub code.
How measured: `.next/build-manifest.json` `rootMainFiles` + `polyfillFiles` plus each route's `page_client-reference-manifest.js` `entryJSFiles`.
