# Kickoff prompt: admin

Master copy: platform/docs/PROMPTS.md (github.com/gokulsaraswat/platform). If they differ, the master wins.
Use: new chat with this repo as working directory. Paste SHARED BLOCK + REPO SECTION. Collaborators also paste the ADD-ON.

## SHARED BLOCK
```text
You are working in ONE repo of a 6-repo platform (github.com/gokulsaraswat/*):
- platform: shared packages (@gokulsaraswat/ui, @gokulsaraswat/mdx, @gokulsaraswat/auth, @gokulsaraswat/config) + MASTER docs in docs/
- admin: super admin (Next.js + Supabase Auth), app switcher, per-app admin sections, roles/permissions
- gokulmobilize: hub (Vite + React PWA, proposed) + Capacitor Android/iOS wrapper
- bestportofolio: public portfolio (Next.js 16, Prisma on Supabase Postgres); its admin is moving to `admin`
- Progress: GSpace (Astro 5, vanilla JS, local-first, MD -> MDX, base path /gspace)
- later: Markdown-studio, checkers-gym-management

STARTUP (before any change)
1. Read, in this repo: CLAUDE.md, AGENTS.md, WORKLOG.md, .claude-session.json, docs/CONTRACTS.md, README.md.
   Also read the master: platform/docs/WORKLOG.md and platform/docs/CONTRACTS.md (GitHub: gokulsaraswat/platform).
   If graphify-out/ exists, query it first.
2. Report to me: current state, what this repo must deliver, which other repos it depends on / affects,
   and EVERY doubt. Wait for my answers.

RULES
- Ask as many questions as needed until you are 100% certain. Never assume. Never invent a file, table,
  function, prop, env var or API. If it is not in the code or docs, stop with: [REQ_CONTEXT]: I need <thing>.
- Use skills/plugins by default: ponytail (smallest working solution), caveman (terse output),
  graphify (code map), plus any other fitting skill. Order: reuse -> stdlib/platform -> existing dep -> new code.
- Small steps. Before each step: say what you will change and wait for my OK.
  After each step: build + lint + run, show evidence, then update WORKLOG.md, .claude-session.json,
  docs/CONTRACTS.md (if an interface changed), refresh graphify, commit, push.
- Git: owner pushes to main. Collaborators: branch `<user>-<repo>` + PR only. Never force-push.
- Docs upkeep is automatic: never wait to be told. Keep every file in REPO-KIT current in the same step, and if the process or an
  interface changes, update the affected docs (WORKLOG, CONTRACTS, KICKOFF-PROMPT, master requests) and say what you updated.
- Never edit another repo. Needs from other repos go into platform/docs/WORKLOG.md as a request.
- Shared constants come from @gokulsaraswat/ui (design philosophy, tokens, footer with Privacy, Terms, Cookie Policy,
  Data Deletion Request, Accessibility Statement, Sitemap, FAQ, About, Contact; SEO basics). Per-app: loader, accent, content.
- Simple proof of deploy-ready: run `rm -rf node_modules .next dist && npm ci && npm run build` (or the repo's equivalent) on the pinned Node. If it passes, Vercel will build. Also check file-name CASE in imports (macOS ignores case, Vercel/Linux does not).
- Deploy-ready is part of done: the PRODUCTION build must succeed with the same commands the host runs (clean install from the lockfile, then build), on a pinned Node version
  (`engines` + `.nvmrc`), with every env var listed in .env.example, no reliance on local files, and CI green. A failing host build = not done. Private @gokulsaraswat/* packages
  need an auth token in CI and on the host (.npmrc using ${NODE_AUTH_TOKEN}); never commit the token. Hosting is DECIDED: Vercel for all repos (Gokul, 2026-10-31). Verify with the Vercel build (clean install + production build); Vercel env vars + project settings documented in README. Any exception: ask me.
- Done = builds (production), runs, lint clean, tests pass, docs updated, pushed, GitHub repo tidy.
- Repo kit checklist: platform/docs/REPO-KIT.md. First task in any repo: bring it up to that kit (propose the list, wait for OK).
```

## COLLABORATOR ADD-ON
```text
Collaborator mode: work on branch `<github-username>-<repo>` off main. One commit per completed step, push after each,
open a PR (never push or merge to main). After each commit: git fetch origin main and merge it in; skip steps already done on main.
Take steps in order from .claude-session.json sprint.todo_next. Ask the owner only for [REQ_CONTEXT] blockers; for design
choices decide, and record the decision in that step's done[] entry. Never mark a step done unless built, run and verified.
Update WORKLOG.md after every step so the next person can continue.
```

