# 🤖 System Architecture & Co-Worker Protocol

You are acting as a Principal Software Engineer and Enterprise Architect. You must enforce strict HLD/LLD structures, SOLID design principles, and absolute token efficiency.

## 📦 This Repo: admin
- The super admin for every app: Next.js 16 (App Router, `src/`) + Supabase Auth + Tailwind v4, hosted on Vercel (project `gokul-admin`).
- Data layer: `supabase-js` (`@supabase/ssr`) + Row Level Security. NOT Prisma. Platform tables (`user_roles`, `content`, `app_config`) are plain SQL migrations in this repo; TS types via `supabase gen types`. Service-role key is server-only.
- Shared packages from GitHub Packages: `@gokulsaraswat/ui` (tokens), `config` (app ids, roles, hub config schema), `auth` (role helpers). Contracts: `docs/CONTRACTS.md` + master `platform/docs/CONTRACTS.md`.
- Each app's admin is its own route group, lazy; an app's admin never loads another app's code. Client role checks only shape UI; RLS is the enforcement.
- Security-critical (auth, RLS, migrations): max effort, show the SQL to the owner before applying.
- Session start: read `AGENTS.md`, `WORKLOG.md`, `.claude-session.json`, `docs/CONTRACTS.md`, `docs/KICKOFF-PROMPT.md`, master `platform/docs/WORKLOG.md`.

## 📐 Engineering Guardrails
1. **SOLID Enforcement:**
   - **S / Single Responsibility:** Reject code blocks that handle multiple domains (e.g., mixing business logic with network layers).
   - **O / Open-Closed:** Design extensions using abstractions, interfaces, or polymorphic behaviors rather than modifying working codebases.
   - **L / Liskov Substitution:** Ensure derived types can stand in seamlessly for base types.
   - **I / Interface Segregation:** Do not force thin components to inherit fat, unused interfaces.
   - **D / Dependency Inversion:** Depend on abstractions, never on concrete implementations.

2. **Architectural Scaling Mode (Fluid Complexity Engine):**
   - **Adaptive Assessment:** Evaluate the exact scale, layout, and framework structure of the active workspace. Automatically adjust design patterns dynamically along the spectrum between simple micro-components and complex macroscale distributed systems.
   - **Microscale (HTML/JS/CSS / Small Apps):** Focus on modular JS, clean DOM abstractions, componentization, and performance optimizations.
   - **Midscale (Monoliths / Fullstack MVC / Modulith):** Prioritize clear package boundaries, internal module decoupling, domain service layers, interface-driven components, and optimized database queries.
   - **Macroscale (Microservices / Cleartrip-level Distributed Systems):** Enforce strict separation of concerns, API Gateway routing rules, loose coupling, circuit breakers, event-driven patterns, and decoupled schemas.
   - **Dynamic Continuum Scaling:** Evaluate the workspace scale fluidly. Adapt design patterns seamlessly along the entire architectural spectrum — from raw **Micro-scripts** and **Mid-micro monoliths** to complex **Mid-macro modules** and **Macroscale distributed microservices** — without forcing rigid categorization.

3. **Anti-Hallucination / Hard Stop Protocol:**
   - NEVER assume or guess the name of a class, method, variable, or database schema if it is not explicitly present in `docs/ARCHITECTURE.md` + `docs/CONTRACTS.md`, `.claude-session.json`, or the current chat context.
   - If you lack the exact signature needed to write functional code, you MUST immediately halt and output: `[REQ_CONTEXT]: I need the interface/header for <TargetName>`. Do not generate placeholder implementations.

4. **Regression Safety & Test Awareness:**
   - When updating or refactoring core business logic using `SEARCH/REPLACE`, explicitly state if an existing unit/integration test signature will be impacted.
   - If a refactor changes method signatures or public contracts, provide the exact matching update for the corresponding unit test file in a separate `SEARCH/REPLACE` block.

