-- RLS test for 20261031120000_roles_permissions.sql. Run in the Supabase SQL editor AFTER the migration.
-- Everything happens inside one transaction that ROLLS BACK: no users or rows are left behind.
-- Success = the final notice "ALL ROLE/RLS TESTS PASSED". Any failure stops with "FAIL: ...".
-- Fake users: A super admin, B portfolio admin, C portfolio editor (member), D outsider.

begin;

insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-00000000000a', 'rls-a@test.invalid'),
  ('00000000-0000-4000-8000-00000000000b', 'rls-b@test.invalid'),
  ('00000000-0000-4000-8000-00000000000c', 'rls-c@test.invalid'),
  ('00000000-0000-4000-8000-00000000000d', 'rls-d@test.invalid');
insert into public.user_roles (user_id, app, role) values
  ('00000000-0000-4000-8000-00000000000a', '*', 'super_admin'),
  ('00000000-0000-4000-8000-00000000000b', 'portfolio', 'admin'),
  ('00000000-0000-4000-8000-00000000000c', 'portfolio', 'member');
insert into public.user_permissions (user_id, app, permission, granted_by) values
  ('00000000-0000-4000-8000-00000000000c', 'portfolio', 'posts.view', '00000000-0000-4000-8000-00000000000b');

-- Guard: the last super admin cannot be removed (run as owner, no RLS involved).
do $$ begin
  begin
    delete from public.user_roles where role = 'super_admin';
    raise exception 'FAIL: deleted every super admin';
  exception when sqlstate 'P0001' then
    if sqlerrm not like 'Cannot remove the last super admin%' then raise; end if;
  end;
end $$;

-- ── Anonymous visitors: no access at all ──
set local role anon;
do $$ begin
  begin perform 1 from public.user_roles; raise exception 'FAIL: anon read user_roles';
  exception when insufficient_privilege then null; end;
  begin perform public.is_super_admin(); raise exception 'FAIL: anon ran is_super_admin()';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;

-- ── D, outsider (no roles) ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000d","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.user_roles) = 0, 'FAIL: outsider sees role rows';
  assert not public.has_permission('portfolio', 'posts.view'), 'FAIL: outsider has a permission';
  begin
    insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-00000000000d', 'portfolio', 'admin');
    raise exception 'FAIL: outsider made themselves admin';
  exception when insufficient_privilege then null; end;
end $$;

-- ── C, portfolio editor ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000c","role":"authenticated"}', true);
do $$ declare n int; begin
  assert (select count(*) from public.user_roles) = 1, 'FAIL: editor sees other people''s roles';
  assert public.has_permission('portfolio', 'posts.view'), 'FAIL: editor lost a granted permission';
  assert not public.has_permission('portfolio', 'posts.edit'), 'FAIL: editor has an ungranted permission';
  assert not public.has_app_role('portfolio', 'admin'), 'FAIL: editor counts as admin';
  begin
    insert into public.user_permissions (user_id, app, permission) values ('00000000-0000-4000-8000-00000000000c', 'portfolio', 'posts.edit');
    raise exception 'FAIL: editor granted themselves a permission';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-00000000000d', 'portfolio', 'member');
    raise exception 'FAIL: editor added a member';
  exception when insufficient_privilege then null; end;
  update public.user_roles set role = 'admin' where user_id = '00000000-0000-4000-8000-00000000000c';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: editor promoted themselves';
end $$;

-- ── B, portfolio admin ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000b","role":"authenticated"}', true);
do $$ declare n int; begin
  assert (select count(*) from public.user_roles) = 2, 'FAIL: portfolio admin should see exactly B and C';
  assert public.has_permission('portfolio', 'backup.edit'), 'FAIL: app admin lacks a portfolio permission';
  assert not public.has_app_role('hub', 'member'), 'FAIL: portfolio admin has hub access';
  insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-00000000000d', 'portfolio', 'member');
  insert into public.user_permissions (user_id, app, permission) values ('00000000-0000-4000-8000-00000000000d', 'portfolio', 'posts.edit');
  assert (select granted_by from public.user_permissions where user_id = '00000000-0000-4000-8000-00000000000d')
         = '00000000-0000-4000-8000-00000000000b', 'FAIL: granted_by not recorded';
  begin
    insert into public.user_permissions (user_id, app, permission, granted_by) values ('00000000-0000-4000-8000-00000000000c', 'portfolio', 'posts.edit', '00000000-0000-4000-8000-00000000000a');
    raise exception 'FAIL: admin forged granted_by';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-00000000000d', 'hub', 'member');
    raise exception 'FAIL: portfolio admin added a hub member';
  exception when insufficient_privilege then null; end;
  begin
    update public.user_roles set role = 'admin' where user_id = '00000000-0000-4000-8000-00000000000d' and app = 'portfolio';
    raise exception 'FAIL: portfolio admin made another admin';
  exception when insufficient_privilege then null; end;
  delete from public.user_roles where user_id = '00000000-0000-4000-8000-00000000000b';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: portfolio admin removed an admin row';
  delete from public.user_roles where user_id = '00000000-0000-4000-8000-00000000000d' and app = 'portfolio';
  get diagnostics n = row_count;
  assert n = 1, 'FAIL: portfolio admin could not remove a member';
  assert not exists (select 1 from public.user_permissions where user_id = '00000000-0000-4000-8000-00000000000d'),
    'FAIL: removed member kept permissions';
end $$;

-- ── A, super admin ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-00000000000a","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.user_roles where user_id::text like '00000000-0000-4000-8000-00000000000%') = 3,
    'FAIL: super admin does not see all test rows';
  insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-00000000000d', 'hub', 'admin');
  assert (select count(*) from public.permissions where app = 'portfolio') = 18, 'FAIL: portfolio permission catalog incomplete';
  begin
    insert into public.permissions (app, key, label) values ('portfolio', 'x.view', 'x');
    raise exception 'FAIL: catalog writable from the app';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
do $$ begin raise notice 'ALL ROLE/RLS TESTS PASSED'; end $$;
rollback;
