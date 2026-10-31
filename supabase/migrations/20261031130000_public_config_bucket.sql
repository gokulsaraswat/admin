-- Phase 2d: public config bucket for the hub (and later other apps' public JSON).
-- Layout: public-config/<app>/<file>.json, e.g. public-config/hub/config.json (CONTRACTS.md).
-- Reading: anyone, via the public URL /storage/v1/object/public/public-config/hub/config.json.
--   No SELECT policy for anon: public buckets serve files without one, and a policy would also allow LISTING.
-- Writing: whoever has '<app>.config.edit' in that folder's app (app admins and super admins always do).
-- NOT APPLIED until Gokul approves. Test: supabase/tests/public_config_test.sql (rolls back).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public-config', 'public-config', true, 65536, array['application/json'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into public.permissions (app, key, label) values
  ('hub', 'config.edit', 'Edit and publish the hub''s app tiles');

-- Writers see and change only their own app's folder. Upload with upsert needs SELECT + INSERT + UPDATE.
create policy public_config_select on storage.objects for select to authenticated
  using (bucket_id = 'public-config' and public.has_permission((storage.foldername(name))[1], 'config.edit'));

create policy public_config_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'public-config' and public.has_permission((storage.foldername(name))[1], 'config.edit'));

create policy public_config_update on storage.objects for update to authenticated
  using (bucket_id = 'public-config' and public.has_permission((storage.foldername(name))[1], 'config.edit'))
  with check (bucket_id = 'public-config' and public.has_permission((storage.foldername(name))[1], 'config.edit'));

create policy public_config_delete on storage.objects for delete to authenticated
  using (bucket_id = 'public-config' and public.has_permission((storage.foldername(name))[1], 'config.edit'));
