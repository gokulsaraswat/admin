# SQL-REVIEW: admin migrations

Plain-language review of `supabase/migrations/` (read 2026-11-26). Nothing here was applied or changed. Status of each file: `docs/FEATURES.md` "Migrations".
Verdict: **no blocking problem found in any file; no fix migration is needed.** Notes below are low-risk points to confirm or accept.

## 20261031120000_roles_permissions.sql (applied)
Checked: who can read, add, change and delete roles and permissions, and whether an app admin can raise their own rights.
- App admins can only add, change or delete `member` rows of their own app (`role = 'member'` in `using` and `with check`); they cannot promote anyone or touch another admin. Only a super admin can.
- An app admin cannot move a row into an app they do not admin (the `with check` repeats the admin test on the new `app`).
- `user_permissions` has no update grant; a grant needs a `user_roles` row for that app (foreign key), so deleting the role removes the grants.
- All helper functions are `security definer` with `search_path = ''` and are callable only by `authenticated`.
- The last super admin cannot be demoted or deleted, even by deleting the auth user (trigger + advisory lock).
Notes:
1. An app admin can change `user_id` on a member row (moves that membership to another user). This is no wider than what they can already do by deleting it and inserting a new one. Accept.
2. `permissions` and `user_roles` have no audit trail (who changed a role, when). Only `granted_by` exists, on `user_permissions`. Consider an audit table later (needs Gokul).

## 20261031130000_public_config_bucket.sql (not applied)
- Public bucket, 64 KB limit, JSON only. No anon select policy, so the bucket cannot be listed. Writers need `config.edit` for the first folder name.
- A file in the bucket root has no first folder, so only a super admin passes. A folder for an app without a `config.edit` permission is writable only by that app's admins.
- Note 3: `allowed_mime_types` is enforced by Storage, not by these policies; keep the server-side `hubConfigSchema` check (already in `publishHubConfig`).

## 20261125120000_access_requests.sql (not applied)
- Clients can only read the table; writes go through `request_access` and `decide_access_request`.
- `decide_access_request`: only an admin of that request's app can decide; `admin` grants and changing an existing admin need a super admin; an approved request cannot be denied later; the row is locked (`for update`) so two admins cannot race.
- Note 4: `request_access` still creates a pending row for someone who already has a role in that app. An admin approving it as `member` is refused when the person is an admin, so no escalation, but the request is noise. Optional: return the existing role instead.
- Note 5: `email` and `name` are a snapshot from request time and can go stale. Accept.

## 20261125130000_app_members.sql (not applied)
- Only admins of the app (or super admins) can call it.
- Note 6: every app admin can see the email of every super admin (rows with `app = '*'` are included on purpose). Confirm that is intended; if not, filter to `r.app = p_app`.

## 20261125140000_app_converter.sql (not applied)
- `is_app_id()` replaces the hard-coded lists; constraints only widen. `request_access` keeps the same checks. Existing rows stay valid.
- Note 7: the function must keep `execute` for `public` (check constraints call it as the inserting role); do not add a revoke later.

## Decisions (2026-11-26, Gokul: "you decide")
- Note 2 (no audit trail for role changes): accepted for now; add an audit table in a new migration when the portfolio admin section needs it (the Logs section is planned there).
- Note 4 (`request_access` for someone who already has a role): accepted; no escalation is possible and the request is only noise. Revisit with the access-requests UI polish.
- Note 6 (app admins see super-admin emails in `list_app_members`): accepted as intended: an admin needs to know who the super admins are to ask for access changes.
No fix migration is written. Applying the four unapplied files is still Gokul's step in the SQL editor, in file-name order.
