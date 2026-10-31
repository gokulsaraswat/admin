# ARCHITECTURE: admin

Only what exists. Updated: 2026-10-31.

## HLD
```
Browser --> Vercel (Next.js 16 App Router, project gokul-admin)
              src/app/layout.tsx   root layout, Geist fonts, noindex metadata
              src/app/page.tsx     placeholder page
              src/app/robots.ts    disallow all
              globals.css <-- @gokulsaraswat/ui tokens.css + tailwind.css (GitHub Packages)
```
Not built yet: Supabase client, login, `user_roles`, app switcher, app sections, config publisher.

## LLD
- Styling: Tailwind v4 via `@tailwindcss/turbopack` (`next.config.ts`); colors/radius/motion from `@gokulsaraswat/ui` CSS variables (`bg-card`, `text-muted-foreground`, ...). Dark mode = class `dark` on an ancestor.
- `next.config.ts`: `cacheComponents`, `partialPrefetching` (create-next-app 16.4.3 defaults).
- Admin is internal: `robots: noindex` + `robots.txt` disallow; no public legal footer pages.
