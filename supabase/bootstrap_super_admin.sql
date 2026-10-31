-- Run ONCE in the Supabase SQL editor, after the roles migration, to make Gokul the first super admin.
-- Replace the email with the one you sign in with. Not a migration: it contains a person's email.
insert into public.user_roles (user_id, app, role)
select id, '*', 'super_admin' from auth.users where email = 'YOUR-SIGN-IN-EMAIL'
on conflict (user_id, app) do nothing
returning user_id, app, role;
-- Expect exactly 1 row returned. 0 rows = the email does not match any user in Authentication > Users.
