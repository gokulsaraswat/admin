# Supabase setup for the platform (owner checklist + DRAFT SQL)

Status: DRAFT prepared by the planning chat, 2026-10-31. Nothing has been applied. The admin chat reviews the SQL with Gokul BEFORE running it.
Never paste keys or passwords into any chat. Keys go only into `.env.local` (git-ignored) and Vercel env vars.

## Decision: which project (UPDATED 2026-10-31, supersedes "reuse portfolio's")
Gokul: create a NEW Supabase project for the platform now; migrate the portfolio's data into it LATER as a separate planned step.
- New project = admin, user_roles, config bucket, future content/app_config. Clean, no Prisma tables, so no Prisma drift risk.
- The portfolio public site + its old admin keep using the OLD project (untouched) until the migration step.
- Portfolio migration (later, own plan, ask Gokul): create the tables in the new project from `bestportofolio/prisma/schema.prisma` (`prisma db push` to the new DIRECT_URL), dump/restore data, switch the portfolio's DATABASE_URL/DIRECT_URL + keys, verify the site, then enable RLS + policies per table. Old project stays as backup until verified.
- Gym (checkers-gym-management) has its own project: shared vs separate still open.
DATA LAYER (decided): admin = supabase-js + RLS (not Prisma).

## Gokul does in the Supabase dashboard (no secrets in chat)
1. Create a NEW project: supabase.com > New project (free tier is fine). Suggested name: `gokul-platform`. Pick the region closest to you/users, set a strong DB password and save it in your password manager (never in chat or git). Note the project ref.
1b. New-project options (Gokul asked 2026-10-31; labels may differ slightly in the UI): database type = standard Postgres (not OrioleDB/experimental); GitHub repository = SKIP for now (Supabase's GitHub integration/branching is optional and can be connected later to `admin` once migrations exist); Enable Data API = ON (supabase-js needs it); Automatically expose new tables and functions = OFF (safer: nothing is reachable until we GRANT it explicitly in a migration); Enable automatic RLS = ON (every new table starts locked).
2. Authentication > Providers: enable Email (password). Authentication > Sign In / Providers settings: DISABLE public sign-ups for now (admins are invited; visitors do not log in). Revisit when comments/likes need visitor accounts.
3. Authentication > Users > Add user: create your own admin user (email + strong password). Copy that user's UUID (needed to bootstrap super_admin).
4. Authentication > URL Configuration: Site URL = admin's local URL for now (http://localhost:3000); add Vercel URLs later.
5. Project Settings > API: you will need `Project URL` and the `anon` public key (client) and `service_role` key (SERVER ONLY, never in browser code, never committed). Put them in admin/.env.local and later in the Vercel project's env vars.
6. Storage: create a PUBLIC bucket for the hub config (proposed name `public-config`, file `hub/config.json`). Writes allowed only to super admins (policy below). AGREED 2026-10-31: bucket `public-config`, path `hub/config.json` (recorded in admin docs/CONTRACTS.md; platform master CONTRACTS update requested).
7. Also create a GitHub token (classic) with `read:packages` and set env `NODE_AUTH_TOKEN` locally for installing `@gokulsaraswat/*` (see platform/docs/CONTRACTS.md `.npmrc`).
8. Optional: authorize the Supabase connector in Claude (`/mcp` in an interactive Claude terminal) so a chat can inspect the schema. Claude cannot do the sign-in itself.

## DRAFT SQL (review with Gokul; run in the SQL editor or as a migration in the admin repo)
```sql
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  app     text not null check (app in ('*','hub','admin','portfolio','gspace','studio','gym')),
  role    text not null check (role in ('super_admin','admin','member')),
  primary key (user_id, app),
  check ((role = 'super_admin') = (app = '*'))
);
alter table public.user_roles enable row level security;
-- project has auto-expose OFF, so grant explicitly (RLS still decides what rows are visible):
grant select, insert, update, delete on public.user_roles to authenticated;

-- security definer avoids RLS recursion when policies check roles
create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles
                 where user_id = auth.uid() and app = '*' and role = 'super_admin');
$$;

grant execute on function public.is_super_admin() to authenticated;

create policy "read own roles or all if super admin" on public.user_roles
  for select using (user_id = auth.uid() or public.is_super_admin());
create policy "super admin manages roles" on public.user_roles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Bootstrap the first super admin ONCE, as postgres in the SQL editor (replace the uuid with yours):
-- insert into public.user_roles (user_id, app, role) values ('<YOUR-USER-UUID>', '*', 'super_admin');

-- Storage: public read of the config bucket, writes only by super admins
create policy "public read config" on storage.objects
  for select using (bucket_id = 'public-config');
create policy "super admin writes config" on storage.objects
  for all using (bucket_id = 'public-config' and public.is_super_admin())
  with check (bucket_id = 'public-config' and public.is_super_admin());
```
Notes: matches platform/docs/CONTRACTS.md (`user_roles` columns, PK, `super_admin` iff `app='*'`). No `role_permissions` table yet (decided). Test RLS with a non-admin user before trusting it.

## Env vars (admin/.env.example must list these; values only in .env.local / Vercel)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `NODE_AUTH_TOKEN` (read:packages).
