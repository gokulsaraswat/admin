-- Test for 20261125140000_app_converter.sql. Run in the Supabase SQL editor AFTER all migrations.
-- Everything happens inside one transaction that ROLLS BACK: no users or rows are left behind.
-- Success = one result row "ALL APP CONVERTER TESTS PASSED". Any failure stops with "FAIL: ...".
-- Every DO block spans several lines: the Supabase SQL editor mangles one-line $$ blocks.
-- Fake users: A super admin, C outsider.

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a3', 'cv-a@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000c3', 'cv-c@test.invalid', '{"full_name":"Cee Converter"}');
insert into public.user_roles (user_id, app, role) values
  ('00000000-0000-4000-8000-0000000000a3', '*', 'super_admin');

-- ── Constraints: converter accepted everywhere, unknown ids still rejected ──
do $$ begin
  assert public.is_app_id('converter') and public.is_app_id('gym') and not public.is_app_id('nope') and not public.is_app_id('*'),
    'FAIL: is_app_id list';
  insert into public.permissions (app, key, label) values ('converter', 'jobs.view', 'test row');
  begin insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-0000000000c3', 'nope', 'member');
    raise exception 'FAIL: user_roles accepted an unknown app';
  exception when check_violation then null; end;
  begin insert into public.permissions (app, key, label) values ('nope', 'jobs.view', 'x');
    raise exception 'FAIL: permissions accepted an unknown app';
  exception when check_violation then null; end;
  begin insert into public.user_roles (user_id, app, role) values ('00000000-0000-4000-8000-0000000000c3', '*', 'member');
    raise exception 'FAIL: user_roles accepted * without super_admin';
  exception when check_violation then null; end;
end $$;

set local role authenticated;

-- ── C, outsider: requests converter; unknown apps still fail ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c3","role":"authenticated"}', true);
do $$ declare r public.access_requests; begin
  r := public.request_access('converter');
  assert r.status = 'pending' and r.app = 'converter' and r.name = 'Cee Converter', 'FAIL: converter request';
  assert (public.request_access('converter')).id = r.id, 'FAIL: converter request not idempotent';
  begin perform public.request_access('nope'); raise exception 'FAIL: unknown app accepted';
  exception when invalid_parameter_value then null; end;
  begin perform public.request_access(null); raise exception 'FAIL: null app accepted';
  exception when invalid_parameter_value then null; end;
end $$;

-- ── A, super admin: approves C as converter member ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a3","role":"authenticated"}', true);
do $$ declare r uuid; begin
  select id into r from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000c3' and app = 'converter';
  perform public.decide_access_request(r, true, 'member');
  assert (select role from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000c3' and app = 'converter') = 'member',
    'FAIL: converter approval did not add a role';
end $$;

reset role;
rollback;
-- Only reached if every check above passed.
select 'ALL APP CONVERTER TESTS PASSED' as result;
