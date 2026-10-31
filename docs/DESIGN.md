# DESIGN (Phase 1, for Gokul's approval before any app code)

Status: APPROVED layout 2026-10-31: **Option A (Rail)**, Gokul. Prototype: `docs/design/prototypes/a-rail.html`. Inputs: KICKOFF Phase 1, `docs/PORTFOLIO-ADMIN-SPEC.md` (features + answers), references Vercel, Linear, Supabase Studio, Stripe; "working features first".

## 1. Product
- Subject: one owner's platform of apps (hub, portfolio, gspace, studio, gym). Admin = the place where content, people and config of every app are managed.
- Users: Gokul (super admin, daily, desktop + phone), app admins (manage one app and its people), editors (only the sections granted).
- Primary job: find an item fast, change it safely, see what changed and who did it.

## 2. Visual system
- Base: `@gokulsaraswat/ui` tokens unchanged (neutral greyscale, oklch, light + `.dark`), Geist Sans / Mono, `--radius` 0.625rem, motion tokens (150/300/400 ms, 0 under reduced motion).
- The one identity element: **app colour**. Each app gets a hue used ONLY for its app mark, the active-app indicator and its charts. Everything else stays neutral, so the colour always means "which app am I in".
  | App | Accent (oklch) |
  |---|---|
  | platform (users, audit, todos) | neutral `--primary` |
  | hub | `0.62 0.17 250` blue |
  | portfolio | `0.60 0.13 165` green |
  | gspace | `0.58 0.20 300` violet |
  | studio | `0.72 0.15 75` amber |
  | gym | `0.62 0.19 30` red-orange |
  Implemented as `--app-accent` set on the app's layout; contrast checked >= 3:1 on both themes for non-text marks.
- Density: comfortable on phone (44 px targets), compact tables on desktop (36 px rows). Status as text + shape, never colour alone.

## 3. Information architecture (routes)
```
/login                       Supabase Auth (email + password, reset, optional TOTP)
/                            Overview: apps you can access, items needing attention (unread messages, scheduled posts, open todos)
/account                     Your profile, password, two-factor
/platform/users              People + roles (super admin: all apps; app admin: own app only)
/platform/audit              Audit log (90 days), filter by app / user / action
/platform/todos              One todo board, todos linked to any app
/hub/config                  Hub tiles -> publishes public-config/hub/config.json
/portfolio/posts             Blog pipeline: idea -> drafting -> review -> published (ideas merged in)
/portfolio/posts/[id]        Editor (Markdown/MDX + preview, SEO, schedule, links, embeds)
/portfolio/projects(/[id])   Projects
/portfolio/courses(/[id])    Course + chapter tree (link blog/snippet as chapter)
/portfolio/snippets(/[id])   Snippets (tabs, demo, RAG flag)
/portfolio/comments          Moderation (live, edit/delete)
/portfolio/messages          Contact inbox (read, replied, note, mailto; never auto-deleted)
/portfolio/chatbot           RAG: toggle, ingest, re-index
/portfolio/settings          Site settings tabs (profile, hero, appearance, features, SEO, footer) -> app_config
/portfolio/backup            Export / import with dry-run preview
/gspace, /studio, /gym       "Not connected yet" until those apps have data
```
- Each app = its own route group + layout, lazy loaded; an app's admin never imports another app's code.
- Every list and item has a URL (deep links, back button, reload keeps place). Filters/sort/page live in the query string.

## 4. Roles per screen (delegated admin, per spec answers)
| Screen | super_admin | app admin (that app) | editor (member + granted permission) |
|---|---|---|---|
| Overview, Account | yes | yes (own apps) | yes (own apps) |
| Platform users | all apps, can make app admins | own app: invite, remove, grant permissions; cannot grant super_admin or admin of other apps | no |
| Audit log | all | own app | no |
| Todos | all | own app | own app, if granted |
| App sections (posts, projects, ...) | all | all of own app | only granted sections |
| App settings, backup, chatbot | all | own app | only if granted |
| Hub config | yes | hub admin | no |
- Proposed portfolio permissions (finalised with the Phase 2b SQL): `posts`, `projects`, `courses`, `snippets`, `comments`, `messages`, `settings`, `chatbot`, `backup`; each `view` or `edit` (+ `publish` for posts/snippets). RLS enforces them; the UI only hides what RLS would refuse.

## 5. Mobile (mobile-first)
- Phone: one column. App switcher + sections in a bottom bar / sheet (exact form depends on the chosen option). Tables become cards (title, status, date, one primary action); bulk select via long-press or a "Select" mode.
- Editor on phone: Write / Preview as tabs, sticky Save bar.
- Tablet up: sidebar(s) visible; desktop adds split views and keyboard shortcuts.

## 6. Patterns (shared component kit, shadcn/ui style, copied into `src/components/ui`)
- Data table: server pagination + sort + filter via URL, column visibility, row select + bulk actions with a result summary ("12 published, 1 failed"), sticky header, card layout on phone.
- Forms: validate with the shared zod schema on the client (live, inline errors) AND again in the server action. 2026-10-31: `@hookform/resolvers` failed to install (peer conflict via @typeschema/effect), so small forms (Hub config) use `schema.safeParse` + React state; adopt react-hook-form only when a form needs it. Schemas shared with the server action (one schema = client + server validation, same rules as spec section 3). Inline errors under fields, dirty tracking, "Unsaved changes" guard.
- Data: TanStack Query; optimistic updates for toggles (publish, read, replied) with rollback; skeletons that match the final layout; no spinners for lists.
- Command palette (Cmd/Ctrl+K): jump to any app/section, search items by title, run actions ("New post", "Switch to dark").
- Dark mode: system default + toggle, stored per user.
- Audit log: every write logs {user, app, action, entity, before/after summary} server-side.
- Empty states say what to do next ("No posts yet. Write your first post"). Errors say what failed and how to fix it, with retry.
- Toasts name the action that happened ("Published", "Deleted 3 messages"), with Undo where cheap.

## 7. Layout options (pick one; prototypes)
Same content in all three (portfolio posts list, light/dark, desktop/mobile):
- **A. Rail**: thin app rail (coloured app marks) + section sidebar + content. Closest to Supabase Studio / Linear. Fast switching between many apps; most chrome.
- **B. Header**: top bar with breadcrumb app switcher (`Gokul / Portfolio / Posts`) + horizontal section tabs, full-width content. Closest to Vercel. Most content space; app switch is a dropdown.
- **C. Split**: one sidebar listing apps as expandable groups + list/detail split (select a row, preview/edit on the right). Closest to Linear inbox / Stripe detail. Fastest for reviewing many items (messages, comments, posts).
Open them: `python3 -m http.server 4310` in the repo root (or the `design` entry in `.claude/launch.json`), then http://localhost:4310/docs/design/prototypes/a-rail.html (links to B and C bottom-right). Static HTML on the real tokens; data is sample text. Interactions: status chips, search, row select + bulk bar, Cmd/Ctrl+K palette, theme toggle, B app menu, C open a post; resize to phone width for mobile.
Decision (Gokul, 2026-10-31): **A · Rail**. Desktop: app rail (coloured marks, platform at top) + section sidebar + content. Phone: top bar (app mark, search, theme) + bottom tabs (Apps, top sections, More) + card lists. B and C kept only as reference.
