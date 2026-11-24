# ARCHITECTURE: admin

Only what exists. Updated: 2026-11-25.

## HLD
```
Browser --> Vercel (Next.js 16 App Router, project gokul-admin)
  src/proxy.ts            every request (except static): refresh Supabase session cookie (@supabase/ssr),
                          signed out -> /login, signed in on /login -> /; /auth/* passes through (OAuth return)
  src/app/layout.tsx      root: Geist fonts, noindex, theme script (saved theme or system)
  src/app/login/          "Continue with Google" -> server action signInWithGoogle (signInWithOAuth, PKCE verifier cookie,
                          redirectTo <origin>/auth/callback?next=/) -> Supabase -> Google; ?error=oauth shows a retry message;
                          email + password form -> server action signIn (supabase.auth.signInWithPassword); signOut
  src/app/auth/callback/  GET route: exchangeCodeForSession(code) -> redirect to `next` (relative "/..." only, else /);
                          no/bad code -> /login?error=oauth. Signed-in users without roles get the Shell no-access screen
  src/app/(admin)/        Suspense -> Shell (src/components/shell/shell.tsx): getSession() -> rail with the user's apps,
                          platform sidebar, email + Super admin label; no roles -> no-access screen; error.tsx retry
    (platform)/           Platform sidebar + Overview (apps you can open)
    (platform)/access-requests/  list of access_requests (pending first) + Approve/Deny via server action -> rpc decide_access_request;
                          nav link only for app admins / super admin (src/lib/platform-nav.ts)
    portfolio/            AppArea guard + Portfolio sidebar; page = section list; [section] = empty states (9, prerendered)
    hub/                  AppArea guard + Hub sidebar; config/ = empty state (2d builds it)
    error.tsx             retry boundary
  src/app/robots.ts       disallow all
        |
        v
  Supabase (new platform project gokul-platform): Auth (email/password + Google) + user_roles, permissions, user_permissions,
  access_requests with RLS; RPCs request_access, decide_access_request, list_app_members (app admins: members + emails)
  (supabase/migrations/, applied via SQL editor). App reads own roles via @gokulsaraswat/auth getUserRoles.
```

## LLD
- Supabase clients: `src/lib/supabase/server.ts` (`createClient()` with Next `cookies()`), env read lazily in `src/lib/supabase/env.ts` so CI builds without secrets. Session checked with `auth.getClaims()`.
- `src/lib/session.ts` `getSession()`: claims + user_roles once per request (React `cache`); `apps` = managed apps where hasRole(member).
- Login: `src/app/login/` = `page.tsx` (static) + client `google-button.tsx` and `login-form.tsx` (useActionState) + `callback-error.tsx` (useSearchParams, inside Suspense) + `actions.ts` (`signIn`, `signInWithGoogle`, `signOut`). Callback route `src/app/auth/callback/route.ts`.
- SQL only (no admin UI yet): `list_app_members(app)` (`supabase/migrations/20261125130000_app_members.sql`) for app admins; removing a member = client delete of the `user_roles` row (RLS).
- Access requests: `src/features/access-requests/` (`load.ts` server-only select, `actions.ts` server action `decideAccessRequest`, `requests-table.tsx`, client `decide-form.tsx` with useActionState; role picker only for super admins). Platform links (sidebar + phone menu) come from `platformLinks(session)` in `src/lib/platform-nav.ts`.
- Apps + sections catalog: `src/lib/apps.ts` (`ready`, `sections`). Shell = rail + phone top bar (`MobileMenu`); each area renders its own `Sidebar`; `NavLink` marks the current page.
- App isolation: each app lives in `src/app/(admin)/<app>/` (later also `src/features/<app>/`); `eslint.config.mjs` forbids importing another app's code; shared code goes in `src/lib` / `src/components`.
- Proxy is convenience, not security: data access will be enforced by RLS (Phase 2b).
- `next.config.ts`: `cacheComponents` on, so request-time data (session) renders inside `<Suspense>` (`CurrentUser`).
- Apps list: `src/lib/apps.ts` typed from `@gokulsaraswat/config` `AppId` (minus `admin`); colours `--app-<id>` in `globals.css` -> Tailwind `bg-app-<id>`.
- Styling: Tailwind v4 + `@gokulsaraswat/ui` tokens; dark = class `dark` on `<html>`, toggled by `ThemeToggle` (localStorage `theme`).
- `docs/design/prototypes/`: static HTML prototypes (not built, not linted).
