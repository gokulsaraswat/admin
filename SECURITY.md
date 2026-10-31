# Security Policy

Do not open public issues for vulnerabilities.
Report privately via GitHub: Security tab -> "Report a vulnerability"
(https://github.com/gokulsaraswat/admin/security/advisories/new).

Never commit secrets. `.env*` files are gitignored except `.env.example`, which holds names only.
`SUPABASE_SERVICE_ROLE_KEY` is server-only. Every table has RLS; client-side role checks only shape the UI.
