-- Invite-only access: a signed-in user with no role in an app asks for one; that app's admins decide.
--   request_access(app)                       -> caller's pending 'member' request (idempotent per user + app)
--   decide_access_request(id, approve, role)  -> app admin approves (upserts user_roles) or denies
-- Granting 'admin' needs a super admin. App admins never change an existing admin row (same rule as user_roles RLS).
-- Clients only read this table; every write goes through the two functions (no insert/update/delete grants).
-- Project setting "auto-expose new tables" is OFF, so every grant below is explicit.
-- Needs 20261031120000_roles_permissions.sql. NOT APPLIED until Gokul approves.
-- Test: supabase/tests/access_requests_test.sql (rolls back). Contract: platform/docs/CONTRACTS.md.

create table public.access_requests (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  app            text not null check (app in ('hub', 'admin', 'portfolio', 'gspace', 'studio', 'gym')),
  email          text not null,
  name           text,
  status         text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  requested_role text not null default 'member' check (requested_role in ('member', 'admin')),
  created_at     timestamptz not null default now(),
  decided_at     timestamptz,
  decided_by     uuid references auth.users (id) on delete set null,
  unique (user_id, app)
);
comment on table public.access_requests is 'Requests to join an app, decided by its admins. Contract: platform/docs/CONTRACTS.md.';
create index access_requests_app_status_idx on public.access_requests (app, status);

alter table public.access_requests enable row level security;

revoke all on public.access_requests from anon, authenticated;
grant select on public.access_requests to authenticated;

create policy access_requests_select on public.access_requests for select to authenticated
  using (user_id = (select auth.uid()) or public.has_app_role(app, 'admin'));

-- ── request_access: caller asks to join p_app; returns the existing row unchanged if there is one ──

create function public.request_access(p_app text) returns public.access_requests
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.access_requests;
begin
  if v_uid is null then
    raise exception 'Sign in to request access' using errcode = '42501';
  end if;
  if p_app is null or p_app not in ('hub', 'admin', 'portfolio', 'gspace', 'studio', 'gym') then
    raise exception 'Unknown app: %', p_app using errcode = '22023';
  end if;

  insert into public.access_requests (user_id, app, email, name)
  select u.id, p_app, coalesce(u.email, ''),
         coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')
  from auth.users u
  where u.id = v_uid
  on conflict (user_id, app) do nothing
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.access_requests where user_id = v_uid and app = p_app;
  end if;
  if v_row.id is null then
    raise exception 'Unknown user' using errcode = '42501';
  end if;
  return v_row;
end;
$$;

-- ── decide_access_request: app admin approves (grants p_role in user_roles) or denies ──

create function public.decide_access_request(p_id uuid, p_approve boolean, p_role text default 'member')
returns public.access_requests
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_req public.access_requests;
  v_current text;
begin
  if v_uid is null then
    raise exception 'Sign in to decide requests' using errcode = '42501';
  end if;
  if p_approve is null then
    raise exception 'Approve must be true or false' using errcode = '22023';
  end if;

  select * into v_req from public.access_requests where id = p_id for update;
  if v_req.id is null or not public.has_app_role(v_req.app, 'admin') then
    raise exception 'Request not found' using errcode = 'P0002';
  end if;

  if p_approve then
    if p_role is null or p_role not in ('member', 'admin') then
      raise exception 'Role must be member or admin' using errcode = '22023';
    end if;
    if not public.is_super_admin() then
      if p_role = 'admin' then
        raise exception 'Only a super admin can grant admin' using errcode = '42501';
      end if;
      select role into v_current from public.user_roles where user_id = v_req.user_id and app = v_req.app;
      if v_current = 'admin' then
        raise exception 'Only a super admin can change an admin' using errcode = '42501';
      end if;
    end if;

    insert into public.user_roles (user_id, app, role)
    values (v_req.user_id, v_req.app, p_role)
    on conflict (user_id, app) do update set role = excluded.role;

    update public.access_requests
    set status = 'approved', decided_at = now(), decided_by = v_uid
    where id = p_id
    returning * into v_req;
  else
    if v_req.status = 'approved' then
      raise exception 'Already approved: remove the role instead' using errcode = '22023';
    end if;
    update public.access_requests
    set status = 'denied', decided_at = now(), decided_by = v_uid
    where id = p_id
    returning * into v_req;
  end if;

  return v_req;
end;
$$;

revoke execute on function public.request_access(text), public.decide_access_request(uuid, boolean, text) from public, anon;
grant execute on function public.request_access(text), public.decide_access_request(uuid, boolean, text) to authenticated;
