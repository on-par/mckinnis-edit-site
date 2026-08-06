// @ts-check
import { defineConfig } from 'astro/config';

// Cloudflare Pages serves this at the domain root; GitHub Pages serves it
// under /mckinnis-edit-site/. CF_PAGES is set automatically by Cloudflare's
// build environment, and passed manually for local `wrangler pages deploy` builds.
const onCloudflare = Boolean(process.env.CF_PAGES);

export default defineConfig({
  site: onCloudflare ? 'https://mckinnis-edit-site.pages.dev' : 'https://on-par.github.io',
  base: onCloudflare ? '/' : '/mckinnis-edit-site',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
