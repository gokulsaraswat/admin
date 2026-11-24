# Graph Report - admin  (2026-11-24)

## Corpus Check
- 85 files · ~50,914 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 579 nodes · 687 edges · 41 communities (33 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `efe141b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- WORKLOG
- package.json
- compilerOptions
- REPO SECTIONS
- 🤖 System Architecture & Co-Worker Protocol
- CONTEXT: read this first in every new session
- next
- admin
- WORKLOG: admin
- 1.4 Mermaid — Cancellation Sequence Diagrams
- Kickoff prompt: admin
- Repo Kit (every repo must have these)
- Supabase setup for the platform (owner checklist + DRAFT SQL)
- 4. Admin UI features (what the screens do)
- shared.js
- Codebase Blueprint & Structural Graph
- sync-architecture.sh
- Cancellation — Temporal Workflow
- AGENTS.md: admin
- pull_request_template.md
- COLLABORATORS.md
- PLANNING-CHAT-PROMPT.md
- SECURITY.md
- 5.20.3 Trip Data Model Changes
- 3. API by feature (server truth)
- DESIGN (Phase 1, for Gokul's approval before any app code)
- apps.ts
- LLD — Project Repository Initial Setup & Architecture
- app/layout.tsx
- Ideas: One Platform, Many Apps
- REPO SECTIONS
- Supply Cancellation Execute — Success / Failure Event Flow
- CX Cancellation Flow
- 6.6 Refund Quote Entity
- Prompt Playbook — CLAUDE.md Workflow
- 🤖 System Architecture & Co-Worker Protocol
- Repo Kit (every repo must have these)
- Agent/sync-architecture.sh
- COLLABORATOR-DESIGN-CHAT-PROMPT.md
- prompts/PLANNING-CHAT-PROMPT.md

## God Nodes (most connected - your core abstractions)
1. `WORKLOG` - 20 edges
2. `4. Admin UI features (what the screens do)` - 16 edges
3. `compilerOptions` - 16 edges
4. `Ideas: One Platform, Many Apps` - 14 edges
5. `next` - 14 edges
6. `3. API by feature (server truth)` - 14 edges
7. `createClient()` - 12 edges
8. `🤖 System Architecture & Co-Worker Protocol` - 12 edges
9. `Cancellation — Temporal Workflow` - 10 edges
10. `LLD — Project Repository Initial Setup & Architecture` - 10 edges

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

## Communities (41 total, 8 thin omitted)

### Community 0 - "WORKLOG"
Cohesion: 0.07
Nodes (28): Agreed order, Architecture (agreed 2026-10-31), Cleanup scan: `/cleanscan` (Claude slash command), Commit + push everything: `/gitmd` (Claude slash command), Current focus, Decisions, Dropped, Far later (+20 more)

### Community 1 - "package.json"
Cohesion: 0.04
Nodes (44): appIsolation, apps, eslintConfig, dependencies, @gokulsaraswat/auth, @gokulsaraswat/config, @gokulsaraswat/ui, next (+36 more)

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

### Community 6 - "next"
Cohesion: 0.07
Nodes (36): CONTRACTS: admin, Expects (packages), Hub `config.json` publish location (agreed with Gokul 2026-10-31), Owns (Supabase, new platform project), TO BE UPDATED, `user_roles`, `permissions`, `user_permissions` (owned here; SQL: `supabase/migrations/20261031120000_roles_permissions.sql`, APPLIED 2026-10-31), nextConfig, @gokulsaraswat/config (+28 more)

### Community 7 - "admin"
Cohesion: 0.22
Nodes (8): admin, Build / lint (same as CI and Vercel), CI, Deploy (Vercel), Docs, License, Requirements, Run

### Community 8 - "WORKLOG: admin"
Cohesion: 0.25
Nodes (7): Blockers / requests to other repos, Current state (2026-10-31), Decisions (Gokul, 2026-10-31), Done, In progress / next, Reminders, WORKLOG: admin

### Community 9 - "1.4 Mermaid — Cancellation Sequence Diagrams"
Cohesion: 0.05
Nodes (37): 1.1 Scope, 1.2 Actors & Boundaries, 1.3 Functional Breakdown (Low-Level), 1.4.1 Discovery, 1.4.2 Quote, 1.4.3 Execute, 1.4.4 Callback & Workflow Completion, 1.4.5 Status Poll (+29 more)

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

### Community 17 - "Cancellation — Temporal Workflow"
Cohesion: 0.07
Nodes (29): 1.1 Purpose, 1.2 Key design decisions, 1.3 Workflow settings, 1. Overview, 2.1 Three-phase flow, 2.2 Multi-pod signal routing, 2. Architecture, 3.1 Step sequence (+21 more)

### Community 23 - "5.20.3 Trip Data Model Changes"
Cohesion: 0.07
Nodes (26): 5.20.1 Overview, 5.20.2.1 Overview, 5.20.2.2 Segment entries, 5.20.2.3 Ancillary entries, 5.20.2.4 Sample hold response (abbreviated), 5.20.2.5 Key principles, 5.20.2 Hold Response Changes, 5.20.3.1 Overview (+18 more)

### Community 24 - "3. API by feature (server truth)"
Cohesion: 0.08
Nodes (23): 1.1 Auth today (custom, NOT Supabase Auth), 1.2 Operation log (audit), 1.3 Shared conventions, 1. Cross-cutting, 2. Tables (Prisma, old Supabase project), 3. API by feature (server truth), 5. New admin: how each feature maps (proposal, for Phase 1), 6. Security findings in bestportofolio (+15 more)

### Community 25 - "DESIGN (Phase 1, for Gokul's approval before any app code)"
Cohesion: 0.22
Nodes (8): 1. Product, 2. Visual system, 3. Information architecture (routes), 4. Roles per screen (delegated admin, per spec answers), 5. Mobile (mobile-first), 6. Patterns (shared component kit, shadcn/ui style, copied into `src/components/ui`), 7. Layout options (pick one; prototypes), DESIGN (Phase 1, for Gokul's approval before any app code)

### Community 26 - "apps.ts"
Cohesion: 0.08
Nodes (33): ARCHITECTURE: admin, HLD, LLD, @gokulsaraswat/auth, react, HubHome(), Overview(), PortfolioHome() (+25 more)

### Community 28 - "LLD — Project Repository Initial Setup & Architecture"
Cohesion: 0.08
Nodes (24): 1.1 Purpose, 1.2 Tech Stack, 1.3 High-Level System Context, 1. Executive Summary & Tech Stack, 2.1 Gradle Multi-Module Layout, 2.2 Package Tree (ASCII), 2.3 Module Responsibilities, 2. Directory & Module Structure (+16 more)

### Community 29 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): src_app_globals, geistMono, geistSans, metadata, themeScript

### Community 30 - "Ideas: One Platform, Many Apps"
Cohesion: 0.13
Nodes (14): 10. Open questions, 11. Excellidraw opensource, 1. Vision, 2. Current state (checked in repos), 3. Framework, 4. Content & CMS, 5. Roles (super admin → app admins), 6. Shared packages (so "every component works everywhere") (+6 more)

### Community 31 - "REPO SECTIONS"
Cohesion: 0.14
Nodes (13): 1. platform (first), 2. admin, 3. gokulmobilize, 4. bestportofolio, 5. Progress (GSpace), 6. Markdown-studio  (TO BE UPDATED: scope still open, revisit after the first 5 repos), 7. checkers-gym-management  (TO BE UPDATED: scope still open, revisit after admin works), 8. gokul-omni-converter  (TO BE UPDATED: standalone, not part of the web platform) (+5 more)

### Community 32 - "Supply Cancellation Execute — Success / Failure Event Flow"
Cohesion: 0.18
Nodes (10): 1. Overview, 2. Actors, 3. Success Path, 4.1 Agent Action (Manual Queue), 4. Failure Path, 5. Flow Diagram, 6. Notes, ASCII (+2 more)

### Community 33 - "CX Cancellation Flow"
Cohesion: 0.22
Nodes (8): Actors, CX Cancellation Flow, Flowchart, Notes, Open Issue — `quote_id` on Execute, Phase 1 — Cancel Discovery (via Trips), Phase 2 — Refund Discovery (Quote), Phase 3 — Cancellation Execute

### Community 34 - "6.6 Refund Quote Entity"
Cohesion: 0.22
Nodes (8): 6.6 Refund Quote Entity, 6.6 Refund Quote Entity (Redis), Design principles, Field reference, Penalty fields, Quote API vs Redis (example), Redis JSON, Relationship to §6.5 Snapshot

### Community 35 - "Prompt Playbook — CLAUDE.md Workflow"
Cohesion: 0.25
Nodes (7): 1. Starting a New Folder / Project, 2. Starting with an Existing Project, 3. The "After-Command" Chaser, 4. Start / Debug Prompt Template, 5. Session Wrap-Up Prompt Template, 6. The Context Recovery Prompt (Anti-Hallucination Trigger), Prompt Playbook — CLAUDE.md Workflow

### Community 36 - "🤖 System Architecture & Co-Worker Protocol"
Cohesion: 0.29
Nodes (6): ⏱️ Communication Constraints (Zero Waste Mode), 📐 Engineering Guardrails, 🎨 Frontend Architecture, UI/UX & Motion Standard, 🛠️ Project Execution Modes (Personal vs. Organization), 🤖 System Architecture & Co-Worker Protocol, 📉 Token-Optimized Communication Mode

### Community 37 - "Repo Kit (every repo must have these)"
Cohesion: 0.33
Nodes (5): Definition of done (any step), Deploy-ready rules (every repo), Master docs (live in `platform/docs/`), Repo Kit (every repo must have these), Shared constants (from `@gokulsaraswat/ui`, same on every app)

### Community 38 - "Agent/sync-architecture.sh"
Cohesion: 0.70
Nodes (3): edge(), node(), sync-architecture.sh script

## Knowledge Gaps
- **362 isolated node(s):** `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas`, `1. Starting a New Folder / Project`, `2. Starting with an Existing Project` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 408 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `apps.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `react` connect `apps.ts` to `package.json`, `next`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `@gokulsaraswat/config` connect `next` to `package.json`, `apps.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `1. High-Level Design (HLD) Topology`, `2. Current Target Directory Tree`, `3. Low-Level Design (LLD) & SOLID Class Schemas` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WORKLOG` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._