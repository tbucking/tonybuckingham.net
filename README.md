This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Frontend Stack

- **TypeScript** — the whole `src/` tree is `.ts`/`.tsx` with `strict: true`. Run `npm run typecheck` to check types.
- **shadcn/ui** — components are vendored into `src/components/ui` via the CLI (`npx shadcn@latest add <component>`). They are project code, so edit them freely.
- **Tailwind CSS v4** — configured through `postcss.config.mjs` and `src/app/globals.css`; there is no `tailwind.config.js`.
- **Design tokens** — the palette lives as CSS variables in `src/app/globals.css` (`:root` and `.dark`). Change colours there rather than in components.
- **Dark mode** — `next-themes` with a manual toggle only (`enableSystem` is off). The `dark` class is applied to `<html>`.

## Contributor Note

Before making any Next.js code changes, read the relevant docs in `node_modules/next/dist/docs/` as required by `AGENTS.md`.

Run `npm run typecheck` and `npm run build` before opening a pull request.

## Supabase Authentication Setup

This app includes email/password authentication via Supabase.

1. Create your local environment file and add your project values:

```bash
cp .env.example .env.local
```

2. Set these variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. If you are using local Supabase CLI (`supabase start`), use your local API URL and anon key from the CLI output.

4. Run the app:

```bash
npm run dev
```

The `/admin` path is protected using Next.js `proxy.js` + Supabase SSR session checks. Unauthenticated requests to `/admin` are redirected to `/login`.

## Database Migrations

This site shares its hosted Supabase project (ref `jdewkdjgbghtvzwsmpuw`) with the **internetbutton** project.

- **Migration ownership**: the internetbutton repository owns all migrations for the shared database. It is the single source of truth for schema changes, and all migrations (including this site's admin read policy) live there.
- This repository contains no `supabase/migrations/` directory.
- Do **not** run `supabase db push` or `supabase db reset` against the hosted project from this repository.
- To inspect the remote database read-only, use `supabase db query --linked`.

## Deployment

Production is served from the `release/v-1.0` branch via Netlify; pushing to that branch triggers a production build.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
