# Portfolio + Admin + Astro program: plan v1 (for confirmation)

Workspace root, NOT in any git repo. Written 2026-11-25 after the one-round Q&A (Gokul: "yes for all recommended" + comments with
replies, likes, share). Status: DRAFT, to be confirmed next session; nothing is built until Gokul says "start".
Resume state: `REPO-UPGRADE-PROGRESS.md`. Original order and rules: `REPO-UPGRADE-PLAN.md` + the session prompt (gates, one repo per commit,
never apply migrations, never force-push, stage own paths only).

## 0. Decisions (all = recommended answers, 2026-11-25)
| # | Topic | Decision |
|---|---|---|
| 1 | Order | Step 0 portfolio fixes now -> 1 platform -> 2 admin -> 3 portfolio Astro rebuild -> 4 gokulmobilize, Markdown-studio, omni, GSpace |
| 2 | Framework | Public portfolio rebuilt in **Astro** (server output on Vercel, React islands) |
| 3 | Where | Same repo `bestportofolio`, branch `astro`, same Vercel project + domain; Next code removed after cutover |
| 5 | Admin | ALL portfolio admin moves to the `admin` repo (all 14 sections + new ones); Users -> roles screen, Backup -> JSON export, Logs -> shared audit log |
| 6 | Data | Migrate every row; samples/test rows arrive unpublished; JSON-in-strings become real columns/jsonb |
| 7 | MDX | Blog, course chapters, project write-ups; MD migrates as-is with a converter that flags `<`/`{`; starter components Callout, CodeTabs, Figure, Embed, Steps, FileTree |
| 8 | Extra features | Gokul lists them (pending) |
| 9 | Music | Own `<audio>` playlist (play/pause, prev/next, loop off/one/all, shuffle, title/artist, volume), click to start, remembers state, persists across pages, lazy load. Not Spotify/YouTube |
| 10 | Chat | Starter chips (admin-managed, hidden after first message), model follow-up chips (<=3, same response), greeting in admin, stop logging prompts (anonymous counts only), keep Gemini 2.5 Flash + RAG (re-indexed in new DB) |
| 11 | Stats | Admin-managed list (value, suffix, label, optional icon/description, order, enabled); desktop row of <=4, scroll-snap rail beyond/mobile; count-up once in view; no marquee; reduced motion = final numbers |
| 12 | Skills | One merged section: categories -> items (name, optional Simple Icons slug, optional primary flag); no % bars; skills editor in admin |
| 13 | Hero | Centered; rotating role line (fade/slide) from admin; "Open to work" chip toggle; CTAs from admin; `GET /gokul` request/response card with live role/stack/location; carousel -> About gallery; navbar drops "Home" |
| 14 | Look | Dark-first editorial-technical identity on the v2 foundation; opacity-built neutrals; red accent kept (AA-tuned); one variable grotesk + mono labels; prose ~660px; row lists for blog/snippets/courses; cards for projects with images; docs layout (TOC, prev/next) for posts/courses; legal = plain summary + Effective date; default theme = system; every deviation from v2 listed |
| 15 | Footer | Two tiers: groups Work / Writing / About / Elsewhere + side block (theme switch, now playing, copyright) + bottom row Privacy, Terms, Cookies, Accessibility, Sitemap, RSS; groups editable in admin |
| 16 | Effects | Drop custom cursor and the never-built particles setting; splash removed (skeletons) |
| 17 | Privacy/SEO | Phone off all public output; remove cookie banner + fix privacy text; RSS; per-page title/description/OG image; sitemap + robots with sitemap line |
| 18 | Comments | Moderation (pending -> approved) PLUS (new, 2026-11-25) a reply section: threaded replies, likes, share |
| 19 | Domain | Gokul connects gokulsaraswat.com to Vercel at cutover |
| 20 | Pace | Admin step on Opus 5.5 xhigh; gates as before |

## 1. Inputs still needed from Gokul (ask at the confirmation session)
1. Song list: title, artist, direct audio URL (or files to upload) per track; only tracks he has rights to publish.
2. Real stat numbers (replace or drop "98% System Uptime").
3. Extra features list (Ideas.md: books section, snippets as components, real-time scheduler project, chatbot for all apps, single login, deliverables tracker: in or out?) and any extra MDX components (Calculator needs a spec).
4. Comments details to confirm (recommended): replies one level deep (reply to a top comment; author replies badged "Author"); likes anonymous (one per device, server counts, rate-limited, no login); share = Web Share API on mobile, copy link, X and LinkedIn; likes + share also on posts/projects; replies go through the same moderation.

## 2. Steps

### Step 0: bestportofolio, current Next site (Opus 5.5 high) [main, one commit each]
- Phase A: `docs/FEATURES.md` = parity checklist for the rebuild (every page, API, admin section, SEO item) + baseline numbers (build time, per-route JS, node_modules, Lighthouse /, /blog, a project).
- Security fixes (P1, live): enforce roles server-side on content/messages routes; remove phone from `/api/profile` GET and JSON-LD; stop auto-publish writes in public GETs (move to a scheduled path or publish-time check); `/api/courses` public filter; stop logging visitor prompts and retrieved docs in `/api/chat`; rag-settings tab stops spending quota on mount.
- Cleanup (grep-proven): 18 unused packages, ~30 unused files (25 `components/ui/*`, loader, blog-card, project-card, operation-logs-panel, lib/supabase); music `preload="none"`. Delete list shown first.
- Repo kit fixes: CLAUDE.md private-files rule, docs/ARCHITECTURE.md (missing), pointer file replacing docs/master + docs/project + WORKLOG-PROJECT.md, stale WORKLOG lines.
- NO redesign of the Next app.

