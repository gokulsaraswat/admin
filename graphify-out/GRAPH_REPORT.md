# Graph Report - admin  (2026-11-24)

## Corpus Check
- 68 files · ~30,942 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 359 nodes · 480 edges · 29 communities (23 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `95cd8fe7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WORKLOG
- package.json
- compilerOptions
- REPO SECTIONS
- 🤖 System Architecture & Co-Worker Protocol
- app/layout.tsx
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
- placeholders.tsx
- 3. API by feature (server truth)
- DESIGN (Phase 1, for Gokul's approval before any app code)
- apps.ts
- dependencies

## God Nodes (most connected - your core abstractions)
1. `WORKLOG` - 20 edges
2. `4. Admin UI features (what the screens do)` - 16 edges
3. `compilerOptions` - 16 edges
4. `next` - 14 edges
5. `3. API by feature (server truth)` - 14 edges
6. `createClient()` - 12 edges
7. `getSession` - 10 edges
8. `🤖 System Architecture & Co-Worker Protocol` - 10 edges
9. `react` - 9 edges
10. `REPO SECTIONS` - 9 edges

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

## Communities (29 total, 6 thin omitted)

### Community 0 - "WORKLOG"
Cohesion: 0.07
Nodes (28): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+20 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (35): appIsolation, apps, eslintConfig, description, devDependencies, eslint, eslint-config-next, tailwindcss (+27 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 4 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.18
Nodes (10): 🔄 Auto-Sync: Architecture Docs & Graphify, ⏱️ Communication Constraints (Zero Waste Mode), 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, graphify, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📦 This Repo: admin (+2 more)

### Community 5 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): src_app_globals, geistMono, geistSans, metadata, themeScript

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
Cohesion: 0.12
Nodes (16): 4.10 Todos (`todo-manager.tsx`), 4.11 Users (`user-manager.tsx`), 4.12 Backup (`backup-manager.tsx`), 4.13 Settings (`profile-settings.tsx`), 4.14 AI chat bot / RAG (`rag-settings.tsx`), 4.15 Operation logs (`operation-logs-viewer.tsx`; `operation-logs-panel.tsx` is dead), 4.1 Shell, login, roles (`admin/page.tsx`, `admin-layout.tsx`), 4.2 Dashboard (`admin-dashboard.tsx`) (+8 more)

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
Cohesion: 0.27
Nodes (6): signIn(), SignInState, signOut(), LoginForm(), metadata, CurrentUserProps

### Community 23 - "placeholders.tsx"
Cohesion: 0.24
Nodes (7): HubHome(), PortfolioHome(), portfolio, AppHome(), EmptySection(), AppSection, getApp()

### Community 24 - "3. API by feature (server truth)"
Cohesion: 0.08
Nodes (23): 1.1 Auth today (custom, NOT Supabase Auth), 1.2 Operation log (audit), 1.3 Shared conventions, 1. Cross-cutting, 2. Tables (Prisma, old Supabase project), 3. API by feature (server truth), 5. New admin: how each feature maps (proposal, for Phase 1), 6. Security findings in bestportofolio (+15 more)

### Community 25 - "DESIGN (Phase 1, for Gokul's approval before any app code)"
Cohesion: 0.22
Nodes (8): 1. Product, 2. Visual system, 3. Information architecture (routes), 4. Roles per screen (delegated admin, per spec answers), 5. Mobile (mobile-first), 6. Patterns (shared component kit, shadcn/ui style, copied into `src/components/ui`), 7. Layout options (pick one; prototypes), DESIGN (Phase 1, for Gokul's approval before any app code)

### Community 26 - "apps.ts"
Cohesion: 0.08
Nodes (29): ARCHITECTURE: admin, HLD, LLD, nextConfig, @gokulsaraswat/auth, next, react, ref_server_only (+21 more)

### Community 28 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @gokulsaraswat/auth, @gokulsaraswat/config, @gokulsaraswat/ui, next, react, react-dom, @supabase/ssr (+1 more)

## Knowledge Gaps
- **200 isolated node(s):** `Planning Chat: resume prompt`, `URGENT (Gokul only)`, `Where each repo stands`, `Requests waiting for the `platform` repo (collected from repo logs; platform chat applies, planning chat syncs)`, `GitHub / sync status (2026-11-14)` (+195 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 230 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `apps.ts` to `package.json`, `app/layout.tsx`, `load.ts`, `login/actions.ts`, `placeholders.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `react` connect `apps.ts` to `package.json`, `login/actions.ts`, `load.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `@gokulsaraswat/config` connect `load.ts` to `package.json`, `apps.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Planning Chat: resume prompt`, `URGENT (Gokul only)`, `Where each repo stands` to the rest of the system?**
  _200 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WORKLOG` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._