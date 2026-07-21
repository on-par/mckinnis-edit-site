# The McKinnis Edit

A one-page marketing site for The McKinnis Edit, a San Antonio photography studio led by
Michael McKinnis, offering brand, portrait, headshot and event photography.

Live: https://on-par.github.io/mckinnis-edit-site/

## Stack

- [Astro](https://astro.build) 7, static output
- `astro:assets` for image optimization (source JPEGs are converted to responsive WebP at build)
- Self-hosted fonts via `@fontsource` (Playfair Display for headlines, DM Sans for body)
- No client framework. One small inline script for the sticky header and scroll reveals.

## Structure

Single page with anchor-scroll navigation: hero, brand statement, services, featured work,
memberships, workshops, about, contact.

```
src/
  assets/photos/   32 original session photographs (the only images used on the site)
  pages/index.astro  the whole page
  styles/global.css  design tokens and base styles
public/            favicon and .nojekyll
verify.mjs         Playwright gate that runs against the live URL
```

## Brand tokens

| Role | Hex |
| --- | --- |
| Primary / background dark | `#243b6c` |
| Accent / gold | `#d1a54a` |
| Light background | `#f9f5f1` |
| Text / body (on dark) | `#dbc2af` |
| Secondary accent | `#aebfaf` |

On the light background, body copy uses a dark ink derived from the navy (`#1a2a4d`) so it
stays readable. `#dbc2af` only has sufficient contrast on the navy.

## Develop

```sh
npm install
npm run dev
npm run build      # outputs to dist/
```

## Deploy

Pages is served from the `gh-pages` branch, not GitHub Actions (the available token has no
`workflow` scope, so a workflow file cannot be pushed).

```sh
npm run build
npm run deploy     # publishes dist/ to the gh-pages branch
```

`npm run deploy` force-pushes the contents of `dist/` (plus a `.nojekyll` marker) to
`gh-pages`. Pages is configured with `source.branch = gh-pages`, `source.path = /`.
`astro.config.mjs` sets `site: 'https://on-par.github.io'` and `base: '/mckinnis-edit-site'`,
so every asset and internal link resolves under the project subpath.

## Verify

```sh
npm run build && npm run deploy
node verify.mjs                                   # defaults to the live URL
```

The gate asserts HTTP 200, zero console errors, zero failed requests, one `<h1>`, a real meta
description, non-empty `alt` plus a non-zero `naturalWidth` on every image, at least 8 rendered
images, no em dash anywhere in the body text, presence of the required brand strings, working
nav anchors, and no horizontal overflow at 390x844. It writes `shots/desktop-full.png` and
`shots/mobile-full.png`.

## Content notes

Copy is written from the client design brief only. Deliberately not present because the brief
leaves them blank: testimonials, pricing, phone number, Dubsado booking link, social links.
All photography is original work by Michael McKinnis / The McKinnis Edit.
