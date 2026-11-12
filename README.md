# The McKinnis Edit — website

Static, responsive website for **The McKinnis Edit** (Michael McKinnis, brand / portrait / headshot / event / wedding / interior photography, San Antonio, TX).

Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies. Open `index.html` in a browser to view it, or upload the whole folder to any static host.

Designed and built by Adrienne Palmer (Studio Nouveaux), November 2026.

---

## What's in the box

```
index.html                     Home page
portfolio/
  branding-headshots.html      Landing page — Branding & Headshots
  events.html                  Landing page — Events
  weddings.html                Landing page — Weddings
  interior-design.html         Landing page — Interior Design
css/styles.css                 All styles (one file)
js/main.js                     All behaviour (one file) — CONFIG block at the top
img/                           Logo, About photo, home hero photos
img/portfolio/<category>/      Portfolio photos, optimized WebP at 800/1200/1800px
sitemap.xml, robots.txt        For search engines
CLAUDE.md                      Instructions for Claude (AI) taking over the project
docs/DUBSADO-INTEGRATION.md    Spec for wiring forms and booking to Dubsado
docs/LAUNCH-CHECKLIST.md       Everything left to fill in before going live
```

## Features

- **Hero** — full-screen navy hero with a soft gradient that changes color with each slide (#243b6c, #d1a54a, #aebfaf, #dbc2af, #f9f5f1), auto-advancing photo carousel with pause / previous / next, swipe on mobile, and a still version for visitors who turn on "reduce motion".
- **Navigation** — transparent over the hero, fills navy on scroll; Portfolio dropdown with the four landing pages; full-screen menu on mobile.
- **Packages** — tabs per service, select a package, then "Continue to booking" opens that package's Dubsado link.
- **Portfolio landing pages** — each works as a standalone landing page for search and AI answer engines: own hero, plain-language summary, quick facts, full photo gallery with lightbox, FAQ, links to the other categories, and a contact form with the service pre-selected.
- **SEO / AEO** — unique titles and descriptions, canonical URLs, Open Graph tags, and structured data (ProfessionalService, Service, FAQPage, BreadcrumbList) on every page; descriptive alt text on every photo; sitemap and robots.txt.
- **Performance** — responsive WebP images (the browser picks the right size), lazy loading below the fold, no third-party scripts except Google Fonts.

## Hosting

Deployed as this repo's GitHub Pages site (`gh-pages` branch), served at `https://on-par.github.io/mckinnis-edit-site/`. All internal links/assets are relative, so the site works under that subpath without changes.

The canonical URLs, Open Graph tags and sitemap assume the site lives at **https://on-par.github.io/mckinnis-edit-site** with portfolio pages at `/portfolio/<name>.html`. If a custom domain (e.g. themckinnisedit.com) is pointed at this site later, or the path changes, search-and-replace the current base URL across all `.html` files, `sitemap.xml` and `robots.txt`.

## Before launch

See **docs/LAUNCH-CHECKLIST.md**. The short version: package prices and details, Dubsado booking links per package, the contact form endpoint, and a few FAQ answers marked `[Confirm …]`.
