# NEXT SESSION: context, prompt and plan (workspace root, not in git)

Saved 2026-11-26. Read this first in the next chat.

## 1. Paste this as the first message of the new chat
```
You are the orchestrator for my repos in this folder (platform, bestportofolio, admin, GSpace, gokulmobilize,
gokul-omni-converter; Markdown-studio is owned by its own session). First read, in order: NEXT-SESSION.md,
REPO-UPGRADE-PROGRESS.md (tail), REPO-UPGRADE-AGENT-RULES.md, PORTFOLIO-ADMIN-ASTRO-PLAN.md, platform/docs/UPGRADE-PROGRAM.md,
platform/docs/DESIGN-BRIEF.md. Then run git status + git log -5 in every repo and tell me anything not yours.
Continue the plan in NEXT-SESSION.md section 3, priority: admin, bestportofolio, GSpace, gokulmobilize, then platform
packages, then omni. Use one background agent per repo (each told to read REPO-UPGRADE-AGENT-RULES.md), stop only for
real blockers. Never apply SQL, never release npm packages or merge redesign branches without my OK. Commit + push each
unit and update WORKLOG.md + platform/docs/UPGRADE-PROGRAM.md. Coordinate with other sessions via SendMessage
(sign-in session owns auth code; Markdown-studio session owns Markdown-studio).
```
Model: Opus 5.5 high (admin: xhigh). gokulmobilize + GSpace agents can use Sonnet 5.5 high to save limit.

## 2. Context in 12 lines
- Goal: every repo gets A inventory, B bugs, C speed, D real redesign (branch, merge only on "merge"), E docs; nothing may break.
- Design system v2 released (@gokulsaraswat/ui 0.2.0, platform/docs/DESIGN-BRIEF.md). Flavors: Instrument (admin, omni),
  Atelier (gokulmobilize), Margin (Markdown-studio, GSpace). Portfolio: own look on v2.
- Portfolio program (all answers = recommended): all admin moves to admin repo; data to the new Supabase project; public site
  rebuilt in Astro on branch `astro`; MD -> MDX (@gokulsaraswat/mdx); chat chips, playlist player, merged skills, editable
  stats, centered hero with rotating line + GET /gokul card, comments with replies/likes/share + moderation, two-tier footer.
- Portfolio design: 3 proposals judged; **Signal** won (identity 8, a11y 7, engineering 8). Proposals + fixtures are on branch
  `astro` (worktree .worktrees/bestportofolio-astro). Final design not built yet (must-fix list in section 4).
- Assumptions in force: playlist starts with today's single track; stats keep today's 4 values; comments = 1-level replies,
  anonymous likes, Web Share/copy/X/LinkedIn; no extra features until Gokul lists them; MDX starter components only.
- Pending inputs from Gokul: song list (title, artist, URL), real stat numbers (98% uptime?), extra feature list.
- Sign-in/auth everywhere is done by the "Gspace embed page links" session (auth/config 0.2.0). Ask it before touching auth.
- Hook fix (fast pre-commit sync-architecture.sh) is in all 7 repos.
- bestportofolio: Prisma back to 6.19 (03972c2); Vercel was rate limited, deploys resume on next push.

## 3. Plan per repo (next steps, in order)
### admin (Opus xhigh) - priority 1
1. Phase A: docs/FEATURES.md (routes, server actions, RPCs, roles), baseline (build, per-route JS, lint, typecheck, tests), kit fixes.
2. Phase B: backlog bugs + security review: every route/action role check vs RLS/RPC in supabase/migrations; lazy route groups;
   loading.tsx/error.tsx everywhere. SQL fixes only as NEW files marked NOT APPLIED + docs/SQL-REVIEW.md.
3. Phase C: speed.
4. Portfolio SQL drafts from platform CONTRACTS "portfolio data contract" (tables, RLS, storage, RPCs) - NOT applied.
5. After Gokul releases config+mdx: portfolio admin section (all 14 old sections + skills, stats, hero lines, chat chips,
   playlist, footer links, comment moderation/replies, MDX editor) + migration script old DB -> new (Gokul runs it).
