# Project general coding guidelines

## Stack

- **Next.js 16** App Router (`src/app`). Read the bundled docs in `node_modules/next/dist/docs/` before writing framework code — this version has breaking changes versus older releases.
- **React 19** with Server Components by default; add `'use client'` only to components that need state, effects, or browser APIs.
- **TypeScript**, `strict: true`, no `any`. Components are `.tsx`; modules without JSX are `.ts`.
- **Tailwind CSS v4** via `postcss.config.mjs`. There is no `tailwind.config.js`; do not create one.
- **Preset:** shadcn `luma` (`b2D1G8n9k`) — green primary, stone base, `0.875rem` radius, Inter. Re-apply with `npx shadcn@latest init -p b2D1G8n9k -f --reinstall`; this overwrites `src/components/ui` and the tokens.
- **shadcn/ui** components are vendored into `src/components/ui` and are project code.
- **Supabase** for auth and data (`@supabase/ssr`, `@supabase/supabase-js`).
- **Recharts** for charts, **lucide-react** for icons, **next-themes** for color mode.

## Code Style
- Use semantic HTML5 elements (header, main, section, article, etc.)
- Prefer modern JavaScript (ES6+) features like const/let, arrow functions, and template literals
- Use `interface` for component props and object shapes; use `type` for unions and type-only imports
- Default-export page sections and route files; name-export shared helpers and utilities (e.g. `Auth`, `useMounted`)

## TypeScript
- Keep `strict: true`; never silence errors with `any`, `@ts-ignore`, or `@ts-nocheck`
- Type `children` as `React.ReactNode` and component props with an explicit interface
- Narrow `process.env` with a helper (see `src/lib/supabase/env.ts`) instead of using the non-null assertion `!`
- Type `catch` parameters as `unknown` and narrow before use
- Export shared data shapes from `src/lib/activity-queries.ts` rather than redeclaring them per component

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants

## Code Quality
- Use meaningful variable and function names that clearly describe their purpose
- Include helpful comments for complex logic
- Add error handling for user inputs and API calls
- Keep locale- and timezone-dependent rendering behind the `useMounted` hook so server HTML matches the client's first paint

## UI and Styling
- Add components with the CLI (`npx shadcn@latest add <component>`) rather than hand-writing equivalents; edit the generated file if you need to customize it
- Compose existing primitives (`Button`, `Card`, `Table`, `Select`, `Field`, …) instead of raw elements with ad-hoc classes
- Use the design tokens in `src/app/globals.css` (`bg-background`, `text-muted-foreground`, `border-border`, `--chart-1`, …); never hardcode palette colors in components
- Change the palette only in `src/app/globals.css`, under `:root` and `.dark`
- Radix `Select` rejects an empty-string `SelectItem` value; use a sentinel such as `all` and map it back to `''`
- Style with Tailwind utility classes; do not reintroduce Theme UI, Emotion, or an `sx` prop
- Use `next/image` for image assets and always provide `alt`

## Dark Mode
- The `dark` class is applied to `<html>` by `next-themes`
- Color mode is manual-only (`enableSystem` is off); do not add OS-scheme following without an explicit request
- Guard theme-dependent rendering with `useMounted`

## Supabase
- Use Supabase client libraries for database interactions
- Follow Supabase best practices for authentication and data management
- Create clients through `src/lib/supabase/*` (`client.ts` for browser, `server.ts` for Server Components, `proxy.ts` for the request proxy) — do not call `createClient` from the package directly
- In Server Components, call `supabase.auth.getUser()` before database queries so requests carry the user's token
- Ensure secure handling of API keys and sensitive information; only `NEXT_PUBLIC_*` values may reach the browser
- This repo shares a hosted Supabase project with the **internetbutton** repo, which owns all migrations — never run `supabase db push` or `supabase db reset` from here

## Routing and Auth
- `/admin` is protected by `src/proxy.ts` plus a server-side session check in `src/app/admin/page.tsx`; keep both in sync
- Any new authenticated route must be added to the `matcher` in `src/proxy.ts`

## Validation
- Run `npm run typecheck` and `npm run build` before considering a change complete
- `npm run lint` does not work (`next lint` was removed in Next 16 and the script is broken); do not rely on it, and do not repair it as a side effect of unrelated work
- Verify UI changes in the browser in both light and dark mode

## Dependencies
- Regularly review and update dependencies to maintain security and performance
- Prefer adding a shadcn component over adding a new UI library
