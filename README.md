# admin

Super admin for the gokulsaraswat platform: one login, app switcher, per-app admin sections, roles. Next.js 16 + Supabase Auth + Tailwind v4, hosted on Vercel.
Status: repo kit + placeholder page only (see `WORKLOG.md`). Plan: `docs/KICKOFF-PROMPT.md`. Master docs: [platform/docs](https://github.com/gokulsaraswat/platform/tree/main/docs).

## Requirements
- Node 24 (`.nvmrc`), npm.
- `NODE_AUTH_TOKEN`: GitHub classic token with `read:packages` only, to install private `@gokulsaraswat/*` from GitHub Packages (`.npmrc`). Export it in your shell before `npm install`/`npm ci`; npm does not read `.env.local`.

## Run
```bash
cp .env.example .env.local   # fill values; never commit
npm ci
npm run dev                  # http://localhost:3000
```

## Build / lint (same as CI and Vercel)
```bash
rm -rf node_modules .next && npm ci && npm run lint && npm run build
```

## Deploy (Vercel)
- Project: `gokul-admin` (URL `gokul-admin.vercel.app` until a domain exists). Framework preset Next.js; install `npm ci`, build `npm run build` (defaults).
- Env vars (Production + Preview): `NODE_AUTH_TOKEN` (read:packages only), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only). Supabase vars are needed from the login slice on.
- Not deployed yet.

## CI
`.github/workflows/ci.yml`: `npm ci`, lint, build on Node from `.nvmrc`. Installs `@gokulsaraswat/*` with `GITHUB_TOKEN`; each package must grant this repo read access (package settings > Manage Actions access).

## Docs
`CLAUDE.md` (agent rules), `AGENTS.md`, `WORKLOG.md`, `.claude-session.json`, `docs/CONTRACTS.md`, `docs/ARCHITECTURE.md`, `docs/SUPABASE-SETUP.md`, `COLLABORATORS.md`, `SECURITY.md`.

## License
All rights reserved. See `LICENSE`.
