# Graph Report - admin  (2026-11-24)

## Corpus Check
- 69 files · ~31,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 371 nodes · 491 edges · 30 communities (24 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a383de75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WORKLOG
- package.json
- compilerOptions
- REPO SECTIONS
- 🤖 System Architecture & Co-Worker Protocol
- CONTEXT: read this first in every new session
- load.ts
- admin
- WORKLOG: admin
- Owns (Supabase, new platform project)
- Kickoff prompt: admin
- Repo Kit (every repo must have these)
- Supabase setup for the platform (owner checklist + DRAFT SQL)
- 4. Admin UI features (what the screens do)
- shared.js
- Codebase Blueprint & Structural Graph
- sync-architecture.sh
- login/actions.ts
- AGENTS.md: admin
- pull_request_template.md
- COLLABORATORS.md
- PLANNING-CHAT-PROMPT.md
- SECURITY.md
- next
- 3. API by feature (server truth)
- DESIGN (Phase 1, for Gokul's approval before any app code)
- apps.ts
- devDependencies
- app/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `WORKLOG` - 20 edges
2. `4. Admin UI features (what the screens do)` - 16 edges
3. `compilerOptions` - 16 edges
4. `next` - 14 edges
5. `3. API by feature (server truth)` - 14 edges
6. `🤖 System Architecture & Co-Worker Protocol` - 12 edges
7. `createClient()` - 12 edges
8. `getSession` - 10 edges
9. `CONTEXT: read this first in every new session` - 9 edges
10. `react` - 9 edges

## Surprising Connections (you probably didn't know these)
- `LLD` --references--> `createClient()`  [INFERRED]
  docs/ARCHITECTURE.md → src/lib/supabase/server.ts
- `LLD` --references--> `CurrentUser()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/shell/current-user.tsx
- `LLD` --references--> `MobileMenu()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/shell/mobile-menu.tsx
- `LLD` --references--> `NavLink()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/shell/nav-link.tsx
- `LLD` --references--> `Sidebar()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/shell/sidebar.tsx

## Import Cycles
- None detected.

## Communities (30 total, 6 thin omitted)

### Community 0 - "WORKLOG"
Cohesion: 0.07
Nodes (28): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+20 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (35): appIsolation, apps, eslintConfig, dependencies, @gokulsaraswat/auth, @gokulsaraswat/config, @gokulsaraswat/ui, next (+27 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 4 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.15
Nodes (12): 🔄 Auto-Sync: Architecture Docs & Graphify, ⏱️ Communication Constraints (Zero Waste Mode), Context, 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, graphify, 🛠️ Project Execution Modes (Personal vs. Organization), STANDING RULES (from Gokul, apply in every session) (+4 more)

### Community 5 - "CONTEXT: read this first in every new session"
Cohesion: 0.20
Nodes (9): CONTEXT: read this first in every new session, Future changes (expect these; do not block them), How repos interact (the contracts), Repo map, STANDING RULES (from Gokul, apply in every session), This repo: admin, Vision, Work modes (ask Gokul which one if unclear) (+1 more)

### Community 6 - "load.ts"
Cohesion: 0.13
Nodes (22): Hub `config.json` publish location (agreed with Gokul 2026-10-31), @gokulsaraswat/config, @supabase/ssr, HubConfig(), publishHubConfig(), PublishState, HUB_CONFIG_BUCKET, HUB_CONFIG_PATH (+14 more)

### Community 7 - "admin"
Cohesion: 0.22
Nodes (8): admin, Build / lint (same as CI and Vercel), CI, Deploy (Vercel), Docs, License, Requirements, Run

### Community 8 - "WORKLOG: admin"
Cohesion: 0.25
Nodes (7): Blockers / requests to other repos, Current state (2026-10-31), Decisions (Gokul, 2026-10-31), Done, In progress / next, Reminders, WORKLOG: admin

### Community 9 - "Owns (Supabase, new platform project)"
Cohesion: 0.33
Nodes (5): CONTRACTS: admin, Expects (packages), Owns (Supabase, new platform project), TO BE UPDATED, `user_roles`, `permissions`, `user_permissions` (owned here; SQL: `supabase/migrations/20261031120000_roles_permissions.sql`, APPLIED 2026-10-31)

### Community 10 - "Kickoff prompt: admin"
Cohesion: 0.33
Nodes (5): 2. admin, COLLABORATOR ADD-ON, Kickoff prompt: admin, REPO SECTION, SHARED BLOCK

### Community 11 - "Repo Kit (every repo must have these)"
Cohesion: 0.33
Nodes (5): Definition of done (any step), Deploy-ready rules (every repo), Master docs (live in `platform/docs/`), Repo Kit (every repo must have these), Shared constants (from `@gokulsaraswat/ui`, same on every app)

### Community 12 - "Supabase setup for the platform (owner checklist + DRAFT SQL)"
Cohesion: 0.33
Nodes (5): Decision: which project (UPDATED 2026-10-31, supersedes "reuse portfolio's"), DRAFT SQL (SUPERSEDED 2026-10-31), Env vars (admin/.env.example must list these; values only in .env.local / Vercel), Gokul does in the Supabase dashboard (no secrets in chat), Supabase setup for the platform (owner checklist + DRAFT SQL)

### Community 13 - "4. Admin UI features (what the screens do)"
Cohesion: 0.08
Nodes (25): 1.1 Auth today (custom, NOT Supabase Auth), 1.2 Operation log (audit), 1.3 Shared conventions, 1. Cross-cutting, 2. Tables (Prisma, old Supabase project), 4.10 Todos (`todo-manager.tsx`), 4.11 Users (`user-manager.tsx`), 4.12 Backup (`backup-manager.tsx`) (+17 more)

### Community 14 - "shared.js"
Cohesion: 0.24
Nodes (10): commands, drawPalette(), filters, openPalette(), posts, render(), state, statusCell() (+2 more)

### Community 15 - "Codebase Blueprint & Structural Graph"
Cohesion: 0.40
Nodes (4): 1. High-Level Design (HLD) Topology, 2. Current Target Directory Tree, 3. Low-Level Design (LLD) & SOLID Class Schemas, Codebase Blueprint & Structural Graph

### Community 16 - "sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

### Community 17 - "login/actions.ts"
Cohesion: 0.24
Nodes (7): signIn(), SignInState, signOut(), LoginForm(), metadata, CurrentUser(), CurrentUserProps

### Community 23 - "next"
Cohesion: 0.16
Nodes (9): nextConfig, next, HubHome(), PortfolioHome(), portfolio, AppHome(), EmptySection(), AppSection (+1 more)

### Community 24 - "3. API by feature (server truth)"
Cohesion: 0.14
Nodes (14): 3. API by feature (server truth), Backup / restore (`/api/backup`), Blog ideas (`/api/blog-ideas`, `[id]`), Blogs (`/api/blogs`, `/api/blogs/[id]`), Comments (`/api/comments`, `[id]`), Courses + chapters (`/api/courses`, `[courseId]`, `[courseId]/chapters`, `[chapterId]`), Messages (`/api/contact`, `/api/messages`, `[id]`), Misc (+6 more)

### Community 25 - "DESIGN (Phase 1, for Gokul's approval before any app code)"
Cohesion: 0.22
Nodes (8): 1. Product, 2. Visual system, 3. Information architecture (routes), 4. Roles per screen (delegated admin, per spec answers), 5. Mobile (mobile-first), 6. Patterns (shared component kit, shadcn/ui style, copied into `src/components/ui`), 7. Layout options (pick one; prototypes), DESIGN (Phase 1, for Gokul's approval before any app code)

### Community 26 - "apps.ts"
Cohesion: 0.10
Nodes (26): ARCHITECTURE: admin, HLD, LLD, @gokulsaraswat/auth, react, ref_server_only, Overview(), AppMark() (+18 more)

### Community 28 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+1 more)

### Community 29 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): src_app_globals, geistMono, geistSans, metadata, themeScript

## Knowledge Gaps
- **210 isolated node(s):** `📦 This Repo: admin`, `📐 Engineering Guardrails`, `🎨 Frontend Architecture, UI/UX & Motion Standard`, `📉 Token-Optimized Communication Mode`, `🛠️ Project Execution Modes (Personal vs. Organization)` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 241 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `load.ts`, `login/actions.ts`, `apps.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `react` connect `apps.ts` to `package.json`, `login/actions.ts`, `load.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `@gokulsaraswat/config` connect `load.ts` to `package.json`, `apps.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `📦 This Repo: admin`, `📐 Engineering Guardrails`, `🎨 Frontend Architecture, UI/UX & Motion Standard` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WORKLOG` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._