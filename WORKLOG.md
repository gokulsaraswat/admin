# WORKLOG: admin

Master status of all repos: platform/docs/WORKLOG.md. Update this file after every step.

## Current state (2026-10-31)
- Repo kit done: Next.js 16.4.3 + React 19.3 + Tailwind v4 placeholder app, `@gokulsaraswat/ui` 0.1.0 tokens wired, Node 24 pinned, CI (lint + build), docs. Clean install + lint + build pass locally; CI green on first push (run 41213102925).
- Not built: Supabase client/login, `user_roles` SQL (draft only in docs/SUPABASE-SETUP.md, not applied), app switcher, sections, config publisher. Not deployed to Vercel.

## Done
- Step 1 (2026-10-31): repo kit. See `.claude-session.json` sprint.done[0].
- Step 2 (2026-10-31): Phase 0 spec `docs/PORTFOLIO-ADMIN-SPEC.md` (data, API, UI per feature, mapping proposal, 11 questions). Key facts: old TOTP not implemented (nothing to migrate); roles/permissions never enforced server-side.

## In progress / next
- Phase 0 answers: Gokul answers spec section 7 questions. Then Phase 1 design (2-3 options), then Phase 2 slices. Full order: `.claude-session.json` sprint.todo_next.

## Decisions (Gokul, 2026-10-31)
- Order: repo kit -> Phase 0 spec -> Phase 1 design -> Phase 2 build (platform-only slices before portfolio data).
- Stack: npm, Node 24, Next.js 16, Tailwind v4, shadcn-style components (CLI copies).
- Licence: all rights reserved (repo is public).
- Existing portfolio AdminUser rows: re-invite in Supabase Auth + re-enrol TOTP (no hash/secret import).
- Hub config: bucket `public-config`, object `hub/config.json`.
- Vercel project: `gokul-admin`.
- Design: working features first; references Vercel, Linear, Supabase Studio, Stripe (Phase 1 shows options).
- Admin is internal: noindex, no public legal footer pages.

## Blockers / requests to other repos
- **URGENT bestportofolio (security)**: findings in local-only `docs/private/SECURITY-FINDINGS.md` (git-ignored, not public until fixed). One is critical and confirmed live on bestportofolio.vercel.app (2026-10-31): fix in bestportofolio + Gokul rotates the OLD Supabase project's DB password.
- platform (master CONTRACTS.md, Hub `config.json`): record bucket `public-config`, path `hub/config.json` (agreed 2026-10-31). Admin does not edit platform.
- Gokul (GitHub UI, needs repo admin): set repo description, topics, branch protection on main.
- Gokul: replace the token in `.env.local` with a classic token scoped to `read:packages` ONLY (current one has full account scopes), no quotes; revoke the old one. Use the new one for Vercel.

## Reminders
- `npm audit`: 16 moderate, all dev-only (minimatch via eslint plugins). Revisit when eslint-config-next updates.
- SQL review points for the `user_roles` slice: last-super-admin lock-out guard; drop storage "public read" policy (lets anyone list the bucket; public buckets serve files without it); revoke `execute` on `is_super_admin()` from public/anon; `(select auth.uid())` in policies; add per-app role helper for `content`/`app_config`.
