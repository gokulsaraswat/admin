# ARCHITECTURE: admin

Only what exists. Updated: 2026-10-31.

## HLD
```
Browser --> Vercel (Next.js 16 App Router, project gokul-admin)
  src/proxy.ts            every request (except static): refresh Supabase session cookie (@supabase/ssr),
                          signed out -> /login, signed in on /login -> /
  src/app/layout.tsx      root: Geist fonts, noindex, theme script (saved theme or system)
  src/app/login/          email + password form -> server action signIn (supabase.auth.signInWithPassword); signOut
  src/app/(admin)/        Suspense -> Shell (src/components/shell/shell.tsx): getSession() -> rail with the user's apps,
                          platform sidebar, email + Super admin label; no roles -> no-access screen; error.tsx retry
    (platform)/           Platform sidebar + Overview (apps you can open)
    portfolio/            AppArea guard + Portfolio sidebar; page = section list; [section] = empty states (9, prerendered)
    hub/                  AppArea guard + Hub sidebar; config/ = empty state (2d builds it)
    error.tsx             retry boundary
  src/app/robots.ts       disallow all
        |
        v
  Supabase (new platform project gokul-platform): Auth + user_roles, permissions, user_permissions with RLS
  (supabase/migrations/, applied via SQL editor). App reads own roles via @gokulsaraswat/auth getUserRoles.
```

## LLD
- Supabase clients: `src/lib/supabase/server.ts` (`createClient()` with Next `cookies()`), env read lazily in `src/lib/supabase/env.ts` so CI builds without secrets. Session checked with `auth.getClaims()`.
- `src/lib/session.ts` `getSession()`: claims + user_roles once per request (React `cache`); `apps` = managed apps where hasRole(member).
- Apps + sections catalog: `src/lib/apps.ts` (`ready`, `sections`). Shell = rail + phone top bar (`MobileMenu`); each area renders its own `Sidebar`; `NavLink` marks the current page.
- App isolation: each app lives in `src/app/(admin)/<app>/` (later also `src/features/<app>/`); `eslint.config.mjs` forbids importing another app's code; shared code goes in `src/lib` / `src/components`.
- Proxy is convenience, not security: data access will be enforced by RLS (Phase 2b).
- `next.config.ts`: `cacheComponents` on, so request-time data (session) renders inside `<Suspense>` (`CurrentUser`).
- Apps list: `src/lib/apps.ts` typed from `@gokulsaraswat/config` `AppId` (minus `admin`); colours `--app-<id>` in `globals.css` -> Tailwind `bg-app-<id>`.
- Styling: Tailwind v4 + `@gokulsaraswat/ui` tokens; dark = class `dark` on `<html>`, toggled by `ThemeToggle` (localStorage `theme`).
- `docs/design/prototypes/`: static HTML prototypes (not built, not linted).
