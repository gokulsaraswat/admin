# PORTFOLIO ADMIN SPEC (Phase 0, read-only)

What the old portfolio admin does, as a SPEC for the new admin (WHAT data exists, HOW it is fetched/validated). Not a UI to port.
Source: `bestportofolio` @ `7168b56` (2026-10-31): `prisma/schema.prisma`, `src/app/api/**`, `src/proxy.ts`, `src/lib/*`, `src/components/admin/*`, `supabase/migrations/001_rag_schema.sql`.
Rule (Gokul): keep every feature; drop nothing without asking. "Proposal" lines are suggestions only; open items are in "Questions for Gokul".

## 1. Cross-cutting

### 1.1 Auth today (custom, NOT Supabase Auth)
- Table `AdminUser`: `username` (unique), `password` (scrypt `scrypt$N$r$p$salt$hash`), `role` (default `admin`), `permissions` (string), `totpSecret`, `totpEnabled`, `mustChangePassword`, `lastLoginAt`.
- `POST /api/auth` {username, password} -> HMAC-signed cookie `admin_session` (HttpOnly, SameSite=lax, 8 h, secret `AUTH_SECRET`). Payload {sub, username, role, mustChangePassword}. Legacy plaintext passwords are refused. Logs `login_success` / `login_failed`.
- `GET /api/auth` -> {authenticated, username, role, mustChangePassword}. `DELETE /api/auth` -> sign out (logs `logout`).
- `POST /api/auth/password` {currentPassword, newPassword}: needs current password; strength = >=12 chars, lower+upper+digit, not starting with admin/password/letmein/welcome/portfolio; must differ; clears `mustChangePassword`, re-issues cookie.
- `mustChangePassword` session may only call `/api/auth/password` (enforced in proxy + `requireAdmin`).
- `src/proxy.ts`: every mutating `/api/*` call needs a valid session except public writes `/api/contact`, `/api/comments`, `/api/auth`, `/api/chat`. In-memory rate limits per IP (POST): auth 10/15 min, chat 20/10 min, contact 5/h, comments 10/h. `/admin` responses get `X-Frame-Options: SAMEORIGIN`, `Cache-Control: no-store`.
- **TOTP is NOT implemented**: no code reads or verifies `totpSecret`; `totpEnabled` only shows a "2FA" badge. Nothing to migrate.
- **Roles/permissions are NOT enforced on the server**: `requireRole()` exists but no route calls it; every signed-in user (any role) can call every admin API, including user management.
- First admin: operator script `scripts/create-admin.mjs` (scrypt, role `admin`).
- New admin mapping: Supabase Auth (email+password, MFA TOTP optional) + `user_roles` (portfolio app: `admin` / `member`; Gokul = `super_admin`). Existing users re-invited + re-enrol (decided).

### 1.2 Operation log (audit)
- Table `OperationLog` {action, entityType, entityId, details, actor, createdAt}. `logOperation()` keeps only the newest 1000 rows (deletes older on every insert). `logError()` writes `error:<action>` with message + stack.
- Actor is mostly the literal `'admin'` (or `body.actor` from the client), not the signed-in user. Blog/project/course writes log inconsistently (courses: none; snippets: action `create`/`update`/`delete`/`error`).
- `GET /api/operation-logs?limit=` (admin, max 1000, newest first).
- Proposal: platform-wide `audit_log` written server-side with the real user id (Phase 1 "audit log" pattern). Ask: retention.

### 1.3 Shared conventions
- IDs: cuid strings. Slugs: `generateSlug(title)` (lowercase, strip non-word, spaces/underscores -> `-`); on update, title change without explicit slug regenerates the slug (blogs, projects, courses, chapters, snippets) -> public URLs change silently.
- JSON stored in TEXT columns: `Project.stack/screenshots/contributors/architectureDiagrams/embeds`, `BlogPost.resourceLinks`, `CodeSnippet.tabs`, `Profile.skills/certifications/carouselImages/typingLines/siteSettings`. Tags are comma-separated strings. Proposal: real `jsonb` / `text[]` in the new schema (decided at the data-migration step).
- Scheduled publish: `GET /api/blogs` and `GET /api/snippets` first flip `published=true` where `scheduledAt <= now` (a public read performs a write).
- Search uses Prisma `contains` (case-sensitive on Postgres).

