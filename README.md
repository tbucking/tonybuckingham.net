This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Contributor Note

Before making any Next.js code changes, read the relevant docs in `node_modules/next/dist/docs/` as required by `AGENTS.md`.

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

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
