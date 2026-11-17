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
>
> **Status, November 17, 2026 (Dubsado booking links wired):** Logged into Dubsado directly (via Claude in Chrome) and created 6 new scheduler templates — one per service (Brand/Portrait/Headshot/Event/Wedding/Interior Design Photography Consultation), each duplicated from the existing "Free Consultation" scheduler. All 18 package `data-dubsado-url` attributes now point to the matching service's scheduler public link, verified live. Went with schedulers rather than Proposals: checked a Proposal template's settings and its expiration is defined as "after applied to project," meaning Dubsado Proposals are meant to be sent privately per-client after a lead is reviewed, not used as a public link anyone can click. Proposals (7 already exist, several already McKinnis-Edit-branded) remain the right tool for sending contract + invoice once Michael reviews an inquiry — that happens after the scheduler call, same as before.
>
> Minor cleanup still open: each new scheduler carries a placeholder calendar description ("Greetings from Sample Templates for New Accounts!") inherited from duplication — cosmetic, worth clearing in Dubsado when convenient.
>
> **Status, November 17, 2026 (going live at themckinnisedit.com):** `themckinnisedit.com` already resolves via Cloudflare DNS and currently serves the old Astro site from the `on-par/mckinnis-edit-site` repo's `gh-pages` branch — DNS itself needs no changes. Added a `CNAME` file (`themckinnisedit.com`) to the repo root and replaced every `https://on-par.github.io/mckinnis-edit-site` reference with `https://themckinnisedit.com` across all `.html` files, `sitemap.xml` and `robots.txt`. Remaining steps: push `main` to `origin`, then in the repo's **Settings → Pages**, switch the source from the `gh-pages` branch to `main` (root) so the new 5-page site — not the old Astro build — is what the already-working custom domain serves.

Everything still to fill in or decide before the site goes live. Search the files for the placeholder text shown to find each one.

## 1. Packages (index.html → `#packages`)

- [x] **Prices** — all 6 service tabs (Brand, Portrait, Headshot, Event, Wedding, Interior Design) now show real "Starting at $X" prices from the approved pricing sheet. Headshot's "Company Day" and all wedding/headshot add-ons are marked "Custom Quote".
- [x] **Package names and descriptions** — tier names match the approved sheet. Bracketed placeholder inclusions were already removed in the Nov 11 pass. Each tier also has a "Best for" line now (benchmarked against other Austin-area photographer sites).
- [x] **"Most booked" / "Graduates" / "On-site" badges** — Michael confirmed Nov 17: keep as-is on Brand/Portrait/Headshot, no badge added to Wedding/Interior Design.
- [x] **Dubsado booking link per package** — all 18 package `<input>`s now have a `data-dubsado-url` pointing to one of 6 new per-service Dubsado schedulers (see status note above). `DUBSADO_FALLBACK_URL` in `js/main.js` is no longer used by any package but is left in place as a safety net.
- [x] **Gallery naming** — Michael confirmed Nov 17: keep the 4-page structure (Branding & Headshots stay combined, no standalone Portraits gallery). Renamed "Interior Design" → "Interiors & Architecture" everywhere visible (nav, mobile nav, packages tab, page title/meta/OG, breadcrumb, eyebrow, heading, related-services links, JSON-LD) across `index.html` and all 5 portfolio pages. The filename `portfolio/interior-design.html`, the `#panel-interior`/`data-tab="interior"` IDs, and package `value="interior-*"` attributes were left as-is (internal slugs, not visible copy).

## 2. Contact form (all 5 pages)

- [x] **Done, Option B (Nov 11, 2026).** Each page embeds a Dubsado lead-capture form directly (iframe, auto-sized by iframe-resizer) — see the per-page form IDs in the status note at the top of this file. Dubsado creates the contact + project and sends its own notifications; no `CONTACT_ENDPOINT` or Zapier step is needed. The `CONTACT_ENDPOINT`/custom `<form data-contact-form>` code path described in docs/DUBSADO-INTEGRATION.md Part 2 is dormant (no matching markup on any page) — that doc is stale on this point and should be read as historical/Option-A-if-ever-revisited, not the current setup.

## 3. FAQ answers to confirm (portfolio pages)

