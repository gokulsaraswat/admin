# PLATFORM-DOCS: shared docs live in the platform repo

This repo no longer keeps copies of the shared docs (the old `docs/master/`, `docs/project/` and `WORKLOG-PROJECT.md` were stale duplicates).
The single source of truth is `platform/docs`:

| Doc | Local checkout (workspace) | GitHub |
|---|---|---|
| RULES (global agent rules; synced here as `RULES.md`) | `../platform/docs/RULES.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/RULES.md |
| CONTEXT (vision, repo map; synced here as `docs/CONTEXT.md`) | `../platform/docs/CONTEXT.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/CONTEXT.md |
| CONTRACTS (shared interfaces, hub `config.json`, packages) | `../platform/docs/CONTRACTS.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/CONTRACTS.md |
| BACKLOG master index (P0/P1 + cross-repo items) | `../platform/docs/BACKLOG.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/BACKLOG.md |
| WORKLOG (master status of all repos) | `../platform/docs/WORKLOG.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/WORKLOG.md |
| DESIGN-BRIEF (design system v2, per-repo flavors) | `../platform/docs/DESIGN-BRIEF.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/DESIGN-BRIEF.md |
| REPO-KIT (files every repo must have) | `../platform/docs/REPO-KIT.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/REPO-KIT.md |
| PROMPTS (prompt playbook) | `../platform/docs/PROMPTS.md` | https://github.com/gokulsaraswat/platform/blob/main/docs/PROMPTS.md |

All shared docs: https://github.com/gokulsaraswat/platform/tree/main/docs

Repo-local docs stay here: `docs/ARCHITECTURE.md`, `docs/CONTRACTS.md`, `docs/BACKLOG.md`, `docs/FEATURES.md`, `docs/SUPABASE-SETUP.md`, `WORKLOG.md`.