6. Phase D: redesign on redesign/admin (Instrument flavor). Review.
### bestportofolio (Opus high) - priority 2
1. Phase B security (one commit each): server-side role helper next to lib/require-admin.ts; Comments in admin nav (F1);
   /api/profile + JSON-LD without phone; no auto-publish writes in public GETs; no prompt logging in /api/chat; rag-settings
   test button; remove CookieConsent + fix privacy text; robots.txt sitemap + disallow; GlobalKeyboardShortcuts (F2) decide.
2. Message the sign-in session: bestportofolio free for Google/GitHub on /admin login (built on the new role helper).
3. Phase C cleanup: 18 unused deps + ~30 unused files (grep proof), music preload none; numbers before/after.
4. Branch `astro`: build design/final from Signal (section 4), then the Astro rebuild (pages, islands, Supabase reads, MDX,
   endpoints), Vercel preview, parity check against docs/FEATURES.md, cutover only on Gokul's OK.
### GSpace (Sonnet high) - priority 3
1. Phase A: FEATURES.md, baseline, kit fixes (CLAUDE.md fix committed), fix backlog row GSP-D-002 column order.
   src/files UNTOUCHED; compare "JSONs copy" vs "JSONs" by name/checksum and report to Gokul only. Leave My-thoughts.md.
2. B bugs, C speed, D redesign (Margin) on redesign/GSpace, review. MDX after @gokulsaraswat/mdx is released.
### gokulmobilize (Sonnet high) - priority 4
1. Phase C speed (incl. sign-in island weight; keep sign-in behaviour), numbers before/after.
2. Phase D redesign (Atelier) on redesign/gokulmobilize; MOB-I-003/004/005; android:sync must stay green (never sign/publish).
3. Review + open P3 bugs MOB-B-005/006/007, MOB-I-006, MOB-D-002.
### platform (Opus high)
1. Add portfolio zod schemas to @gokulsaraswat/config (now 0.2.0 -> next minor), changeset only.
2. New @gokulsaraswat/mdx v0.1 (safe DB MDX: no import/export/expressions, registry Callout, CodeTabs, Figure, Embed allow-list,
   Steps, FileTree; lint + escape helpers), changeset only. Security review of the sanitiser.
3. Ask Gokul to OK the release; then admin + astro + GSpace can consume.
### gokul-omni-converter (Opus high) - paused by Gokul
1. When resumed: pop stash@{0} (customtkinter<6 pin, utf-8 stdout) after verifying; smoke_test.py green; Phases A-E;
   redesign through ui/kit.py with GK_INSTRUMENT.
### Markdown-studio - owned by its own session (MARKDOWN-STUDIO-PLAN.md). Do not touch; coordinate only.

## 4. Final portfolio design must-fix list (Signal)
Role line: no overflow at 390/320, sequential exit/enter (no crossfade overlap), pause button + pause on hover/focus/hidden tab.
Request card: real data at once, JSON wraps on phones (pre-wrap, overflow-wrap:anywhere), role value bound to rotating line.
No red in syntax highlighting; red = action/state only; ink focus ring; dark filled buttons white on deeper red (AA).
Two-tone headings in at most 2 sections; dark paper warmer graphite (~#18171A).
Chat: loading/streaming/error states, role=log aria-live, question stays visible. Player: error state, next in compact,
play/pause in footer now-playing, expanded sheet traps focus + Escape. Mobile menu sheet (dialog/popover). 44px touch targets.
Comments list before form; mobile TOC + post-index disclosures; named like buttons with aria-pressed; pending/reply copy.
Skills as icon + text (mono glyph when no icon). Count-up reserves width. overflow-wrap on titles/comments/chips/URLs.
Empty admin lists render no section; projects without image use rows. Fonts self-hosted subsets <= 100 KB with metric fallbacks.
Theme switch vanilla JS (no React); small vanilla modules <= 10 KB; chat hydrates on click, player on idle with persistence.
Icons as inline sprite; color-mix compiled to hex; static nav/footer; ?still switch; contrast.mjs fails CI on any AA miss.
Grafts: p3 skills layout, TOC like/comment counts, "Was this useful?", project data columns; p2 two-level stats labels,
Ctrl K search, availability dot pings 3x, mobile stacked project table, src/ partials -> Astro components.
Deliver design/PORTFOLIO-DESIGN.md + design/final/* for every page type, screenshots light/dark at 1440/390/320.
