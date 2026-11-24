-- Test for 20261125130000_app_members.sql. Run in the Supabase SQL editor AFTER the roles and app_members migrations.
-- Everything happens inside one transaction that ROLLS BACK: no users or rows are left behind.
-- Success = one result row "ALL APP MEMBERS TESTS PASSED". Any failure stops with "FAIL: ...".
-- Every DO block spans several lines: the Supabase SQL editor mangles one-line $$ blocks.
-- Fake users: A super admin, S super admin + gspace member, B gspace admin, C gspace member (Google full_name),
--             D gym member (name only), F gym admin, E outsider.

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000001a1', 'am-a@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000001f5', 'am-s@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000001b1', 'am-b@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000001c1', 'am-c@test.invalid', '{"full_name":"Cee Member","name":"ignored"}'),
  ('00000000-0000-4000-8000-0000000001d1', 'am-d@test.invalid', '{"name":"Dee"}'),
  ('00000000-0000-4000-8000-0000000001f1', 'am-f@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000001e1', 'am-e@test.invalid', '{}');
insert into public.user_roles (user_id, app, role) values
  ('00000000-0000-4000-8000-0000000001a1', '*', 'super_admin'),
  ('00000000-0000-4000-8000-0000000001f5', '*', 'super_admin'),
  ('00000000-0000-4000-8000-0000000001f5', 'gspace', 'member'),
  ('00000000-0000-4000-8000-0000000001b1', 'gspace', 'admin'),
  ('00000000-0000-4000-8000-0000000001c1', 'gspace', 'member'),
  ('00000000-0000-4000-8000-0000000001d1', 'gym', 'member'),
  ('00000000-0000-4000-8000-0000000001f1', 'gym', 'admin');

-- ── Anonymous visitors: cannot run it ──
set local role anon;
do $$ begin
  begin perform public.list_app_members('gspace'); raise exception 'FAIL: anon ran list_app_members()';
  exception when insufficient_privilege then
    assert sqlerrm like 'permission denied for function%', 'FAIL: anon can execute list_app_members()';
  end;
end $$;
reset role;

set local role authenticated;

-- ── No user in the JWT ──
select set_config('request.jwt.claims', '{"role":"authenticated"}', true);
do $$ begin
  begin perform public.list_app_members('gspace'); raise exception 'FAIL: listed without a user';
  exception when insufficient_privilege then null; end;
end $$;

-- ── E, outsider, and C, plain member: refused ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000001e1","role":"authenticated"}', true);
do $$ begin
  begin perform public.list_app_members('gspace'); raise exception 'FAIL: outsider listed gspace';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000001c1","role":"authenticated"}', true);
do $$ begin
  begin perform public.list_app_members('gspace'); raise exception 'FAIL: member listed gspace';
  exception when insufficient_privilege then null; end;
end $$;

-- ── B, gspace admin: lists gspace, not gym; removes a member; cannot remove admins ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000001b1","role":"authenticated"}', true);
do $$ declare n int; begin
  assert (select count(*) from public.list_app_members('gspace') where email like 'am-%@test.invalid') = 4, 'FAIL: gspace should list A, S, B, C';
  assert (select role from public.list_app_members('gspace') limit 1) = 'super_admin', 'FAIL: super admins not listed first';
  assert (select role from public.list_app_members('gspace') where user_id = '00000000-0000-4000-8000-0000000001a1') = 'super_admin',
    'FAIL: super admin without a gspace row not listed as super_admin';
  assert (select count(*) from public.list_app_members('gspace') where user_id = '00000000-0000-4000-8000-0000000001f5') = 1,
    'FAIL: super admin with a gspace row listed twice';
  assert (select role from public.list_app_members('gspace') where user_id = '00000000-0000-4000-8000-0000000001f5') = 'member',
    'FAIL: super admin with a gspace row should show that row';
  assert (select role from public.list_app_members('gspace') where user_id = '00000000-0000-4000-8000-0000000001b1') = 'admin',
    'FAIL: gspace admin missing';
  assert exists (select 1 from public.list_app_members('gspace')
                 where user_id = '00000000-0000-4000-8000-0000000001c1' and email = 'am-c@test.invalid' and name = 'Cee Member'
                   and role = 'member' and created_at is not null),
    'FAIL: member row missing email/full_name';
  assert not exists (select 1 from public.list_app_members('gspace') where user_id = '00000000-0000-4000-8000-0000000001d1'),
    'FAIL: gym member leaked into gspace';
  begin perform public.list_app_members('gym'); raise exception 'FAIL: gspace admin listed gym';
  exception when insufficient_privilege then null; end;

  delete from public.user_roles where user_id = '00000000-0000-4000-8000-0000000001c1' and app = 'gspace';
  get diagnostics n = row_count;
  assert n = 1, 'FAIL: app admin could not remove a member';
  assert (select count(*) from public.list_app_members('gspace') where email like 'am-%@test.invalid') = 3, 'FAIL: removed member still listed';

  delete from public.user_roles where user_id = '00000000-0000-4000-8000-0000000001b1' and app = 'gspace';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: app admin removed an admin row';
  delete from public.user_roles where user_id = '00000000-0000-4000-8000-0000000001a1';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: app admin removed a super admin';
  delete from public.user_roles where user_id = '00000000-0000-4000-8000-0000000001d1' and app = 'gym';
  get diagnostics n = row_count;
  assert n = 0, 'FAIL: gspace admin removed a gym member';
end $$;

-- ── F, gym admin: name falls back to metadata "name" ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000001f1","role":"authenticated"}', true);
do $$ begin
  assert (select name from public.list_app_members('gym') where user_id = '00000000-0000-4000-8000-0000000001d1') = 'Dee',
    'FAIL: name fallback not used';
  assert (select name from public.list_app_members('gym') where user_id = '00000000-0000-4000-8000-0000000001f1') is null,
    'FAIL: name should be null without metadata';
end $$;

-- ── A, super admin: lists any app; both super admins show as super_admin in gym ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000001a1","role":"authenticated"}', true);
do $$ begin
  assert (select count(*) from public.list_app_members('gym') where email like 'am-%@test.invalid') = 4,
    'FAIL: gym should list A, S, D, F';
  assert (select count(*) from public.list_app_members('gym') where role = 'super_admin' and email like 'am-%@test.invalid') = 2,
    'FAIL: super admins missing from gym';
  assert (select count(*) from public.list_app_members('studio') where email like 'am-%@test.invalid') = 2,
    'FAIL: empty app should list only the super admins';
end $$;

reset role;
rollback;
-- Only reached if every check above passed.
select 'ALL APP MEMBERS TESTS PASSED' as result;
