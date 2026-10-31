-- Phase 2b: platform roles + per-app permissions (delegated admin).
-- Model (docs/DESIGN.md section 4, spec answer 1):
--   super_admin (row app='*')  -> everything, the only one who makes app admins
--   admin of app X             -> manages X's members and their permissions, all of X's data
--   member of app X            -> only what user_permissions grants in X
-- RLS is the enforcement; the UI only hides what RLS would refuse.
-- Project setting "auto-expose new tables" is OFF, so every grant below is explicit.
-- NOT APPLIED until Gokul approves. Test: supabase/tests/roles_rls_test.sql (rolls back).

-- ── Tables ──────────────────────────────────────────────────────────────────

create table public.user_roles (
  user_id    uuid not null references auth.users (id) on delete cascade,
  app        text not null check (app in ('*', 'hub', 'admin', 'portfolio', 'gspace', 'studio', 'gym')),
  role       text not null check (role in ('super_admin', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (user_id, app),
  check ((role = 'super_admin') = (app = '*'))
);
comment on table public.user_roles is 'Who can access which app, and at what level. Contract: platform/docs/CONTRACTS.md.';

-- Catalog of grantable permissions per app. Changed only by migrations (no write policy).
create table public.permissions (
  app   text not null check (app in ('hub', 'admin', 'portfolio', 'gspace', 'studio', 'gym')),
  key   text not null check (key ~ '^[a-z_]+\.(view|edit|publish)$'),
  label text not null,
  primary key (app, key)
);

-- A member's granted permissions inside one app. Needs a user_roles row for that app.
create table public.user_permissions (
  user_id    uuid not null,
  app        text not null,
  permission text not null,
  granted_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, app, permission),
  foreign key (user_id, app) references public.user_roles (user_id, app) on delete cascade,
  foreign key (app, permission) references public.permissions (app, key) on delete cascade
);
create index user_permissions_app_idx on public.user_permissions (app);
create index user_roles_app_idx on public.user_roles (app);

alter table public.user_roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_permissions enable row level security;

-- ── Helper functions (security definer: read user_roles without RLS recursion) ──

create function public.role_rank(r text) returns int
language sql immutable set search_path = '' as $$
  select case r when 'super_admin' then 3 when 'admin' then 2 when 'member' then 1 else 0 end;
$$;

create function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and app = '*' and role = 'super_admin'
  );
$$;

-- True if the caller is super admin, or has role >= p_min in p_app.
create function public.has_app_role(p_app text, p_min text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid())
      and (app = '*' or app = p_app)
      and public.role_rank(role) >= public.role_rank(p_min)
  );
$$;

-- True if the caller is admin of p_app (or super admin), or was granted p_permission in p_app.
-- Data tables of each app use this in their policies, e.g. has_permission('portfolio', 'posts.edit').
create function public.has_permission(p_app text, p_permission text) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.has_app_role(p_app, 'admin')
      or exists (
        select 1 from public.user_permissions
        where user_id = (select auth.uid()) and app = p_app and permission = p_permission
      );
$$;

revoke execute on function public.role_rank(text), public.is_super_admin(),
  public.has_app_role(text, text), public.has_permission(text, text) from public, anon;
grant execute on function public.role_rank(text), public.is_super_admin(),
  public.has_app_role(text, text), public.has_permission(text, text) to authenticated;

-- ── Guard: never remove or demote the last super admin (incl. deleting their auth user) ──

create function public.protect_last_super_admin() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.role = 'super_admin'
     and (tg_op = 'DELETE' or new.role <> 'super_admin' or new.user_id <> old.user_id) then
    perform pg_advisory_xact_lock(hashtext('public.user_roles.super_admin'));
    if (select count(*) from public.user_roles where role = 'super_admin') <= 1 then
      raise exception 'Cannot remove the last super admin' using errcode = 'P0001';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;
revoke execute on function public.protect_last_super_admin() from public, anon, authenticated;

create trigger user_roles_protect_last_super_admin
  before update or delete on public.user_roles
  for each row execute function public.protect_last_super_admin();

-- ── Grants (RLS still decides which rows) ────────────────────────────────────

grant select, insert, update, delete on public.user_roles to authenticated;
grant select on public.permissions to authenticated;
grant select, insert, delete on public.user_permissions to authenticated;

-- ── Policies: user_roles ─────────────────────────────────────────────────────
-- See: own rows; app admins see their app's rows; super admin sees all.
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()) or public.has_app_role(app, 'admin'));

-- Change: super admin anything; app admin only MEMBER rows of their own app.
create policy user_roles_insert on public.user_roles for insert to authenticated
  with check (public.is_super_admin() or (role = 'member' and public.has_app_role(app, 'admin')));

create policy user_roles_update on public.user_roles for update to authenticated
  using (public.is_super_admin() or (role = 'member' and public.has_app_role(app, 'admin')))
  with check (public.is_super_admin() or (role = 'member' and public.has_app_role(app, 'admin')));

create policy user_roles_delete on public.user_roles for delete to authenticated
  using (public.is_super_admin() or (role = 'member' and public.has_app_role(app, 'admin')));

-- ── Policies: permissions catalog (read-only for signed-in users) ────────────
create policy permissions_select on public.permissions for select to authenticated using (true);

-- ── Policies: user_permissions ──────────────────────────────────────────────
create policy user_permissions_select on public.user_permissions for select to authenticated
  using (user_id = (select auth.uid()) or public.has_app_role(app, 'admin'));

create policy user_permissions_insert on public.user_permissions for insert to authenticated
  with check (public.has_app_role(app, 'admin') and granted_by = (select auth.uid()));

create policy user_permissions_delete on public.user_permissions for delete to authenticated
  using (public.has_app_role(app, 'admin'));

-- ── Seed: portfolio permissions (docs/DESIGN.md section 4) ───────────────────
insert into public.permissions (app, key, label) values
  ('portfolio', 'posts.view',      'See posts and ideas'),
  ('portfolio', 'posts.edit',      'Write and edit posts and ideas'),
  ('portfolio', 'posts.publish',   'Publish, schedule and unpublish posts'),
  ('portfolio', 'projects.view',   'See projects'),
  ('portfolio', 'projects.edit',   'Create and edit projects'),
  ('portfolio', 'courses.view',    'See courses'),
  ('portfolio', 'courses.edit',    'Create and edit courses and chapters'),
  ('portfolio', 'snippets.view',   'See snippets'),
  ('portfolio', 'snippets.edit',   'Create and edit snippets'),
  ('portfolio', 'snippets.publish','Publish and unpublish snippets'),
  ('portfolio', 'comments.view',   'See comments'),
  ('portfolio', 'comments.edit',   'Edit and delete comments'),
  ('portfolio', 'messages.view',   'Read contact messages'),
  ('portfolio', 'messages.edit',   'Mark, note and delete messages'),
  ('portfolio', 'settings.view',   'See site settings'),
  ('portfolio', 'settings.edit',   'Change site settings'),
  ('portfolio', 'chatbot.edit',    'Manage the chatbot and its index'),
  ('portfolio', 'backup.edit',     'Export and restore backups');