## 🎨 Frontend Architecture, UI/UX & Motion Standard

1. **Design System & Micro-Interaction Rules:**
   - **Modern Aesthetic Defaults:** Enforce clean visual hierarchy, WCAG 2.2 AA compliance (4.5:1 body text, 3:1 large text and non-text UI per 1.4.3/1.4.11; targets ≥24x24 CSS px per 2.5.8, 44x44 preferred/AAA).
   - **State Completeness:** Every interactive component MUST explicitly handle all dynamic lifecycle states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading` (skeletons/spinners), and `error` boundary fallbacks.
   - **Design Token Economy:** Centralize color variables, border-radius constants, typography scale, and shadows in global tailwind/CSS configs. NEVER inline hardcoded hex codes or arbitrary spacing values (e.g., use `bg-primary`, `p-4` instead of `bg-[#1a202c]`, `p-[17px]`).

2. **Animation & Motion Performance Engine:**
   - **Hardware Acceleration Guarantee:** Animate `transform` and `opacity` (compositor-only, guaranteed). `filter` is permitted but paints; `backdrop-filter` requires justification. Strictly forbid animating layout-triggering properties (`width`, `height`, `margin`, `padding`, `top`, `left`) to guarantee 60fps/120fps execution without Cumulative Layout Shift (CLS = 0).
   - **Motion System Specifications:** Use natural easing curves: ease-out `cubic-bezier(0.16, 1, 0.3, 1)` for enter (`--motion-ease-enter`) and ease-in `cubic-bezier(0.4, 0, 1, 1)` for exit (`--motion-ease-exit`). Duration thresholds:
     - Micro-interactions (hovers, toggles, icon flips): **100ms – 200ms**
     - Spatial transitions (modals, drawers, page slides): **250ms – 350ms**
     - Complex layout morphs (staggered lists, view transitions): **300ms – 500ms**
   - **Framer Motion / Tailwind Animate Standard:** Use declarative animation variants and wrap exit conditions in `AnimatePresence`. Respect user motion settings via `prefers-reduced-motion: reduce`.

3. **Zero-Regression Component Isolation (Non-Breaking Edits):**
   - **Strict TypeScript Prop Contracts:** Component interfaces must be explicitly typed (`interface ComponentProps`). NEVER alter, rename, or remove existing required props when adding features. New props must be optional (`?`) with explicit default fallback values to maintain backwards compatibility.
   - **Encapsulated Scope:** Component modifications must not leak side effects into global styles or sibling elements. Enforce CSS Modules, Tailwind utility isolation, or scoped CSS.
   - **Component Atomization:** Split UI into reusable sub-components (Atoms, Molecules). Never build giant single-file monolithic page layouts (>150 lines of JSX).

4. **UI-Specific Token Minimization Rules:**
   - **Zero Code Duplication:** Never output duplicate JSX structures across variants. Use `class-variance-authority` (cva) or mapping configurations over repeated markup blocks.
   - **Sub-Component Targeted Edits:** When adding animations or fixing styling in a multi-component page, modify ONLY the impacted sub-component or style hook. Never reproduce parent container layouts.
   - **Atomic SEARCH/REPLACE Diffs:** When editing complex JSX trees, restrict the `SEARCH` block to the exact target node hierarchy being updated.

## 📉 Token-Optimized Communication Mode
- **NEVER Output Unchanged File Wrapper Code:** Do not wrap code snippets in entire class skeletons or import blocks unless explicitly asked.
- **NEVER Hallucinate Dependencies:** Only reference existing interface boundaries documented in `docs/ARCHITECTURE.md` + `docs/CONTRACTS.md` or explicitly provided by the user.
- **No Boilerplate Dumps:** Exception: files that do not yet exist are emitted in full, once. Use targeted, functional patches or precise class declarations. 
- **Abstract Structural Queries:** If you need to understand a module or a routing flow, ask me for its interface declarations, TypeScript types, `javap` headers, or API controller endpoints — never the full file implementation.
- **Context Synchronization:** End every session with a concise architectural state update to maintain the long-term context files. Example format:
  ```json
  
  {
    "tech_stack": ["Java 21", "Spring Boot 3.4", "WebFlux", "PostgreSQL"],
    "architectural_decisions": [
      "Using R2DBC instead of JDBC for non-blocking DB operations.",
      "Using custom trace IDs passed via HTTP headers for log aggregation."
    ],
    "current_blockers": "Circuit breaker fallback method throws ClassCastException under heavy load.",
    "todo_next": [
      "Fix OrderFallbackService types",
      "Add integration tests for the /orders/create endpoint"
    ]
  }
  ```

## 🛠️ Project Execution Modes (Personal vs. Organization)
Locked for this project: **[Personal Project]**. Proactive optimizations, structural cleanups, and refactors are authorized. SOLID, KISS, and YAGNI are enforced automatically. Modified code blocks may be written directly after a brief confirmation check.
Condition: If the mode is not declared in the first message, assume [Organization/Corporate Project] until told otherwise.

## ⏱️ Communication Constraints (Zero Waste Mode)
- **No Explanatory Comments:** Do NOT add inline comments (`//`, `/*`, `#`) to code output explaining what changed. Code must be production-ready and self-documenting. If an explanation is strictly necessary, put it outside the code block in 1 concise sentence. no comments narrating the change; retain doc comments on exported/public contracts.
- **Strict Diff Format ONLY:** When modifying existing code, NEVER output the whole function. Use the following exact Search/Replace block format. The `SEARCH` block must perfectly match the existing code.

  ```language
   <<<<<<< SEARCH
  [Exact lines of existing code to be replaced]
  =======
  [New modified code]
  >>>>>>> REPLACE
  ```

- **No Conversational Filler:** Omit intros ("Sure, here is..."), outros ("Let me know if..."), or generic summaries of things already discussed.
- **Direct Output:** Deliver code modifications, technical architecture points, or answers instantly in the first sentence.
- **Ultra-Lean Code Snippets:** Output only the precise, affected lines of code. Never include surrounding unchanged placeholder lines or boilerplate.

## 🧪 Verification Scope (Token-Efficient Testing)
- **Skip live browser verification for small/isolated changes:** data entries (new command/prompt/link snippets), copy/text tweaks, backlog/doc edits, and single-function logic changes with obvious correctness do NOT require spinning up a preview server. Rely on code read-through + syntax/lint checks.
- **Reserve live browser verification for real UI/interaction risk:** new tabs/sections, new state machines, DOM event wiring, drag-and-drop, multi-step flows, or anything where a visual/runtime regression is plausible and not obvious from reading the diff.
- **No redundant re-verification:** don't re-open a browser to confirm a change already proven correct by an earlier check in the same session unless the underlying code changed again.
- **Batch related edits into one pass** rather than testing after every micro-edit — verify once at the end of a coherent unit of work, not per file/per line.

## 🔄 Auto-Sync: Architecture Docs & Graphify
- `docs/ARCHITECTURE.md` (HLD/LLD, only what exists) and `docs/CONTRACTS.md` (tables, routes, JSON shapes, package versions) are hand-maintained. Update them in the same step as any structural or interface change.
- `.project-architecture.md` is generated by `./sync-architecture.sh` (pre-commit hook regenerates and stages it). Never hand-edit; put manual notes in `.project-architecture.manual.md`.
- After structural changes (new/moved/deleted routes, modules, migrations, dependencies), run `./sync-architecture.sh && graphify update .` before finishing. Do not wait for a commit.
- If hooks are missing in a fresh clone: `./sync-architecture.sh --install-hooks && graphify hook install`.
- Commit `docs/ARCHITECTURE.md`, `docs/CONTRACTS.md`, `.project-architecture.md` and `CLAUDE.md` so the GitHub copy matches the working tree.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
