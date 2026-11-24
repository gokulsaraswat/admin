# CONTRACTS: admin

What this repo exposes and expects. Master: platform/docs/CONTRACTS.md (the master wins if they differ). Updated: 2026-11-25.

## Expects (packages)
| Package | Version | Used for |
|---|---|---|
| `@gokulsaraswat/ui` | ^0.1.0 | `tokens.css` + `tailwind.css` imported in `src/app/globals.css` |
| `@gokulsaraswat/config` | 0.1.0 | `AppId` for the app list (`src/lib/apps.ts`) |
| `@gokulsaraswat/auth` | 0.1.0 | `getUserRoles`, `hasRole`, `isSuperAdmin` in `src/lib/session.ts` |

Also: `@supabase/ssr` 0.12.x, `@supabase/supabase-js` 2.118.x.

Install: `.npmrc` with `${NODE_AUTH_TOKEN}` (read:packages).

## Expects (Supabase Auth settings)
- Providers: email/password and Google (same Google OAuth provider GSpace uses).
- Redirect URLs allow-list: `http://localhost:3001/auth/callback` and the production admin `https://<admin domain>/auth/callback`. Route `GET /auth/callback?code=...&next=/path` exchanges the code; `next` must be a relative path starting with `/`.

## Owns (Supabase, new platform project)
### `user_roles`, `permissions`, `user_permissions` (owned here; SQL: `supabase/migrations/20261031120000_roles_permissions.sql`, APPLIED 2026-10-31)
| Table | Columns | Rules |
|---|---|---|
| `user_roles` | `user_id uuid` -> `auth.users` (cascade), `app text` (`*` or app id), `role text`, `created_at` | PK `(user_id, app)`; `super_admin` iff `app='*'` (matches master CONTRACTS) |
| `permissions` | `app`, `key` (`<area>.view|edit|publish`), `label` | catalog, PK `(app, key)`, changed only by migrations; portfolio has 18 keys |
| `user_permissions` | `user_id`, `app`, `permission`, `granted_by` (default caller), `created_at` | PK `(user_id, app, permission)`; FK `(user_id, app)` -> `user_roles` (cascade); FK `(app, permission)` -> `permissions` |

SQL helpers for every app's policies (authenticated only): `is_super_admin()`, `has_app_role(app, min_role)`, `has_permission(app, permission)` (true for that app's admins and super admins).
Who can change what: super admin = all; app admin = only `member` rows + permissions of their own app; members = read own rows only. Last super admin cannot be removed (trigger). Test: `supabase/tests/roles_rls_test.sql` (rolls back).

### `access_requests` + RPCs (owned here; SQL: `supabase/migrations/20261125120000_access_requests.sql`, NOT APPLIED yet)
Invite-only access for every app. Master copy (what consumers such as GSpace code against): platform/docs/CONTRACTS.md "access_requests".
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `user_id` | uuid -> `auth.users` (cascade) | requester |
| `app` | text | `hub`, `admin`, `portfolio`, `gspace`, `studio`, `gym` |
| `email`, `name` | text, text null | copied from `auth.users` (`email`; `raw_user_meta_data` `full_name` or `name`) |
| `status` | text | `pending` (default), `approved`, `denied` |
| `requested_role` | text | `member` (default) or `admin`; `request_access` always writes `member` |
| `created_at`, `decided_at`, `decided_by` | timestamptz, timestamptz null, uuid null -> `auth.users` (set null) | |
Unique `(user_id, app)`. RLS: select own rows or `has_app_role(app, 'admin')`; clients have no insert/update/delete.
RPCs (security definer, `authenticated` only):
- `request_access(p_app text) returns access_requests`: pending member request for the caller; returns the existing row unchanged if any. Errors: 42501 not signed in, 22023 unknown app.
- `decide_access_request(p_id uuid, p_approve boolean, p_role text default 'member') returns access_requests`: caller must be admin of the request's app; `p_role='admin'` needs super admin. Approve upserts `user_roles` and sets `approved`; deny sets `denied` (not allowed once approved). App admins cannot change an existing admin row. Errors: P0002 not found / not your app, 42501 not allowed, 22023 bad input.
Test: `supabase/tests/access_requests_test.sql` (rolls back).
- `list_app_members(p_app text) returns table (user_id uuid, role text, email text, name text, created_at timestamptz)` (SQL: `supabase/migrations/20261125130000_app_members.sql`, NOT APPLIED yet): security definer, stable, `authenticated` only; caller must be admin of `p_app` (or super admin), else 42501. Rows: `user_roles` of `p_app` + super admins without a row there (role `super_admin`), email/name from `auth.users` (`full_name`, else `name`). Ordered by role rank, then email. Test: `supabase/tests/app_members_test.sql` (rolls back).
- Remove a member: client `delete from user_roles where user_id = $1 and app = $2` (no RPC). RLS: app admin deletes only `member` rows of their app, super admin any row; anything else deletes 0 rows. Last super admin protected by trigger. The user's `access_requests` row stays `approved`.

### Hub `config.json` publish location (agreed with Gokul 2026-10-31)
Supabase Storage public bucket `public-config`, object `hub/config.json`. Shape = `@gokulsaraswat/config` `HubConfig` (v1). Writes: super admins only. Not created yet.

### TO BE UPDATED
`content(app, slug, body)` and `app_config(app, key, value jsonb)` shapes, routes per app section, base path (admin has none so far).
