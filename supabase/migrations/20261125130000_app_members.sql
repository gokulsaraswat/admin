-- Members of one app with their email and name, for that app's admins.
--   list_app_members(app) -> user_roles rows of the app + every super admin (role 'super_admin'),
--                            joined to auth.users (email, full_name/name from Google metadata).
-- A super admin who also holds a row in the app is listed once, with that row's role.
-- Removing a member is NOT a function: the client deletes the user_roles row
--   (delete from user_roles where user_id = $1 and app = $2); user_roles RLS already lets an app admin
--   delete member rows of their app and the super admin any row (last super admin stays protected).
-- Needs 20261031120000_roles_permissions.sql. NOT APPLIED until Gokul approves.
-- Test: supabase/tests/app_members_test.sql (rolls back). Contract: platform/docs/CONTRACTS.md.

create function public.list_app_members(p_app text)
returns table (user_id uuid, role text, email text, name text, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.has_app_role(p_app, 'admin') then
    raise exception 'Only admins of % can list its members', p_app using errcode = '42501';
  end if;

  return query
  select r.user_id, r.role, coalesce(u.email, '')::text,
         coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
         r.created_at
  from public.user_roles r
  join auth.users u on u.id = r.user_id
  where r.app = p_app
     or (r.app = '*' and not exists (
           select 1 from public.user_roles o where o.user_id = r.user_id and o.app = p_app))
  order by public.role_rank(r.role) desc, u.email;
end;
$$;

revoke execute on function public.list_app_members(text) from public, anon;
grant execute on function public.list_app_members(text) to authenticated;
