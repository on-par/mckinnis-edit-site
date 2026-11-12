# CLAUDE.md — The McKinnis Edit website

You're taking over a finished static website for **The McKinnis Edit**, Michael McKinnis's photography studio in San Antonio, TX. The design is approved. Your main job is to **wire up Dubsado** (booking links and lead capture) and help Michael fill in the remaining content. Do not redesign anything unless Michael asks.

## Start here

1. Read `README.md` (overview), then `docs/DUBSADO-INTEGRATION.md` (the integration spec — your primary task), then `docs/LAUNCH-CHECKLIST.md` (all open items).
2. Ask Michael which Dubsado option he wants (A = Zapier webhook, recommended; B = Dubsado's embedded form; C = serverless function), what Dubsado plan he's on (Zapier needs **Premier**), and where the site will be hosted.
3. Work through the spec's acceptance criteria and the launch checklist with him.

## Stack and conventions

- Plain **HTML + CSS + vanilla JS**. No build step, no framework, no npm. Keep it that way.
- One stylesheet: `css/styles.css` (CSS custom properties at the top: `--navy #243b6c`, `--paper`, `--stone`, `--ink`; fonts Cormorant Garamond (display) + Jost (body) from Google Fonts).
- One script: `js/main.js`. Each feature is a self-contained IIFE that returns early if its markup isn't on the page. The **`CONFIG` object at the top** holds every integration setting.
- Five pages share the same header, footer, contact form and lightbox markup. **The header, contact section and footer are duplicated in each HTML file** — when you change one, change all five (`index.html` + `portfolio/*.html`). Portfolio pages use `../` paths.
- Images are WebP in `img/` and `img/portfolio/<category>/` with `-800`, `-1200`, `-1800` width variants used via `srcset`. Keep `alt` text descriptive; add `width`/`height` on new images.

## Features you must not break

- **Hero carousel** (`[data-carousel]`): per-slide gradient background (each `.hero__slide` has `data-tint` and `data-focus`), auto-advance, pause button, reduced-motion support. `--pos` / `--pos-m` on each slide control the desktop / mobile photo crop so faces aren't cut off.
- **Hero title fit** (`[data-fit-title]`): JS sizes the heading so the longest `.hero__title-line` fills its column.
- **Ghost nav**: transparent over the hero, `.is-solid` (navy) after scrolling 40px. Portfolio dropdown is CSS hover/focus.
- **Broken-image fallback**: images that fail get `.is-missing` and show a tinted placeholder. The lightbox `<img data-lb-img>` is excluded on purpose (it starts empty) — keep it excluded.
- **Structured data**: each page has JSON-LD in `<head>`. Portfolio pages include an **FAQPage** that mirrors the visible FAQ — if you edit an FAQ answer, edit it in **both** places.

## Dubsado: the essentials

- **Current setup (Nov 2026):** contact sections embed Dubsado lead capture iframes (`[data-dubsado-form]`, auto-sized by iframe-resizer 3.5.14 from cdnjs). See the status note in docs/LAUNCH-CHECKLIST.md for which form is on which page. Michael is on Dubsado Premier.

- No full public REST API. Integrate via **Zapier** (Webhooks → Dubsado "Create Project"), Dubsado's **embedded lead capture form**, or a **server-side function**. Details and field mapping in `docs/DUBSADO-INTEGRATION.md`.
- Package links: fill each `data-dubsado-url` on the 12 package inputs in `index.html`. The fallback is `CONFIG.DUBSADO_FALLBACK_URL`.
- Contact form: set `CONFIG.CONTACT_ENDPOINT`. Keep `CONTACT_FORMAT: 'form'` for Zapier (avoids a CORS preflight Zapier won't answer).
- **Never put API keys or secrets in front-end files.**

## Content rules

- Don't invent prices, turnaround times, package inclusions or policies. Placeholders are marked `$—`, `[...]` and `[Confirm ...]` — ask Michael for the real values.
- Keep the voice: calm, editorial, first-person-plural studio voice; short sentences.
- The canonical domain is `https://on-par.github.io/mckinnis-edit-site` (this repo's GitHub Pages subpath). If a custom domain is pointed at the site later, update canonicals, Open Graph URLs, JSON-LD and `sitemap.xml` together.

## Testing

- Open the HTML files directly in a browser, or serve the folder (`python3 -m http.server`) and visit http://localhost:8000.
- Test at ~390px, ~1024px and ~1440px wide. Test the contact form from each page and confirm the lead lands in Dubsado.
- Validate JSON-LD with Google's Rich Results Test after any FAQ or business-info change.
