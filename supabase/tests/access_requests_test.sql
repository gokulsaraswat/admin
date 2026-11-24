-- Test for 20261125120000_access_requests.sql. Run in the Supabase SQL editor AFTER both migrations.
-- Everything happens inside one transaction that ROLLS BACK: no users or rows are left behind.
-- Success = one result row "ALL ACCESS REQUEST TESTS PASSED". Any failure stops with "FAIL: ...".
-- Every DO block spans several lines: the Supabase SQL editor mangles one-line $$ blocks.
-- Fake users: A super admin, B gspace admin, D outsider (Google name in metadata), E outsider.

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a1', 'ar-a@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000b1', 'ar-b@test.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d1', 'ar-d@test.invalid', '{"full_name":"Dee Outsider"}'),
  ('00000000-0000-4000-8000-0000000000e1', 'ar-e@test.invalid', '{"name":"Eee"}');
insert into public.user_roles (user_id, app, role) values
  ('00000000-0000-4000-8000-0000000000a1', '*', 'super_admin'),
  ('00000000-0000-4000-8000-0000000000b1', 'gspace', 'admin');

-- ── Anonymous visitors: no access at all ──
set local role anon;
do $$ begin
  begin perform 1 from public.access_requests; raise exception 'FAIL: anon read access_requests';
  exception when insufficient_privilege then null; end;
  begin perform public.request_access('gspace'); raise exception 'FAIL: anon ran request_access()';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

set local role authenticated;

-- ── No user in the JWT ──
select set_config('request.jwt.claims', '{"role":"authenticated"}', true);
do $$ begin
  begin perform public.request_access('gspace'); raise exception 'FAIL: request without a user';
  exception when insufficient_privilege then null; end;
end $$;

-- ── D, outsider: requests gspace ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d1","role":"authenticated"}', true);
do $$ declare r public.access_requests; r2 public.access_requests; begin
  r := public.request_access('gspace');
  assert r.status = 'pending' and r.requested_role = 'member', 'FAIL: new request not pending member';
  assert r.email = 'ar-d@test.invalid' and r.name = 'Dee Outsider', 'FAIL: email/name not copied from auth.users';
  r2 := public.request_access('gspace');
  assert r2.id = r.id, 'FAIL: second request made a new row';
  assert (select count(*) from public.access_requests) = 1, 'FAIL: outsider sees other rows';
  begin perform public.request_access('nope'); raise exception 'FAIL: unknown app accepted';
  exception when invalid_parameter_value then null; end;
  begin
    insert into public.access_requests (user_id, app, email) values ('00000000-0000-4000-8000-0000000000d1', 'gym', 'x');
    raise exception 'FAIL: direct insert allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.access_requests set status = 'approved';
    raise exception 'FAIL: direct update allowed';
  exception when insufficient_privilege then null; end;
  begin perform public.decide_access_request(r.id, true); raise exception 'FAIL: outsider approved own request';
  exception when no_data_found then null; end;
  assert not public.has_app_role('gspace', 'member'), 'FAIL: outsider got a role';
end $$;

-- ── E, outsider: requests gym and gspace ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1","role":"authenticated"}', true);
do $$ declare r public.access_requests; begin
  r := public.request_access('gym');
  assert r.name = 'Eee', 'FAIL: name fallback not used';
  perform set_config('test.e_gym', r.id::text, true);
  perform public.request_access('gspace');
end $$;

-- ── B, gspace admin ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1","role":"authenticated"}', true);
do $$ declare d uuid; e_gs uuid; e_gym uuid := current_setting('test.e_gym')::uuid; r public.access_requests; begin
  assert (select count(*) from public.access_requests) = 2, 'FAIL: gspace admin should see exactly the 2 gspace requests';
  select id into d from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000d1' and app = 'gspace';
  select id into e_gs from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000e1' and app = 'gspace';
  begin perform public.decide_access_request(e_gym, true); raise exception 'FAIL: gspace admin decided a gym request';
  exception when no_data_found then null; end;
  begin perform public.decide_access_request(d, true, 'admin'); raise exception 'FAIL: app admin granted admin';
  exception when insufficient_privilege then null; end;
  begin perform public.decide_access_request(d, true, 'owner'); raise exception 'FAIL: unknown role accepted';
  exception when invalid_parameter_value then null; end;
  r := public.decide_access_request(d, true);
  assert r.status = 'approved' and r.decided_by = '00000000-0000-4000-8000-0000000000b1' and r.decided_at is not null,
    'FAIL: approval not recorded';
  assert exists (select 1 from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000d1' and app = 'gspace' and role = 'member'),
    'FAIL: approval did not add a member role';
  begin perform public.decide_access_request(d, false); raise exception 'FAIL: approved request denied';
  exception when invalid_parameter_value then null; end;
  r := public.decide_access_request(e_gs, false);
  assert r.status = 'denied', 'FAIL: deny not recorded';
  assert not exists (select 1 from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000e1'),
    'FAIL: deny added a role';
end $$;

-- ── D again: approved request comes back unchanged ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000d1","role":"authenticated"}', true);
do $$ declare r public.access_requests; begin
  r := public.request_access('gspace');
  assert r.status = 'approved', 'FAIL: re-request reset an approved row';
  assert public.has_app_role('gspace', 'member'), 'FAIL: approved user has no gspace role';
end $$;

-- ── E again: denied request stays denied ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000e1","role":"authenticated"}', true);
do $$ begin
  assert (public.request_access('gspace')).status = 'denied', 'FAIL: re-request reset a denied row';
end $$;

-- ── A, super admin: makes D a gspace admin and decides gym ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);
do $$ declare d uuid; e_gym uuid; begin
  assert (select count(*) from public.access_requests where email like 'ar-%@test.invalid') = 3, 'FAIL: super admin does not see all requests';
  select id into d from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000d1' and app = 'gspace';
  select id into e_gym from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000e1' and app = 'gym';
  perform public.decide_access_request(d, true, 'admin');
  assert (select role from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000d1' and app = 'gspace') = 'admin',
    'FAIL: super admin could not grant admin';
  perform public.decide_access_request(e_gym, true, 'member');
  assert exists (select 1 from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000e1' and app = 'gym'),
    'FAIL: super admin approval did not add a gym role';
end $$;

-- ── B again: cannot demote D (now admin) by re-approving as member ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1","role":"authenticated"}', true);
do $$ declare d uuid; begin
  select id into d from public.access_requests where user_id = '00000000-0000-4000-8000-0000000000d1' and app = 'gspace';
  begin perform public.decide_access_request(d, true, 'member'); raise exception 'FAIL: app admin demoted an admin';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
rollback;
-- Only reached if every check above passed.
select 'ALL ACCESS REQUEST TESTS PASSED' as result;
