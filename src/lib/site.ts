// Netlify sets URL to the site's primary address on every build, including
// deploy previews, so canonical links always point at production.
export const SITE_URL = (process.env.URL ?? 'https://tonybuckingham.net').replace(/\/$/, '');

// Routes that exist but should not be crawled or listed in the sitemap.
export const PRIVATE_ROUTES = ['/admin', '/login'];
