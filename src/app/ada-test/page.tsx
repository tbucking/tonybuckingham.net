import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Features",
  description:
    "An overview of the features, technology, and accessibility standards that power tonybuckingham.net.",
};

type Feature = {
  title: string;
  description: string;
  details: string[];
};

const features: Feature[] = [
  {
    title: "Built with Next.js",
    description:
      "The site runs on the Next.js App Router with React Server Components for fast, cacheable page loads.",
    details: [
      "Static rendering wherever possible",
      "Route-level metadata for titles, descriptions, and social cards",
      "Automatic code splitting per route",
    ],
  },
  {
    title: "Accessibility First",
    description:
      "Every page is designed to meet WCAG 2.2 AA guidelines so it works for keyboard, screen reader, and voice users.",
    details: [
      "Semantic landmarks and a single, ordered heading structure",
      "Visible focus indicators and a skip-to-content link",
      "Sufficient color contrast in both light and dark themes",
      "Respect for the prefers-reduced-motion setting",
    ],
  },
  {
    title: "Responsive Layout",
    description:
      "Content reflows cleanly from small phones to ultra-wide displays without horizontal scrolling.",
    details: [
      "Fluid type and spacing scales",
      "Touch targets sized for thumbs",
      "Layouts tested at 320px, 768px, and 1440px",
    ],
  },
  {
    title: "Theme Support",
    description:
      "A light and dark appearance that follows the operating system by default, with a manual override.",
    details: [
      "System preference detection with no flash of the wrong theme",
      "Preference persisted across visits",
      "Contrast validated in both modes",
    ],
  },
  {
    title: "Markdown-Driven Content",
    description:
      "Writing happens in Markdown or MDX, so posts stay portable and version controlled alongside the code.",
    details: [
      "Frontmatter for titles, dates, tags, and descriptions",
      "Syntax highlighting for code samples",
      "Automatic tables of contents and reading time",
    ],
  },
  {
    title: "Tailwind CSS Styling",
    description:
      "Utility-first styles keep the design system consistent and the shipped CSS small.",
    details: [
      "Design tokens for color, spacing, and type",
      "No unused styles in production builds",
      "Predictable, composable component styles",
    ],
  },
  {
    title: "Performance Budget",
    description:
      "Pages are tuned to stay lightweight: minimal JavaScript, optimized images, and self-hosted fonts.",
    details: [
      "Images served in modern formats at the right size",
      "Fonts subset and loaded with font-display: swap",
      "Aggressive caching for static assets",
    ],
  },
  {
    title: "SEO & Sharing",
    description:
      "Structured data, canonical URLs, and Open Graph images make the site easy to index and share.",
    details: [
      "Generated sitemap and robots rules",
      "JSON-LD for articles and the site itself",
      "Per-page Open Graph and Twitter card metadata",
    ],
  },
];

export default function SiteFeaturesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <header className="mb-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          About this site
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
          Site Features
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          This site is part portfolio, part notebook. Everything below describes
          how it is put together &mdash; the tooling, the design decisions, and
          the standards it aims to meet.
        </p>
      </header>

      <section aria-labelledby="highlights-heading" className="mb-14">
        <h2
          id="highlights-heading"
          className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          At a glance
        </h2>
        <ul className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-4">
          {[
            { value: "0", label: "Blocking scripts" },
            { value: "AA", label: "WCAG target" },
            { value: "100%", label: "Statically rendered" },
            { value: "2", label: "Color themes" },
          ].map((stat) => (
            <li
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="mb-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          What's included
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 p-6 transition-colors hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
                {feature.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="stack-heading"
        className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-700"
      >
        <h2
          id="stack-heading"
          className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
        >
          The stack
        </h2>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {[
            { term: "Framework", description: "Next.js (App Router), React, TypeScript" },
            { term: "Styling", description: "Tailwind CSS with custom design tokens" },
            { term: "Content", description: "Markdown and MDX with frontmatter" },
            { term: "Deployment", description: "Continuous deploys from the main branch" },
          ].map((item) => (
            <div key={item.term}>
              <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {item.term}
              </dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-14 rounded-2xl bg-slate-50 p-6 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Something not working?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Accessibility issues, broken links, and rendering bugs are treated as
          priority fixes. If you run into one, please reach out &mdash; details
          about your browser and assistive technology help a lot.
        </p>
      </footer>
    </main>
  );
}
