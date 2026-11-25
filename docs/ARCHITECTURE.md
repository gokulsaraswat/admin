# ARCHITECTURE: admin

Only what exists. Updated: 2026-11-25.

## HLD
```
Browser --> Vercel (Next.js 16 App Router, project gokul-admin)
  src/proxy.ts            every request (except static): refresh Supabase session cookie (@supabase/ssr),
                          signed out -> /login, signed in on /login -> /; /auth/* passes through (OAuth return)
  src/app/layout.tsx      root: Geist fonts, noindex, theme script (saved theme or system)
  src/app/login/          "Continue with Google" / "Continue with GitHub" (AUTH_PROVIDERS) -> server action signInWithOAuth
                          (@gokulsaraswat/auth signInWithProvider, PKCE verifier cookie, redirectTo <origin>/auth/callback?next=/)
                          -> Supabase -> provider; ?error=oauth shows a retry message;
                          email + password form -> server action signIn (supabase.auth.signInWithPassword); signOut
  src/app/auth/callback/  GET route (sign-in and linking): exchangeCodeForSession(code) -> redirect to `next` (relative "/..." only,
                          else /); no/bad code or ?error_code -> /login?error=oauth, or /account?error=<code> when next=/account.
                          Signed-in users without roles get the Shell no-access screen
  src/app/(admin)/        Suspense -> Shell (src/components/shell/shell.tsx): getSession() -> rail with the user's apps,
                          platform sidebar, email + Super admin label; no roles -> no-access screen; error.tsx retry
    (platform)/           Platform sidebar + Overview (apps you can open)
    (platform)/access-requests/  list of access_requests (pending first) + Approve/Deny via server action -> rpc decide_access_request;
                          nav link only for app admins / super admin (src/lib/platform-nav.ts)
    (platform)/account/   Connected accounts: identities (listIdentities), Link Google/GitHub (server action linkAccount ->
                          linkProvider, returns via /auth/callback?next=/account), Unlink with confirm (unlinkProvider; disabled
                          for the last one). Linked from the platform nav and the user's email in the sidebar/top bar
    portfolio/            AppArea guard + Portfolio sidebar; page = section list; [section] = empty states (9, prerendered)
    hub/                  AppArea guard + Hub sidebar; config/ = tiles editor (src/features/hub/config: load.ts
                          has_permission('hub','config.edit') + Storage download, client editor.tsx + tile-row.tsx, server action
                          publishHubConfig -> Storage upload public-config/hub/config.json; bucket SQL NOT APPLIED)
    error.tsx             retry boundary
  src/app/robots.ts       disallow all
        |
        v
  Supabase (new platform project gokul-platform): Auth (email/password + Google + GitHub, manual linking) + user_roles, permissions, user_permissions,
  access_requests with RLS; RPCs request_access, decide_access_request, list_app_members (app admins: members + emails);
  app ids checked by is_app_id() (adds converter)
  (supabase/migrations/, applied via SQL editor). App reads own roles via @gokulsaraswat/auth getUserRoles.
```

## LLD
- Supabase clients: `src/lib/supabase/server.ts` (`createClient()` with Next `cookies()`), env read lazily in `src/lib/supabase/env.ts` so CI builds without secrets. Session checked with `auth.getClaims()`.
- `src/lib/session.ts` `getSession()`: claims + user_roles once per request (React `cache`); `apps` = managed apps where hasRole(member).
- Login: `src/app/login/` = `page.tsx` (static) + client `provider-buttons.tsx` (one form, submitter `provider`) and `login-form.tsx` (useActionState) + `callback-error.tsx` (useSearchParams, inside Suspense) + `actions.ts` (`signIn`, `signInWithOAuth`, `signOut`). Callback route `src/app/auth/callback/route.ts`. Shared: `src/lib/oauth.ts` (server-only `oauthCallbackUrl(next)`), `src/lib/provider-label.ts`, `src/components/provider-mark.tsx`.
- Connected accounts: `src/features/account/` (`load.ts` server-only `loadIdentities` -> plain `IdentityRow`s, `actions.ts` `linkAccount` / `unlinkAccount`, `messages.ts` error codes -> text, client `link-buttons.tsx` + `unlink-button.tsx` (two-step confirm), `identity-list.tsx`). All server-side (no browser Supabase client).
- SQL only (no admin UI yet): `list_app_members(app)` (`supabase/migrations/20261125130000_app_members.sql`) for app admins; removing a member = client delete of the `user_roles` row (RLS).
- Access requests: `src/features/access-requests/` (`load.ts` server-only select, `actions.ts` server action `decideAccessRequest`, `requests-table.tsx`, client `decide-form.tsx` with useActionState; role picker only for super admins). Platform links (sidebar + phone menu) come from `platformLinks(session)` in `src/lib/platform-nav.ts`.
- Apps + sections catalog: `src/lib/apps.ts` (`ready`, `sections`). Shell = rail + phone top bar (`MobileMenu`); each area renders its own `Sidebar`; `NavLink` marks the current page.
- App isolation: each app lives in `src/app/(admin)/<app>/` (later also `src/features/<app>/`); `eslint.config.mjs` forbids importing another app's code; shared code goes in `src/lib` / `src/components`.
- Proxy is convenience, not security: data access will be enforced by RLS (Phase 2b).
- `next.config.ts`: `cacheComponents` on, so request-time data (session) renders inside `<Suspense>` (`CurrentUser`).
- Apps list: `src/lib/apps.ts` typed from `@gokulsaraswat/config` `AppId` (minus `admin`); colours `--app-<id>` in `globals.css` -> Tailwind `bg-app-<id>`.
- Styling: Tailwind v4 + `@gokulsaraswat/ui` tokens; dark = class `dark` on `<html>`, toggled by `ThemeToggle` (localStorage `theme`).
- `docs/design/prototypes/`: static HTML prototypes (not built, not linted).
- Feature inventory (every route, action, RPC, role, how to verify) and the speed baseline: `docs/FEATURES.md`.
