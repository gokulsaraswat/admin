# Rules for every upgrade agent (workspace root, NOT in git; read fully before any action)

Owner: Gokul. Session: unattended multi-repo upgrade. Context files (read-only for agents): REPO-UPGRADE-PROGRESS.md,
PORTFOLIO-ADMIN-ASTRO-PLAN.md, REPO-UPGRADE-PLAN.md (all in this folder). Never edit them. Never read or copy PRIVATE-*.md or

## Hard rules
1. Work ONLY in the repo (and branch/worktree) named in your task. Windows + Git Bash: use "/d/Projects/Personal/Goku Repos/<repo>".
2. Another Claude chat ("Gspace embed page links") OWNS sign-in/auth in every repo: never edit auth/sign-in/session/identity
   code or Supabase auth config, platform packages/auth or packages/config, or anything in admin/GSpace unless your task says so.
3. Before touching a repo and before EVERY commit: git fetch, git status, git log -5, pull --rebase if behind. If there are
   uncommitted changes you did not make (ignore a line-ending-only .project-architecture.md diff), STOP: return status "blocked".
4. SCOPE GUARD: do only what your stage says. Never change dependency versions, framework/ORM majors, build tooling or configs
   outside that scope, even if something looks broken. If something outside scope is broken, record it as a blocker with evidence.
   Never restore/checkout/reset files you did not change. Never delete branches, stashes or worktrees.
5. Install from the lockfile: npm ci (export NODE_AUTH_TOKEN=$(gh auth token -u gokulsaraswat) in the same command; never echo it).
   Only run npm install when your stage changes dependencies, and then commit package.json + lockfile together.
6. NO existing feature, route, API, prop, data shape, keyboard shortcut or workflow may break. Prove it after every unit of work:
   build, lint, typecheck, tests, smoke tests that exist; report exact commands and numbers.
7. One logical change per commit; message "type(scope): what"; body ends with:
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   material, generated next-env.d.ts or the Next agent-rules AGENTS.md rewrite unless your task is about them.
8. Never force-push, never --no-verify, never amend pushed commits. Phases A, B, C, E push to main; redesign goes to its branch,
   pushed, NEVER merged.
9. Deletions pre-approved ONLY with grep evidence of zero use (imports, side-effect/dynamic imports, require, configs, scripts,
   tests, docs, string references, runtime asset paths, SW precache lists). Never delete data, user content, media, employer
   material or anything uncertain: list it under needs_gokul. Put the evidence in the commit body.
10. Docs in the same commit as the change: WORKLOG.md, docs/BACKLOG.md (IDs per RULES.md section 4), docs/ARCHITECTURE.md,
    docs/CONTRACTS.md when structure/interfaces change.
12. Undecided choices: least risky recommended option; record under "Assumptions" in WORKLOG.md and in your return.
13. bestportofolio deploys to Vercel production from main and Vercel is currently rate limited ("retry in 24 hours"): commits
    will not deploy today; verify locally with npm ci + npm run build + typecheck + lint instead, and say so.

## UI work
- Load the frontend-design skill first. Follow DESIGN-BRIEF.md exactly for the repo's flavor. WCAG 2.2 AA, visible focus, reduced
  motion, touch targets >= 44px on touch, loading/empty/error states, light + dark, desktop + 390px mobile.
- Screenshots: "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --mute-audio
  --window-size=1440,1000 --virtual-time-budget=8000 --screenshot=<png> <url>. Chrome enforces ~500px min width: for 390px wrap
  the page in <iframe style="width:390px;height:1400px;border:0"> and shoot at --window-size=520,1400. Save under
  C:\Users\amanp\AppData\Local\Temp\claude\3964e6fcf5b08a1e\d999f1f5-24a6-47f6-8b1a-43741a842dc3\scratchpad\shots\<repo>\ and LOOK at
  each one (Read tool) before claiming it looks right.

## Approved kit fixes (do in phase A if still present)
(1) CLAUDE.md: replace the paragraph under "## Standing rule: keep tracking files current" with exactly: "At the end of every task
and PRIVATE-TODO.md live only at the workspace root (outside every repo): update them there, never copy them into a repo and never
commit them (gitignored; RULES.md section 7)."
(2) Replace docs/master/, docs/project/ and WORKLOG-PROJECT.md with ONE file docs/PLATFORM-DOCS.md pointing to platform/docs
(RULES, CONTEXT, CONTRACTS, BACKLOG master index, DESIGN-BRIEF, REPO-KIT, PROMPTS) and
https://github.com/gokulsaraswat/platform/tree/main/docs; grep and update references first.
(3) Create docs/ARCHITECTURE.md if missing (only what exists).

## Return (final message)
JSON-like summary: repo, stage, status (done|partial|blocked|skipped), summary (<=250 words), commits (hash + subject, pushed),
verification (commands + results), numbers (before/after), assumptions, blockers, needs_gokul, next. Be honest about anything
unfinished or unverified.
