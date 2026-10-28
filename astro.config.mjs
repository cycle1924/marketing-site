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
  build: {
    // Keep every stylesheet in its own file rather than inlined into the
    // HTML. The Content-Security-Policy in public/serve.json allows styles
    // and scripts from this origin and nothing inline, so anything inlined
    // would be blocked by the browser. Astro inlines small bundles by
    // default, which is why this is set explicitly.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Same reason, for scripts.
      assetsInlineLimit: 0,
    },
  },
});