## 2. Tables (Prisma, old Supabase project)
| Model | Key fields (beyond id/createdAt/updatedAt) |
|---|---|
| AdminUser | see 1.1 |
| Profile (single row) | name, shortname, avatar, occupation, company, email, phone, location, bio, tagline, resumeUrl, social URLs (twitter, linkedin, github, youtube, spotify, website, codechef, leetcode), codeReviewPhilosophy, agileExperience, skills/certifications/carouselImages/typingLines (JSON text), chatBotEnabled, siteSettings (JSON text). Defaults hold personal contact data. |
| BlogPost | title, slug (unique), excerpt, content, coverImage, tags, type (default `article`), embedUrl, embeds, behindTheScenes, published, scheduledAt, category, writtenBy, acceptedBy, resourceLinks (JSON [{label,url,description}]), status (default `published`) |
| BlogIdea | title, description, tags, status (idea/drafting/review/published), priority (low/medium/high), source, notes |
| Project | title, slug (unique), description (required), shortDesc, banner, website, downloadLink, repository, stack, screenshots, role, process, results, architectureDiagramUrl, architectureDiagrams (JSON [{title,url,description,type}]), dbSchemaUrl, adrContent, cicdSnippet, iacSnippet, observabilityUrl, testCoverageUrl, performanceMetrics, securityImplementation, swaggerUrl, terminalSessionUrl, behindTheScenes, videoUrl, featured, complexity (int, default 1), contributors (JSON), showTeam, embeds |
| Course | title, slug (unique), description, banner, embeds; has chapters |
| CourseChapter | title, slug, content, order, sectionName, chapterType (default `content`), parentId (self tree), linkedBlogSlug, linkedSnippetSlug, titleOverride; cascade-deleted with course |
| ContactMessage | name, email, subject, message, read, replied, repliedAt, replyNote |
| Todo | title, description, status (default `draft`), priority, entityType, entityId, assignee, remarks, dueDate (string), completedAt, archived; has history |
| TodoHistory | todoId, action, field, oldValue, newValue, actor (cascade) |
| Comment | name, email, content, entityType (blog/project/course/snippet), entityId (= slug) |
| CodeSnippet | title, slug (unique), description, type (default `code`), language, tags, category, content, tabs (JSON), comment, demoType, demoUrl, demoOutput, published, scheduledAt, includeInRag, embeds |
| OperationLog | see 1.2 |
| `documents` (Supabase SQL, not Prisma) | content, type (resume/blog/project/course/profile/general), source_id, source_title, metadata jsonb, embedding vector(768), HNSW index; RPC `match_documents(query_embedding, match_threshold, match_count, filter_type)` |
| `chat_logs` (Supabase SQL) | session_id, message, role (user/assistant). No code writes it (unverified beyond the API routes). |

## 3. API by feature (server truth)
Auth column: P = public, A = any signed-in admin session (role ignored).

### Blogs (`/api/blogs`, `/api/blogs/[id]`)
| Call | Auth | Behaviour / validation |
|---|---|---|
| GET `?slug=&published=&type=&category=&tag=&search=` | P | auto-publish due scheduled posts first; returns drafts too unless `published=true` is passed |
| POST | A | title required; slug = body.slug or from title; resourceLinks normalised to JSON array; does NOT set `status` (column default `published`) or `behindTheScenes`; logs `blog.create` |
| GET `[id]` | P | any post incl. drafts |
| PUT `[id]` | A | body spread straight into update (mass-assignment, any column); logs changed fields |
| DELETE `[id]` | A | logs `blog.delete` |

