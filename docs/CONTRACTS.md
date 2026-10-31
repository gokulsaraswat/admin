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
### `user_roles`, `permissions`, `user_permissions` (owned here; SQL: `supabase/migrations/20261031120000_roles_permissions.sql`, APPLIED 2026-10-31)
| Table | Columns | Rules |
|---|---|---|
| `user_roles` | `user_id uuid` -> `auth.users` (cascade), `app text` (`*` or app id), `role text`, `created_at` | PK `(user_id, app)`; `super_admin` iff `app='*'` (matches master CONTRACTS) |
| `permissions` | `app`, `key` (`<area>.view|edit|publish`), `label` | catalog, PK `(app, key)`, changed only by migrations; portfolio has 18 keys |
| `user_permissions` | `user_id`, `app`, `permission`, `granted_by` (default caller), `created_at` | PK `(user_id, app, permission)`; FK `(user_id, app)` -> `user_roles` (cascade); FK `(app, permission)` -> `permissions` |

SQL helpers for every app's policies (authenticated only): `is_super_admin()`, `has_app_role(app, min_role)`, `has_permission(app, permission)` (true for that app's admins and super admins).
Who can change what: super admin = all; app admin = only `member` rows + permissions of their own app; members = read own rows only. Last super admin cannot be removed (trigger). Test: `supabase/tests/roles_rls_test.sql` (rolls back).

### Hub `config.json` publish location (agreed with Gokul 2026-10-31)
Supabase Storage public bucket `public-config`, object `hub/config.json`. Shape = `@gokulsaraswat/config` `HubConfig` (v1). Writes: super admins only. Not created yet.

### TO BE UPDATED
`content(app, slug, body)` and `app_config(app, key, value jsonb)` shapes, routes per app section, base path (admin has none so far).
