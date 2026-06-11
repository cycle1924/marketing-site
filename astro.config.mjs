import { defineConfig } from 'astro/config';

// Static marketing site. No SSR, no database.
export default defineConfig({
  output: 'static',
});
