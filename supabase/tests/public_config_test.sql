-- RLS test for 20261031130000_public_config_bucket.sql. Run in the Supabase SQL editor AFTER that migration.
-- One transaction that ROLLS BACK: no users, roles or files are left behind.
-- Success = one result row "ALL PUBLIC-CONFIG TESTS PASSED". Any failure stops with "FAIL: ...".
-- Every DO block spans several lines: the Supabase SQL editor mangles one-line $$ blocks.
-- Fake users: H hub admin, E hub editor with config.edit, M hub member without it, P portfolio admin.

begin;

insert into auth.users (id, email) values
  ('00000000-0000-4000-8000-0000000000b1', 'cfg-h@test.invalid'),
  ('00000000-0000-4000-8000-0000000000b2', 'cfg-e@test.invalid'),
  ('00000000-0000-4000-8000-0000000000b3', 'cfg-m@test.invalid'),
  ('00000000-0000-4000-8000-0000000000b4', 'cfg-p@test.invalid');
insert into public.user_roles (user_id, app, role) values
  ('00000000-0000-4000-8000-0000000000b1', 'hub', 'admin'),
  ('00000000-0000-4000-8000-0000000000b2', 'hub', 'member'),
  ('00000000-0000-4000-8000-0000000000b3', 'hub', 'member'),
  ('00000000-0000-4000-8000-0000000000b4', 'portfolio', 'admin');
insert into public.user_permissions (user_id, app, permission, granted_by) values
  ('00000000-0000-4000-8000-0000000000b2', 'hub', 'config.edit', '00000000-0000-4000-8000-0000000000b1');

do $$
begin
  assert (select public from storage.buckets where id = 'public-config'), 'FAIL: bucket missing or not public';
  assert (select allowed_mime_types = array['application/json'] from storage.buckets where id = 'public-config'),
    'FAIL: bucket accepts more than JSON';
end
$$;

-- ── Anonymous visitors cannot write ──
set local role anon;
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('public-config', 'hub/config.json');
    raise exception 'FAIL: anon wrote the hub config';
  exception when insufficient_privilege then null;
  end;
end
$$;
reset role;

set local role authenticated;

-- ── M, hub member WITHOUT config.edit ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b3","role":"authenticated"}', true);
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('public-config', 'hub/config.json');
    raise exception 'FAIL: member without config.edit wrote the hub config';
  exception when insufficient_privilege then null;
  end;
end
$$;

-- ── P, portfolio admin: own app folder yes, hub no ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b4","role":"authenticated"}', true);
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('public-config', 'hub/config.json');
    raise exception 'FAIL: portfolio admin wrote the hub config';
  exception when insufficient_privilege then null;
  end;
  insert into storage.objects (bucket_id, name) values ('public-config', 'portfolio/site.json');
end
$$;

-- ── E, hub editor with config.edit ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b2","role":"authenticated"}', true);
do $$
begin
  insert into storage.objects (bucket_id, name) values ('public-config', 'hub/config.json');
  assert (select count(*) from storage.objects where bucket_id = 'public-config' and name = 'hub/config.json') = 1,
    'FAIL: hub editor cannot see the file it wrote';
  assert (select count(*) from storage.objects where bucket_id = 'public-config' and name like 'portfolio/%') = 0,
    'FAIL: hub editor sees portfolio files';
end
$$;

-- ── M again: cannot see hub files through the API (no listing) ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b3","role":"authenticated"}', true);
do $$
begin
  assert (select count(*) from storage.objects where bucket_id = 'public-config') = 0,
    'FAIL: member without config.edit can list the bucket';
end
$$;

-- ── H, hub admin: sees the hub file without an explicit grant ──
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1","role":"authenticated"}', true);
do $$
begin
  assert (select count(*) from storage.objects where bucket_id = 'public-config' and name = 'hub/config.json') = 1,
    'FAIL: hub admin cannot see the hub config';
end
$$;

reset role;
rollback;
-- Only reached if every check above passed.
select 'ALL PUBLIC-CONFIG TESTS PASSED' as result;
