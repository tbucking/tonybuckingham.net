import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { PRIVATE_ROUTES, SITE_URL } from '@/lib/site';

// Build the sitemap once at build time from the app directory, so new pages
// appear without editing this file.
export const dynamic = 'force-static';

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx|md)$/;

function isPrivate(route: string) {
  return PRIVATE_ROUTES.some(
    (privateRoute) => route === privateRoute || route.startsWith(`${privateRoute}/`)
  );
}

function findRoutes(dir: string, segments: string[] = []): string[] {
  const routes: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && PAGE_FILE.test(entry.name))) {
    routes.push(`/${segments.join('/')}`);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;

    // Skip private folders (_x), parallel routes (@x), and dynamic segments
    // ([x]) whose URLs cannot be known from the file tree.
    if (name.startsWith('_') || name.startsWith('@') || name.startsWith('[')) {
      continue;
    }

    // Route groups (x) organize files without adding a URL segment.
    const isGroup = name.startsWith('(') && name.endsWith(')');
    // Intercepting routes like (.)x or (..)x are not standalone pages.
    if (name.startsWith('(.')) continue;

    routes.push(
      ...findRoutes(path.join(dir, name), isGroup ? segments : [...segments, name])
    );
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set(findRoutes(APP_DIR))]
    .filter((route) => !isPrivate(route))
    .sort()
    .map((route) => ({
      url: route === '/' ? SITE_URL : `${SITE_URL}${route}`,
      changeFrequency: route === '/' ? 'monthly' : 'yearly',
      priority: route === '/' ? 1 : 0.5
    }));
}
