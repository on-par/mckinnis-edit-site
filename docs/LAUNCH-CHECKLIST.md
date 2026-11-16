# Launch checklist

> **Status, November 11, 2026 (wired by Claude with Michael):**
> - Contact: Option B chosen. Each page embeds a Dubsado lead capture form (no Zapier). Home + Interior Design: "General Inquiry Lead Capture" (6af4f035b696b04a883c3a5e). Branding & Headshots: "Headshot Photography Lead Capture" (6adfe57bff2201b3f258b656). Events: "Event Photography Lead Capture" (6aa769157fc4536f4ea46ae0). Weddings: "Lead Capture" (62105b369a4d30eaf363a6fc, the wedding questionnaire). The custom form markup was removed; its CSS/JS is left dormant.
> - Booking: every package uses DUBSADO_FALLBACK_URL (current scheduler) until per-package links are chosen.
> - Packages: prices show "Inquire" and bracketed inclusions were removed until Michael sends pricing.
> - FAQ "[Confirm ...]" notes removed in both visible FAQ and JSON-LD.
> - Domain: canonical is https://themckinnisedit.com (www redirects to it).
>
> **Status, November 12, 2026 (hosting migration):** This site replaced the old one-page Astro build that was previously in the `on-par/mckinnis-edit-site` GitHub repo. It's now deployed from that repo's `gh-pages` branch at `https://on-par.github.io/mckinnis-edit-site/`, so canonical URLs, Open Graph tags, JSON-LD and `sitemap.xml`/`robots.txt` currently point there instead of `themckinnisedit.com`. Point the custom domain at this repo and do a find-and-replace of the base URL once DNS is ready — see README.md → Hosting.
>
> **Status, November 16, 2026 (approved pricing applied):** Michael sent the approved gallery names and final pricing sheet. All "Inquire" placeholders in `#packages` are now replaced with real "Starting at $X" prices, and two package tabs that were missing entirely — **Wedding** and **Interior Design** — were added (the portfolio pages for those services already linked to `#packages`, but there was nothing there to select). Tier names matched the approved sheet exactly for Brand/Portrait/Headshot/Event. Add-on items (Headshot Mini Session, Additional Team Member, Additional Retouched Image, Custom Wedding Albums, Fine Art Wall Prints, Framed Wall Art) are shown as a note rather than selectable packages, all marked Custom Quote, per the sheet's instruction not to publish deliverable/image-count specifics.

Everything still to fill in or decide before the site goes live. Search the files for the placeholder text shown to find each one.

## 1. Packages (index.html → `#packages`)

- [x] **Prices** — all 6 service tabs (Brand, Portrait, Headshot, Event, Wedding, Interior Design) now show real "Starting at $X" prices from the approved pricing sheet. Headshot's "Company Day" and all wedding/headshot add-ons are marked "Custom Quote".
- [x] **Package names and descriptions** — tier names match the approved sheet. Bracketed placeholder inclusions were already removed in the Nov 11 pass.
- [ ] **"Most booked" / "Graduates" / "On-site" badges** — keep, change or delete. (No badge was added to the new Wedding/Interior Design tabs — ask Michael if he wants one.)
- [ ] **Dubsado booking link per package** — each package `<input>` has `data-dubsado-url=""` (18 total now, including the 6 new Wedding/Interior Design ones). Paste the Dubsado scheduler or proposal link for that package. Empty ones fall back to `DUBSADO_FALLBACK_URL` in `js/main.js` (currently Michael's existing scheduler). See docs/DUBSADO-INTEGRATION.md.
- [ ] **Gallery naming** — the approved sheet's "Website Gallery Navigation" list names 6 distinct galleries (Branding, Portraits, Headshots, Events, Interiors & Architecture, Weddings), but the live portfolio nav still only has 4 pages (Branding & Headshots combined into one page; no standalone Portraits gallery; "Interior Design" not "Interiors & Architecture"). Splitting/renaming galleries to match wasn't done yet — confirm with Michael whether that's wanted before launch or as a follow-up.

## 2. Contact form (all 5 pages)

- [ ] Set `CONTACT_ENDPOINT` in `js/main.js` so submissions send an email and create a Dubsado lead. Until then the form is in demo mode: it validates and shows "Thank you" but **sends nothing**. See docs/DUBSADO-INTEGRATION.md.

## 3. FAQ answers to confirm (portfolio pages)

Search for `[Confirm`:

- [ ] branding-headshots.html — typical turnaround
- [ ] events.html — preview set offered? full-gallery turnaround
- [ ] weddings.html — typical booking lead time
- [ ] weddings.html — typical turnaround
- [ ] interior-design.html — licensing terms (incl. co-licensing with builders/vendors)

Also review every FAQ answer for accuracy — they were drafted from the previous site's copy. One Interior Design answer mentions Cerissa McKinnis styling spaces; keep or remove.

**Important:** FAQ answers also appear in the structured data (`<script type="application/ld+json">`, FAQPage) in the `<head>` of each portfolio page. Update both places so they match.

## 4. Photos

- [ ] 3 branding photos were not included because downloads were disabled in Drive: `portfolio-branding-02`, `portfolio-branding-05` and a second `portfolio-branding-07`.
- [ ] 11 wedding photos are low resolution (≈430–640px): weddings-26 through 31 and 33 through 36. Fine as thumbnails, soft when enlarged. Replace with larger exports or remove.
- [ ] Grand Prix photo (`portfolio-events-08`) is only 1200px wide — a larger export would look sharper in the hero.
- [ ] About photo (`img/michael-mckinnis.webp`) is 760px wide. A larger or vertical version would fill the column better.
- [ ] Logo (`img/logo-light.png`) is 360×160. An SVG would be ideal.
- [x] Favicon — reused `favicon-32.png` / `apple-touch-icon.png` / `logo-512.png` from the previous Astro site (navy background, so the white logo reads fine).

## 5. Domain & SEO

- [ ] Point `themckinnisedit.com` at this repo's GitHub Pages site and confirm the live URL, then find-and-replace the canonical base URL from `https://on-par.github.io/mckinnis-edit-site` back to the custom domain across all `.html` files, `sitemap.xml` and `robots.txt` (used in canonical tags, Open Graph, structured data and sitemap.xml).
- [ ] After launch: submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Create/claim the Google Business Profile and make sure name, phone and city match the site exactly.

## 6. Final QA

- [ ] Click every nav link and dropdown item on desktop and mobile.
- [ ] Submit the contact form from each of the 5 pages and confirm the email arrives and the lead appears in Dubsado with the right service.
- [ ] Select a package in each tab and confirm "Continue to booking" opens the right Dubsado link.
- [ ] Check pages at phone, tablet and desktop widths.