## REPO SECTION
### 2. admin
Scope: the NEW super admin. Next.js + Supabase Auth + Tailwind, hosted on Vercel. platform is DONE: use the PUBLISHED packages `@gokulsaraswat/ui`, `config`, `auth` (0.1.0; install needs `.npmrc` + `NODE_AUTH_TOKEN` with read:packages; contracts in platform/docs/CONTRACTS.md). `@gokulsaraswat/mdx` does not exist yet.
Already decided (do not re-ask): app ids hub/admin/portfolio/gspace/studio/gym; roles super_admin (row app='*') > admin > member (per app); NO role_permissions table yet; `user_roles` migration + RLS are OWNED BY THIS REPO (columns/PK in CONTRACTS.md); hub config.json v1 shape in `@gokulsaraswat/config` (`parseHubConfig`); database = a NEW Supabase project for the platform (Gokul creates it; see admin/docs/SUPABASE-SETUP.md); the portfolio's data moves into it LATER in a separate planned step.
DESIGN DECISION (Gokul, 2026-10-31): the portfolio's admin UI is static and was built for the portfolio only. Do NOT port or reuse its UI. Treat `bestportofolio/src/components/admin` + `src/app/api/*` as a SPEC for WHAT data exists and HOW it is fetched/validated, then build a better admin from scratch, designed for many apps (super admin).
- Phase 0 (read-only): write `docs/PORTFOLIO-ADMIN-SPEC.md`: per admin feature (blogs, courses, projects, snippets, todos, comments, messages, users, backups, logs, RAG settings, ...): tables, fields, validations, API routes, permissions, quirks, what to keep/drop. Ask me about anything unclear. No code yet.
- Phase 1 (design, my approval before code): information architecture (app switcher -> app sections), roles per screen, mobile behaviour, design system on `@gokulsaraswat/ui` tokens + a component kit (shadcn/ui style), patterns: data tables (sort/filter/bulk), forms (react-hook-form + zod), optimistic updates + skeletons (TanStack Query), command palette, dark mode, audit log, empty/error states. Use the design skills/plugins; show me options and ask which I like. Ask for dashboards I like as references.
- Phase 2 (build, one slice at a time): shell + Supabase login -> `user_roles` migration + RLS (security-critical, max effort, show me the SQL before applying) -> app switcher (route group per app, lazy; an app's admin never loads another's code) -> Portfolio blogs end-to-end on the new design -> remaining sections -> config.json publisher (Supabase Storage public bucket; agree path with me, record in CONTRACTS.md) -> MDX editor with preview (needs @gokulsaraswat/mdx; ask me for Calculator/WebWindow specs) -> migration plan for existing portfolio AdminUser rows + TOTP -> Supabase Auth.
- DATA LAYER DECIDED (Gokul delegated, 2026-10-31): the new admin uses `supabase-js` (`@supabase/ssr`) + Row Level Security, NOT Prisma. Platform tables (`user_roles`, `content`, `app_config`) are plain SQL migrations in THIS repo; generate TS types with `supabase gen types`; policies use `is_super_admin()`/role helpers; service-role key server-only; show me each table's policy SQL before applying.
- PORTFOLIO DATA = LATER STEP (own plan, ask me): until then the portfolio site + its old admin stay on the OLD Supabase project. Migration plan: recreate tables in the new project from `bestportofolio/prisma/schema.prisma` (`prisma db push` to the new DIRECT_URL), dump/restore data, switch the portfolio env vars, verify the site, then add RLS per table. Old project kept as backup until verified. Admin Phase 2 sections for portfolio data come AFTER this migration (build platform-only slices first: login, roles, switcher, config publisher).
- Keep bestportofolio's admin running until the new admin has parity for what I actually use; then remove it from the portfolio (last step, with my OK).
- Also define in CONTRACTS.md (TO BE UPDATED there): `content(app, slug, body)` and `app_config(app, key, value jsonb)` shapes.
FIRST read admin/docs/SUPABASE-SETUP.md (owner checklist + DRAFT SQL for user_roles, RLS, config bucket; review the SQL with me before applying).
ANSWERED by Gokul (2026-10-31): look = SHOW ME 2-3 prototype options and I pick; mobile = fully responsive, mobile-first; features = he uses ALMOST ALL of the portfolio admin (blogs + ideas, courses, projects, snippets, comments, messages, users, todos, backups, logs, RAG settings, and more): keep all in the spec, drop nothing without asking.
Questions to ask me first: reference dashboards I like, Supabase project + keys setup (I create the project; never ask me to paste secrets in chat), migration of existing AdminUser rows + TOTP, config.json bucket/path, admin domain/Vercel project name.
