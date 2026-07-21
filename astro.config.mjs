// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://on-par.github.io',
  base: '/mckinnis-edit-site',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