### Blog ideas (`/api/blog-ideas`, `[id]`)
| GET list `?status=&priority=&tag=&search=` | A | order status asc, createdAt desc |
| POST / PUT `[id]` | A | title required/non-empty; status/priority whitelisted (invalid -> default/unchanged); tags string or array -> comma string; logs create/update/status_change |
| GET `[id]` | **P** (list is A) | |
| DELETE `[id]` | A | |

### Projects (`/api/projects`, `[id]`)
| GET `?featured=` | P | |
| POST | A | title + description required; JSON fields normalised; `complexity` not settable on create |
| PUT `[id]` | A | body spread (mass-assignment) + JSON normalisation; logs fields |
| DELETE `[id]` | A | |

### Courses + chapters (`/api/courses`, `[courseId]`, `[courseId]/chapters`, `[chapterId]`)
| GET courses `?slug=` | P | list with chapter counts; by slug with chapters |
| POST course | A | title required; `embeds` ignored on create; no operation log |
| PUT/DELETE course | A | PUT = body spread; DELETE cascades chapters |
| GET chapters | P | top-level list incl. `children` |
| POST chapter | A | title required; order, sectionName, chapterType, parentId, linkedBlogSlug, linkedSnippetSlug, titleOverride |
| PUT chapter | A | whitelisted fields only (good pattern) |
| DELETE chapter | A | children of a deleted parent: no cascade defined on the self-relation (unverified behaviour) |

### Snippets (`/api/snippets`, `[id]`)
| GET `?slug=&published=&type=&language=&tag=&category=&search=&limit=` | P | auto-publish due scheduled; drafts returned unless `published=true` |
| POST | A | title required; `embeds` ignored |
| PUT `[id]` | A | whitelisted fields; cannot change `scheduledAt` or `embeds`; slug regenerates on title change |
| DELETE `[id]` | A | |

### Comments (`/api/comments`, `[id]`)
| GET `?entityType=&entityId=` | P | email not returned |
| GET `?all=true` | A | moderation list |
| POST | P | name+content+entity required; name<=80, email<=160 (+format), content 2..4000; spam heuristic (>3 links, keywords, char runs) -> 422; entity must exist (by slug) |
| PATCH `[id]` {content} / DELETE `[id]` | A | edit to redact / delete; logged |
No approval queue: comments are live immediately.

### Messages (`/api/contact`, `/api/messages`, `[id]`)
| POST /api/contact | P | name, email, message required; no length/format checks; not logged |
| GET /api/messages `?cleanup=true&retentionDays=` | A | optional delete of messages older than max(30, retentionDays or 90) days |
| PUT /api/messages {id, read?, replied?, replyNote?} | A | legacy |
| DELETE /api/messages {id} or {ids[]} or {bulk:'read'} | A | single, bulk by ids, delete all read |
| PATCH `[id]` {read?, replied?, repliedAt?, replyNote?} | A | replied=true sets repliedAt (now or given); false clears |
| GET `[id]` | see section 6 | single message |
| DELETE `[id]` | A | |

### Todos (`/api/todos`, `[id]`, `[id]/history`)
| GET `?entityType=&status=&includeArchived=` | A | order priority desc (string sort), createdAt desc |
| POST | A | title required; writes history `created` |
| PUT `[id]` | A | field diff -> TodoHistory rows; status `done` sets completedAt + archived; `archived:false` un-archives |
| DELETE `[id]` | A | |
| GET `[id]/history` | **P** | |

### Users (`/api/admin-users`)
| GET | A | id, username, role, permissions, totpEnabled, dates |
| POST {username, password, role?, permissions?} | A | **password stored as given (not hashed)** -> that user can never sign in (login refuses non-scrypt); default role `viewer` |
| PUT {id, role?, permissions?, password?} | A | password also stored unhashed |
| DELETE `?id=` | A | blocks deleting the last `admin` |