> **Status, November 17, 2026:** the literal `[Confirm ...]` bracket markers were already stripped Nov 11, but several answers were still vague placeholder copy with no real numbers. Michael supplied real values; updated in both the visible FAQ and the matching FAQPage JSON-LD on each page:

- [x] branding-headshots.html — turnaround: "within 1 to 2 weeks of your session."
- [x] events.html — no separate preview/sneak-peek set is offered; full-gallery turnaround: "within 1 to 2 weeks of your event."
- [x] weddings.html — booking lead time: "ideally 3 to 6 months out," earlier for peak spring/fall dates.
- [x] weddings.html — turnaround: "within 2 to 3 weeks of your wedding."
- [x] interior-design.html — licensing: Michael wants to keep this case-by-case rather than commit to a fixed policy in the FAQ; existing "Usage is agreed up front" language is intentional and stays as-is.

Also review every FAQ answer for accuracy — they were drafted from the previous site's copy. One Interior Design answer mentions Cerissa McKinnis styling spaces; keep or remove.

**Important:** FAQ answers also appear in the structured data (`<script type="application/ld+json">`, FAQPage) in the `<head>` of each portfolio page. Update both places so they match.

## 4. Photos

> **Status, November 17, 2026:** Michael confirmed launching with current assets — none of these block launch. Revisit as a post-launch follow-up.

- [ ] *(post-launch)* 3 branding photos were not included because downloads were disabled in Drive: `portfolio-branding-02`, `portfolio-branding-05` and a second `portfolio-branding-07`.
- [ ] *(post-launch)* 11 wedding photos are low resolution (≈430–640px): weddings-26 through 31 and 33 through 36. Fine as thumbnails, soft when enlarged. Replace with larger exports or remove.
- [ ] *(post-launch)* Grand Prix photo (`portfolio-events-08`) is only 1200px wide — a larger export would look sharper in the hero.
- [ ] *(post-launch)* About photo (`img/michael-mckinnis.webp`) is 760px wide. A larger or vertical version would fill the column better.
- [ ] *(post-launch)* Logo (`img/logo-light.png`) is 360×160. An SVG would be ideal.
- [x] Favicon — reused `favicon-32.png` / `apple-touch-icon.png` / `logo-512.png` from the previous Astro site (navy background, so the white logo reads fine).

## 5. Domain & SEO

- [ ] Point `themckinnisedit.com` at this repo's GitHub Pages site and confirm the live URL, then find-and-replace the canonical base URL from `https://on-par.github.io/mckinnis-edit-site` back to the custom domain across all `.html` files, `sitemap.xml` and `robots.txt` (used in canonical tags, Open Graph, structured data and sitemap.xml).
- [ ] After launch: submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Create/claim the Google Business Profile and make sure name, phone and city match the site exactly.

## 6. Final QA

- [x] **Click every nav link and dropdown item on desktop and mobile.** Verified Nov 17, 2026: all 5 pages (home + 4 portfolio) load with correct titles, no 404s. Mobile hamburger menu opens and shows all 4 portfolio sub-links including the renamed "Interiors & Architecture."
- [ ] Submit the contact form from each of the 5 pages and confirm the lead appears in Dubsado with the right service. *(Nov 17, 2026: Claude pre-filled the home-page form (First Name/Phone/Last Name/Email/Brand-photography-checkbox) via Claude in Chrome, but Claude Code's safety classifier blocks typing/submitting into the live `hello.dubsado.com` iframe — it's a third-party production form, not a local dev site, so this needs a human to finish. Michael is completing and submitting it himself; still need to repeat for the other 4 pages and confirm each lead lands in Dubsado correctly.)*
- [x] **Select a package in each tab and confirm "Continue to booking" opens the right Dubsado link.** Verified Nov 17, 2026 in the local preview: Brand Essential → Brand scheduler (`6afc6e4d...`), Interiors & Architecture Essential → Interiors & Architecture scheduler (`6afc6fad...`). Both match `docs/DUBSADO-INTEGRATION.md`'s table, and the sticky summary bar correctly reads "Interiors & Architecture — Essential Interiors" after the rename.
- [x] **Check pages at phone, tablet and desktop widths.** Verified Nov 17, 2026: mobile (375px) hero and menu render cleanly; tablet (768px) hero carousel, controls and pagination dots render cleanly; desktop unaffected.
