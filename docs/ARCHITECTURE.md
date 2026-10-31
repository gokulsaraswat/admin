# ARCHITECTURE: admin

Only what exists. Updated: 2026-10-31.

## HLD
```
Browser --> Vercel (Next.js 16 App Router, project gokul-admin)
  src/proxy.ts            every request (except static): refresh Supabase session cookie (@supabase/ssr),
                          signed out -> /login, signed in on /login -> /
  src/app/layout.tsx      root: Geist fonts, noindex, theme script (saved theme or system)
  src/app/login/          email + password form -> server action signIn (supabase.auth.signInWithPassword); signOut
  src/app/(admin)/        shell (Option A rail, docs/DESIGN.md): app rail + platform sidebar + content; mobile top bar
    page.tsx              Overview: list of managed apps (all "not set up yet")
  src/app/robots.ts       disallow all
        |
        v
  Supabase (new platform project): Auth only so far. No tables yet.
```

## LLD
- Supabase clients: `src/lib/supabase/server.ts` (`createClient()` with Next `cookies()`), env read lazily in `src/lib/supabase/env.ts` so CI builds without secrets. Session checked with `auth.getClaims()`.
- Proxy is convenience, not security: data access will be enforced by RLS (Phase 2b).
- `next.config.ts`: `cacheComponents` on, so request-time data (session) renders inside `<Suspense>` (`CurrentUser`).
- Apps list: `src/lib/apps.ts` typed from `@gokulsaraswat/config` `AppId` (minus `admin`); colours `--app-<id>` in `globals.css` -> Tailwind `bg-app-<id>`.
- Styling: Tailwind v4 + `@gokulsaraswat/ui` tokens; dark = class `dark` on `<html>`, toggled by `ThemeToggle` (localStorage `theme`).
- `docs/design/prototypes/`: static HTML prototypes (not built, not linted).