### Profile + site settings (`/api/profile`, `/api/settings`)
| GET /api/profile | P | whole row |
| PUT /api/profile | A | body straight into create/update |
| GET /api/settings | P | merges `siteSettings` JSON + mapped Profile fields |
| PUT /api/settings | A | keys mapped to Profile columns (name, email, location, avatarUrl, resumeUrl, github/linkedin/twitter/websiteUrl, youtube, spotify, heroTypingLines, chatBotEnabled); allow-listed keys into `siteSettings`: title, description, heroGreeting, heroCtaText, heroCtaUrl, primaryColor, accentColor, fontFamily, layoutStyle, enableAnimations, enableParticles, roundedCorners, siteUrl, ogImage, favicon, enableComments, enableRag, enableContact, enableBlog, enableProjects, enableCourses, enableSnippets, contactEmail, showVisitorCount, showGithubStats, enableCustomCursor, cursorMagneticSnap, enableAutoEmbeds, footerText, copyrightName, musicUrl, enableMusic; unknown keys dropped |
| GET /api/chat-status | P | {enabled: Profile.chatBotEnabled} |
Proposal: site settings -> `app_config(app='portfolio', key, value jsonb)`.

### Backup / restore (`/api/backup`)
| GET `?entities=blogs,projects,courses,snippets,messages,todos,profile,comments,users` | A | JSON download v2 {exportedAt, version, entities, data}; users without password hashes; omits blog ideas, operation logs, todo history |
| POST (JSON body or multipart `file`) | A | profile update/create; blogs/projects/snippets upsert by slug; courses update by slug, **chapters deleted and recreated (parentId dropped -> tree flattened)**; todos/comments **always created (duplicates on re-restore)**; messages/users not restored |

