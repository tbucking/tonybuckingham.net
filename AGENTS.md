# Supabase Auth

Handle authentication using the approach described in https://supabase.com/docs/guides/auth/server-side/creating-a-client

# Supabase Migrations

This repo shares its hosted Supabase project (ref `jdewkdjgbghtvzwsmpuw`) with the internetbutton project.

- The **internetbutton repo owns all migrations** for the shared database.
- This repo has no `supabase/migrations/` directory; all migrations live in the internetbutton repo.
- NEVER run `supabase db push` or `supabase db reset` against the hosted project from this repo.
- Inspect the remote schema read-only with `supabase db query --linked`.
<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->