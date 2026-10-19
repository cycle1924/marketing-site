import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static marketing site. No SSR, no database.
// site is required by the sitemap integration and is the base for every
// absolute URL the layout derives (canonical, og:url).
export default defineConfig({
  site: 'https://www.peelforward.com',
  output: 'static',
  // Short-lived event pages stay out of the sitemap (and carry noindex).
  integrations: [sitemap({ filter: (page) => !page.includes('/ilc') })],
});
