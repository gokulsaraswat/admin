# Graph Report - admin  (2026-10-31)

## Corpus Check
- 49 files · ~26,723 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 302 nodes · 345 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `19643072`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WORKLOG
- package.json
- compilerOptions
- REPO SECTIONS
- 🤖 System Architecture & Co-Worker Protocol
- app/layout.tsx
- devDependencies
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
- next
- AGENTS.md: admin
- pull_request_template.md
- COLLABORATORS.md
- PLANNING-CHAT-PROMPT.md
- SECURITY.md
- shell.tsx
- 3. API by feature (server truth)
- DESIGN (Phase 1, for Gokul's approval before any app code)
- dependencies

## God Nodes (most connected - your core abstractions)
1. `WORKLOG` - 19 edges
2. `compilerOptions` - 16 edges
3. `4. Admin UI features (what the screens do)` - 16 edges
4. `3. API by feature (server truth)` - 14 edges
5. `next` - 10 edges
6. `🤖 System Architecture & Co-Worker Protocol` - 10 edges
7. `REPO SECTIONS` - 9 edges
8. `createClient()` - 8 edges
9. `admin` - 8 edges
10. `DESIGN (Phase 1, for Gokul's approval before any app code)` - 8 edges

## Surprising Connections (you probably didn't know these)
- `LLD` --references--> `ThemeToggle()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/theme-toggle.tsx
- `LLD` --references--> `CurrentUser()`  [INFERRED]
  docs/ARCHITECTURE.md → src/components/shell/current-user.tsx
- `LLD` --references--> `createClient()`  [INFERRED]
  docs/ARCHITECTURE.md → src/lib/supabase/server.ts
- `Overview()` --calls--> `getSession`  [EXTRACTED]
  src/app/(admin)/page.tsx → src/lib/session.ts
- `LoginForm()` --indirect_call--> `signIn()`  [INFERRED]
  src/app/login/login-form.tsx → src/app/login/actions.ts

## Import Cycles
- None detected.

## Communities (28 total, 6 thin omitted)

### Community 0 - "WORKLOG"
Cohesion: 0.08
Nodes (23): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+15 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (24): eslintConfig, description, engines, node, license, name, private, scripts (+16 more)

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

### Community 6 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, @types/node, @types/react, @types/react-dom (+1 more)

### Community 7 - "admin"
Cohesion: 0.22
Nodes (8): admin, Build / lint (same as CI and Vercel), CI, Deploy (Vercel), Docs, License, Requirements, Run

### Community 8 - "WORKLOG: admin"
Cohesion: 0.25
Nodes (7): Blockers / requests to other repos, Current state (2026-10-31), Decisions (Gokul, 2026-10-31), Done, In progress / next, Reminders, WORKLOG: admin

### Community 9 - "Owns (Supabase, new platform project)"
Cohesion: 0.29
Nodes (6): CONTRACTS: admin, Expects (packages), Hub `config.json` publish location (agreed with Gokul 2026-10-31), Owns (Supabase, new platform project), TO BE UPDATED, `user_roles`, `permissions`, `user_permissions` (owned here; SQL: `supabase/migrations/20261031120000_roles_permissions.sql`, APPLIED 2026-10-31)

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

### Community 17 - "next"
Cohesion: 0.11
Nodes (18): ARCHITECTURE: admin, HLD, LLD, nextConfig, next, @supabase/ssr, signIn(), SignInState (+10 more)

### Community 23 - "shell.tsx"
Cohesion: 0.16
Nodes (17): @gokulsaraswat/auth, @gokulsaraswat/config, react, ref_server_only, Overview(), AppMark(), AppMarkProps, bg (+9 more)

### Community 24 - "3. API by feature (server truth)"
Cohesion: 0.14
Nodes (14): 3. API by feature (server truth), Backup / restore (`/api/backup`), Blog ideas (`/api/blog-ideas`, `[id]`), Blogs (`/api/blogs`, `/api/blogs/[id]`), Comments (`/api/comments`, `[id]`), Courses + chapters (`/api/courses`, `[courseId]`, `[courseId]/chapters`, `[chapterId]`), Messages (`/api/contact`, `/api/messages`, `[id]`), Misc (+6 more)

### Community 25 - "DESIGN (Phase 1, for Gokul's approval before any app code)"
Cohesion: 0.22
Nodes (8): 1. Product, 2. Visual system, 3. Information architecture (routes), 4. Roles per screen (delegated admin, per spec answers), 5. Mobile (mobile-first), 6. Patterns (shared component kit, shadcn/ui style, copied into `src/components/ui`), 7. Layout options (pick one; prototypes), DESIGN (Phase 1, for Gokul's approval before any app code)

### Community 26 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, @gokulsaraswat/auth, @gokulsaraswat/config, @gokulsaraswat/ui, next, react, react-dom, @supabase/ssr (+1 more)

## Knowledge Gaps
- **187 isolated node(s):** `posts`, `statusLabel`, `filters`, `state`, `commands` (+182 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 213 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `app/layout.tsx`, `shell.tsx`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `posts`, `statusLabel`, `filters` to the rest of the system?**
  _187 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WORKLOG` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._