### Step 1: platform (Opus 5.5 high)
- `docs/CONTRACTS.md` first: portfolio schema in the NEW Supabase project (draft below), RLS intent (public read of published rows; writes by portfolio admins), storage buckets, RPCs.
- `@gokulsaraswat/config`: add portfolio content types/zod schemas shared by admin + Astro site.
- `@gokulsaraswat/mdx` v0: component registry (Callout, CodeTabs, Figure, Embed, Steps, FileTree), compile helper with an allow-list (no arbitrary imports/JS from DB content), React renderers usable from Next (admin preview) and Astro; MD->MDX lint/converter.
- v2 additions if needed (rail, count-up, chips, player controls) as gk- classes.

### Step 2: admin (Opus 5.5 xhigh) [SECURITY-CRITICAL: every SQL/RLS shown first; Gokul applies migrations]
- Supabase Auth Google login, `user_roles` (drafts exist), role checks vs RLS audit, loading.tsx/error.tsx everywhere, lazy per-app route groups.
- Portfolio section (parity with today's 14 sections + new): blogs (MDX editor + preview), blog ideas, projects, courses + chapter tree, snippets, messages inbox, comments moderation + author replies, todos, chat bot (chips, greeting, RAG ingest/status without spending quota), settings (profile, hero lines, CTAs, availability), skills, stats, playlist, footer links, audit log, JSON export.
- Migration script OLD (Prisma) -> NEW (Supabase): dry-run report first, idempotent, Gokul runs it; RAG `documents` re-embedded or copied.

### Step 3: bestportofolio Astro rebuild (Opus 5.5 high) [branch `astro`, Vercel preview, "merge" gate]
- Astro (server output, Vercel adapter), React islands only for: chat widget, music player (persisted across navigations via client router), search, comments/likes/share, theme switch.
- Pages: home (hero, stats rail, merged skills, featured projects, latest posts, courses), about (+ gallery), projects + detail, blog + post, courses + course/chapter, snippets, contact, privacy, legal pages, 404, RSS, sitemap, robots, per-page metadata + OG images.
- Endpoints: /api/chat (stream, Gemini + pgvector), contact, comments (create/reply/like, moderation), likes/share counts; rate limits.
- Design system per decisions 14-16; screenshots light/dark x desktop/mobile for every page; Lighthouse vs Step 0 baseline; FEATURES.md parity pass.
- Cutover: DNS (Gokul), env vars on Vercel, old DB shut down after a verification window; Next code removed in one commit.

### Step 4: remaining repos (as originally planned, phases A-E + gates)
gokulmobilize (Sonnet high) -> Markdown-studio (Sonnet high) -> gokul-omni-converter (Opus high) -> GSpace (Sonnet medium; adds MDX via `@gokulsaraswat/mdx`).

## 3. Draft schema for the NEW Supabase project (to be finalised in Step 1; nothing applied)
- `portfolio_profile` (single row: name, headline, bio, location, email_public, socials jsonb, resume_url, availability bool, avatar)
- `portfolio_hero_lines` (text, position, enabled) | `portfolio_stats` (value numeric, suffix, label, icon, description, position, enabled)
- `portfolio_skill_categories` (name, position) + `portfolio_skills` (category_id, name, icon_slug, primary, position)
- `portfolio_chat_starters` (text, position, enabled) | `portfolio_tracks` (title, artist, url, duration, position, enabled)
- `portfolio_footer_links` (group, label, href, external, position)
- `portfolio_settings` (key text pk, value jsonb) for the few real toggles (enable sections, chat greeting, theme default)
- `posts`, `post_ideas`, `projects`, `courses`, `course_chapters` (parent_id tree), `snippets`, `messages`, `todos`, `todo_history`
- `comments` (entity_type, entity_id, parent_id, name, body, status pending|approved|rejected, is_author, like_count, created_at) + `reactions` (entity_type, entity_id, visitor_hash, kind like, unique per visitor)
- `documents` (pgvector 768) + `match_documents` RPC (moved from the old project); `audit_log` (shared across apps)
- Storage: `portfolio-media` (images), `portfolio-audio` (tracks); public read, admin write.

## 4. Risks and how they are handled
- Live site must never break: Step 0 is small, reversible commits; the rebuild runs on a branch + preview; cutover only after the FEATURES.md parity pass.
- Data loss: migration is copy-only with a dry run; the old DB stays read-only until verified.
- MDX from DB executing code: compile with a component allow-list, no JS expressions/imports from content.
- Music rights: only Gokul-provided tracks he may publish.
- Limits/interruptions: every step ends committed + pushed and recorded in REPO-UPGRADE-PROGRESS.md and each repo's WORKLOG.md.