### RAG (`/api/ingest`, `/api/chat`)
| POST /api/ingest {text, type, sourceId?, sourceTitle?, metadata?} | A | Gemini `gemini-embedding-001` (768 dims) -> insert `documents` via REST with service-role key |
| DELETE /api/ingest {sourceId, type?} | A | delete documents by source |
| POST /api/chat {messages[]} | P | embeds last message, `match_documents` (threshold 0.20, count 5), streams `gemini-2.5-flash`; rate limited 20/10 min |
Admin UI part: see 4.x "RAG settings". Env: `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

### Misc
- `GET /api/` -> hello world. `GET /api/test`: debug route, drop (see section 6).

## 4. Admin UI features (what the screens do)
Source: `src/app/admin/page.tsx`, `src/components/admin/*` (line refs in brackets). Common to all: no URL routing (section = React state, reload -> dashboard), no server pagination (lists load fully, sort/filter client-side), no keyboard shortcuts, search re-fetches on every keystroke (blogs, ideas) with no debounce.

### 4.1 Shell, login, roles (`admin/page.tsx`, `admin-layout.tsx`)
- Flow: `GET /api/auth` -> login form (username, password, show/hide) -> if `mustChangePassword`: forced change form (current, new, confirm; client checks only new===confirm) -> shell. Logout = `DELETE /api/auth` -> `/`. No TOTP step.
- 14 sections: dashboard, blogs, blog-ideas, projects, courses, snippets, logs, messages, comments, todos, rag-bot, backup, users, settings. Light/dark toggle, mobile sheet sidebar, role badge for non-admins.
- Role -> visible nav (`rolePermissions` [78-84]): admin = all except **comments (bug: Comments screen unreachable for everyone)**; blog_editor = dashboard, blogs, blog-ideas, todos; project_editor = dashboard, projects, todos; course_editor = dashboard, courses, todos; viewer = dashboard; unknown role -> admin. Nav-only gating; per-user `permissions` JSON ignored.
- `/admin-access-denied` static 403 page, nothing links to it. `admin/error.tsx` boundary (retry / home).

### 4.2 Dashboard (`admin-dashboard.tsx`)
- Stat cards (click -> section): blogs, projects, courses, snippets, messages, logs. Counts come from `?limit=1`/`?limit=5`/`?limit=20` calls: blogs/projects/courses/messages ignore `limit` (count OK), **snippets honour it (count capped at 1)**, logs capped at 20.
- **Fake numbers**: "published" = count minus 20/10/30 %, Published/Drafts tiles = 80/20 %, "Categories" = 4, System Health card hardcoded ("SQLite + Prisma").
- Charts: content distribution donut, activity last 7 days (create/update/delete by substring of action; timezone day-shift bug), top 10 tags (blogs + snippets). Recent activity (5 logs), timeline (8 logs), "recently updated" list, quick actions (logs, backup, snippets, settings), export dashboard as JSON/CSV.

### 4.3 Blogs (`blog-manager.tsx`, `seo-preview.tsx`)
- List: checkbox, title + slug, type + category badges, first 3 tags, status (Published / Draft / Scheduled time), created date, actions (preview, edit, delete). Server search; client sort (title, status, created). Bulk publish / unpublish / delete (parallel, "X ok, Y failed").
- Editor (one dialog, Edit/Preview tabs with Markdown render): title (required), slug, type (article / youtube / spotify / tweet), embeds (`EmbedUrlInput` when type != article; Custom Embed dialog: URL `https?://` or `data:image|video`, or file upload stored inline as base64 data URL, >2 MB warns), resource links editor [{label,url,description}], excerpt, cover image URL, tags (comma), category (+8 suggestion chips), writtenBy "Maker", acceptedBy "Checker", content (Markdown), published switch, scheduledAt (datetime-local). Live Google-style SEO preview (title 60 / description 155 counters; URL lacks `/blog/` prefix).

### 4.4 Blog ideas (`blog-ideas-manager.tsx`)
- Stat cards per status (also filters; **counts wrong when filtered**), kanban columns per status when unfiltered (no drag-and-drop), search, status filter, sort (newest, oldest, priority, title).
- Card: title, high-priority flame, description (140 chars), tags, status, priority, date, source. Form: title (required), description, tags, status, priority, source, notes.
- **Promote to blog**: creates draft blog {title, excerpt=description, tags} then sets idea status `published` (2 calls, not atomic, no idea<->post link stored).

### 4.5 Projects (`project-manager.tsx`)
- List: title + shortDesc, stack (3 + N), badges (Featured, App if downloadLink, diagram count), date, actions (website, repo, edit, delete). Client search (title, shortDesc, stack); sort (title, featured, date).
- Editor sections: Basic (title*, slug, role, shortDesc, description* Markdown, SEO preview); Links & media (website, downloadLink, repository, banner, videoUrl, screenshots one URL per line, stack comma list); Technical deep-dive (architecture diagrams gallery: add/remove/reorder, {title, type hld/lld/dfd/sequence/erd/other, url, description}; legacy architectureDiagramUrl, dbSchemaUrl, adrContent, observabilityUrl, testCoverageUrl, swaggerUrl, terminalSessionUrl, cicdSnippet, iacSnippet, performanceMetrics, securityImplementation); Process & results (process, results, behindTheScenes); Team (showTeam, contributors editor); featured; complexity 1-3 stars (Simple Tool / Medium Project / Enterprise Level). **`embeds` has no input.** No URL validation.

### 4.6 Courses + chapters (`course-manager.tsx`)
- Two panes: course list (title, chapter count; sort title/date) and chapter tree of the selected course (expand/collapse, add child, edit, delete).
- Course form: title*, slug, description, banner URL. Chapter form: title*, sectionName, chapterType (content / hld / lld / api-design / code), slug (no auto-generation), order (number; default max+1), embeds, content source (custom Markdown | link published blog | link published snippet), titleOverride, Edit/Preview tabs.
- **Bug: linking a blog/snippet to a chapter is impossible from the UI** (mode derived from the slug, which is empty until a link exists [397-404, 538-546, 987]). Chapter count + course header not refreshed after edits. Reorder only by editing the number.

### 4.7 Snippets (`snippet-manager.tsx`)
- List (table + mobile cards): title + description + category, type, language, tags, line count, status (Published / Draft / scheduled), actions (preview, edit, delete). Client search (title, tags, language, description), type filter, sort only by updatedAt asc/desc.
- Editor: title* (auto-overwrites slug on every keystroke, also on edit), slug, type (code / hld / lld / api-design / db-design or custom), language (32 options), tags, category (+chips), description, embeds, main code (line count), extra tabs [{name, language, code}], internal notes (`comment`), demo (none / image / link -> demoUrl / output -> demoOutput; "image" has no input), published, includeInRag, scheduledAt.
- Preview dialog: code + tabs with copy buttons, demo, notes. Bulk handlers exist but no UI. Save/delete errors only in console.

### 4.8 Comments (`comment-manager.tsx`, unreachable in nav)
- List of cards: name, email, entity badge, link to the public page; search (name, content, entityId); type filter with counts; inline edit (non-empty); delete with confirm. No approve/reject, no sort, no pagination.

### 4.9 Messages (`message-manager.tsx`)
- Header counts (total, unread, replied); filter all / unread / replied; sort name / read / date. Table: status, from (name, email, Replied badge), subject, preview (80 chars), date, actions.
- Open = auto-mark read. Actions: reply via email (sets replied, opens `mailto:` with "Re: subject" + canned body), toggle read, mark/clear replied, internal reply note (save), delete, "delete all read". No search. Retention cleanup (`?cleanup=true`) is not called by the UI.

### 4.10 Todos (`todo-manager.tsx`)
- Statuses draft / in-progress / review / done ("Completed"); priorities low / medium / high; type (entityType) general / blog / project / course / profile / media / content. Form: title*, description, status, priority, type, assignee, due date (`entityId` has no input).
- Active list: status pills with counts, search (title, description, assignee), sort (title, status, priority, created), inline status select, quick status cycle, overdue in red, Mark Complete (asks remarks) -> archived. Completed section (lazy): completed date, remarks, edit, view history (field diffs), delete. Actor always `'admin'`.

### 4.11 Users (`user-manager.tsx`)
- Roles admin / blog_editor / project_editor / course_editor / viewer; permission checkboxes blogs, projects, courses, snippets, todos, messages, settings, backup, logs, users (stored, never enforced). List: username, created, permission count, role, "2FA" badge. Create (username, password, role default viewer, permissions), edit role + permissions, delete (native confirm). No password reset, no TOTP setup, no search.

### 4.12 Backup (`backup-manager.tsx`)
- Pick entities (blogs, projects, courses, snippets, messages, todos, profile, comments, users; select all), counts per entity (profile/comments/users show 0), export JSON download, restore from `.json` file with confirm (merge). No scheduled backups.

### 4.13 Settings (`profile-settings.tsx`)
- Tabs: Profile (name, title, bio, email, location, avatarUrl, resumeUrl, github/linkedin/twitter/website URLs), Hero (greeting, typing lines list with live preview, CTA text + URL), Appearance (theme light/dark/system client-only; primaryColor, accentColor pickers; animations, particles, rounded corners), Features (enable blog / projects / courses / snippets / comments / RAG / contact, visitor count, GitHub stats, contactEmail), Experiments (custom cursor + magnetic snap, auto embeds, music + URL), SEO (siteUrl, ogImage, favicon), Footer (footerText, copyrightName).
- Dirty tracking, Undo, sticky mobile Save. Bugs: typing-line edits don't mark dirty; `fontFamily`, `layoutStyle` have no inputs. `enableRag` overlaps `chatBotEnabled`.

### 4.14 AI chat bot / RAG (`rag-settings.tsx`)
- Toggle chatbot (`Profile.chatBotEnabled`, optimistic). "Check config" sends a real chat request and reports OK even on errors.
- Manual ingest: type (resume / blog / project / course / profile / general), sourceId, sourceTitle, content*.
- Batch ingest: all / profile / blogs / projects, mode add or replace (replace deletes by source first); builds text from fields; progress + per-type result. Profile batch likely throws (iterates an object). Snippets/courses never batch-ingested; `includeInRag` on snippets is unused here. Setup text mentions OpenAI (stack uses Gemini).

### 4.15 Operation logs (`operation-logs-viewer.tsx`; `operation-logs-panel.tsx` is dead)
- "N total · M shown", search (action, entityType, details, actor, entityId), filters (action, entity type), sort newest/oldest (label always "newest"), expandable rows (id, entity id, timestamp, actor, details), refresh. Action names are inconsistent across the app (`blog.create`, `create`, `blog_idea_create`, `login_success`, `error:*`).

## 5. New admin: how each feature maps (proposal, for Phase 1)
Nothing here is decided beyond the KICKOFF decisions; Phase 1 designs it, Gokul approves.
| Old feature | New admin (proposal) | Needs |
|---|---|---|
| Custom login, sessions, forced password change | Supabase Auth (email + password, invite, reset email, optional MFA TOTP); one login for all apps | Phase 2a |
| Roles admin/*_editor/viewer + permissions JSON | `user_roles` per app (`admin` / `member`, Gokul `super_admin`); enforced by RLS on every table, not only the nav | Phase 2b; finer per-section rights only if Gokul wants them (Q1) |
| Users screen | Platform "Users & roles" screen (invite, set role per app, remove) for super admins | Phase 2b |
| Operation logs | Platform `audit_log` written server-side with real user id, filterable per app | Q3 |
| Dashboard | Per-app overview with REAL counts (published/draft/scheduled) + recent activity from audit log | after data migration |
| Blogs, ideas, projects, courses+chapters, snippets | Portfolio section, one route per entity (deep links), data tables (sort/filter/bulk, server pagination), forms with zod (same rules as section 3), Markdown/MDX editor + preview | after portfolio data migration |
| Comments | Portfolio section, reachable (fixes nav bug); optional approval queue (Q2) | after migration |
| Messages | Portfolio section; keep read/replied/note/mailto/bulk delete; retention as a setting (Q4) | after migration |
| Todos | Platform-wide todos (per app via entityType) or portfolio-only (Q5) | after migration |
| Backup / restore | Per-app JSON export/import with dry-run preview; Supabase handles DB backups (Q6) | after migration |
| Settings (siteSettings + profile fields) | `app_config(app='portfolio', key, value jsonb)` + profile record; same tabs | after migration |
| RAG / chatbot | Portfolio section; ingest from published content incl. snippets with `includeInRag` + courses; real config check | after migration |
| Embeds as base64 data URLs in text columns | Upload to Supabase Storage, store URL (Q7) | after migration |

## 6. Security findings in bestportofolio
Several findings (one critical). Details kept local-only in `docs/private/SECURITY-FINDINGS.md` (git-ignored) until fixed in bestportofolio; then moved here.

## 7. Answers (Gokul, 2026-10-31)
1. Users: Gokul + editors. **Delegated admin**: super admin makes portfolio admins; portfolio admins grant permissions inside portfolio to editors. Needs per-app permissions (finer than admin/member) -> `role_permissions` (or equivalent) is now REQUIRED before multi-user portfolio sections; `user_roles` policies must let an app's admins manage that app's rows (never `super_admin`).
2. Comments: live immediately, moderate after (spam filter kept).
3. Audit log: keep 90 days.
4. Messages: never auto-delete (manual single / bulk / all-read only).
5. Todos: one platform-wide board, todos link to any app, filter per app.
6. Backup restore: dry-run preview, then update existing rows (no duplicates).
7. Uploads: Supabase Storage, store URL only.
8. Slugs: auto from title while draft; locked after publish (manual edit only).
9. Blog ideas + posts: one pipeline idea -> drafting -> review -> published, linked.
10. Old admin bugs: fixed in the new admin only.
11. Security findings: fixed now in a separate bestportofolio session (`portfolio-security`); Gokul rotates the old project's DB password.
