# CONTRACTS: admin

What this repo exposes and expects. Master: platform/docs/CONTRACTS.md (the master wins if they differ). Updated: 2026-10-31.

## Expects (packages)
| Package | Version | Used for |
|---|---|---|
| `@gokulsaraswat/ui` | ^0.1.0 | `tokens.css` + `tailwind.css` imported in `src/app/globals.css` |
| `@gokulsaraswat/config` | 0.1.0 | `AppId` for the app list (`src/lib/apps.ts`) |
| `@gokulsaraswat/auth` | 0.1.0 | not installed yet (login/roles slice) |

Also: `@supabase/ssr` 0.12.x, `@supabase/supabase-js` 2.118.x.

Install: `.npmrc` with `${NODE_AUTH_TOKEN}` (read:packages).

## Owns (Supabase, new platform project)
### `user_roles` (migration + RLS owned here; NOT applied yet)
Columns/PK as master CONTRACTS: `user_id uuid` -> `auth.users(id)` on delete cascade, `app text` (app id or `'*'`), `role text` (`super_admin` iff `app = '*'`), PK `(user_id, app)`. Draft SQL: `docs/SUPABASE-SETUP.md` (review with owner before applying).

### Hub `config.json` publish location (agreed with Gokul 2026-10-31)
Supabase Storage public bucket `public-config`, object `hub/config.json`. Shape = `@gokulsaraswat/config` `HubConfig` (v1). Writes: super admins only. Not created yet.

### TO BE UPDATED
`content(app, slug, body)` and `app_config(app, key, value jsonb)` shapes, routes per app section, base path (admin has none so far).
