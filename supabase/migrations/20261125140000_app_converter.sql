-- New app id `converter` (gokul-omni-converter), matching @gokulsaraswat/config 0.2.0 `appIds`.
-- The app list now lives in one function, is_app_id(); the next new app only replaces that function.
-- Widens: user_roles.app, permissions.app, access_requests.app and request_access(). Nothing is narrowed.
-- Needs 20261031120000_roles_permissions.sql, 20261125120000_access_requests.sql. NOT APPLIED until Gokul approves.
-- Test: supabase/tests/app_converter_test.sql (rolls back). Contract: platform/docs/CONTRACTS.md.

create function public.is_app_id(p_app text) returns boolean
language sql immutable set search_path = '' as $$
  select p_app in ('hub', 'admin', 'portfolio', 'gspace', 'studio', 'gym', 'converter');
$$;
comment on function public.is_app_id(text) is 'Known app ids (@gokulsaraswat/config appIds). Used by check constraints and request_access.';

alter table public.user_roles drop constraint user_roles_app_check;
alter table public.user_roles add constraint user_roles_app_check check (app = '*' or public.is_app_id(app));

alter table public.permissions drop constraint permissions_app_check;
alter table public.permissions add constraint permissions_app_check check (public.is_app_id(app));

alter table public.access_requests drop constraint access_requests_app_check;
alter table public.access_requests add constraint access_requests_app_check check (public.is_app_id(app));

create or replace function public.request_access(p_app text) returns public.access_requests
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_row public.access_requests;
begin
  if v_uid is null then
    raise exception 'Sign in to request access' using errcode = '42501';
  end if;
  if p_app is null or not public.is_app_id(p_app) then
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
