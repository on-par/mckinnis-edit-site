# Dubsado integration — spec

Two things on this site need to connect to Dubsado:

1. **Package booking** (home page, `#packages`) — visitor picks a package → "Continue to booking" opens the matching Dubsado scheduler / proposal.
2. **Contact form** (bottom of all 5 pages) — visitor submits → Michael gets an **email** and a **lead** (contact + project) is created in **Dubsado**.

Nothing here is wired yet. The site runs in a safe "demo mode" until the values below are filled in.

---

## Key facts about Dubsado (verified November 2026)

- Dubsado has **no full public REST API**. There is no endpoint a website can safely POST to directly.
- Dubsado **lead capture forms** can be embedded (iframe) or linked. Every submission automatically creates a contact and a project in Dubsado.
- Dubsado's **Zapier** integration offers the action **Create Project** (plus a beta raw "API Request" action). Triggers include *New Project as Lead*, *Contract Signed*, *Project Status Updated* and *New Payment Received*.
- The Zapier integration **requires a Dubsado Premier plan**.
- Never put a Dubsado or Zapier API key in `js/main.js` or any front-end file — it would be public.

Sources: help.dubsado.com ("Share a lead capture form", "Dubsado triggers and actions in Zapier"); help.zapier.com ("How to get started with Dubsado on Zapier").

---

## Part 1 — Package booking links

**Where:** `index.html`, inside `<section id="packages">`. Each package is a radio input:

```html
<input type="radio" name="package" value="brand-signature"
       data-service="Brand" data-name="Signature" data-dubsado-url="">
```

**What to do:**

1. In Dubsado, create (or reuse) an **appointment scheduler** or **public proposal** per package. Michael decides how granular this is — one per package (18), one per service (6), or one for everything.
2. Paste each link into that input's `data-dubsado-url`.
3. Any input left empty falls back to `CONFIG.DUBSADO_FALLBACK_URL` in `js/main.js` (currently Michael's existing scheduler: `https://hello.dubsado.com/public/appointment-scheduler/62105b369a4d30eaf363a718/schedule`).

**Done, November 17, 2026 — one scheduler per service (6).** Proposals were ruled out for this slot: they're designed to be applied to an existing project (sent privately after a lead is reviewed), not opened cold from a public link. Each scheduler below is a duplicate of the "Free Consultation" template (15 min, "I'll call you at the scheduled time!"); the public link pattern is `https://hello.dubsado.com/public/appointment-scheduler/<id>/schedule`.

| Service | Scheduler template | Admin ID |
|---|---|---|
| Brand | Brand Photography Consultation | `6afc6e4deabf1f81e0a5f2f9` |
| Portrait | Portrait Photography Consultation | `6afc6ef8eabf1f81e0a6142f` |
| Headshot | Headshot Photography Consultation | `6afc6f19eabf1f81e0a61a44` |
| Event | Event Photography Consultation | `6afc6f42eabf1f81e0a62416` |
| Wedding | Wedding Photography Consultation | `6afc6f76eabf1f81e0a631c1` |
| Interior Design | Interior Design Photography Consultation | `6afc6fadeabf1f81e0a63cd8` |

Each still carries the duplicated placeholder calendar description ("Greetings from Sample Templates for New Accounts!") — worth customizing per service in Dubsado when there's time, but it doesn't block booking.

After the consult, Michael sends the matching **Proposal** (7 already exist, several already branded) from within that lead's project — that's where the contract and invoice live, per Dubsado's own design for proposals.

**Behaviour already built** (`js/main.js`, "Package selector → Dubsado"): selecting a card updates the sticky summary bar and sets the "Continue to booking" link to that URL; it opens in a new tab. No further code is needed for Part 1.

Package `value`s: `brand-essential`, `brand-signature`, `brand-full-edit`, `portrait-mini`, `portrait-milestone`, `portrait-lifestyle`, `headshot-individual`, `headshot-team`, `headshot-enterprise`, `event-2hr`, `event-half`, `event-full`.

---

## Part 2 — Contact form → email + Dubsado lead

### The form (identical markup on all 5 pages)

`<form class="contact-form" data-contact-form>` inside `<section id="contact">`. Fields (`name` attributes):

| Field | Required | Notes |
|---|---|---|
| `firstName` | yes | |
| `lastName` | yes | |
| `email` | yes | type=email |
| `phone` | no | |
| `service` | yes | select: Brand / headshot photography · Portrait photography · Event photography · Wedding photography · Interior design photography · Not sure yet. Pre-selected on each portfolio page. |
| `date` | no | type=date, "ideal date" |
| `message` | yes | "What are you building?" |
| `company` | — | **honeypot** (hidden). If filled, the submission is silently dropped. |

`js/main.js` adds three fields before sending: `source` ("themckinnisedit.com contact form"), `page` (path of the page it came from, e.g. `/portfolio/weddings.html`) and `submittedAt` (ISO timestamp).

### How it sends (already built)

`js/main.js` → "Contact form" block. If `CONFIG.CONTACT_ENDPOINT` is set it POSTs the fields there; a non-2xx response shows an error with Michael's email and phone. If it's empty, it runs in demo mode (logs the payload to the console, shows the thank-you, sends nothing).

```js
CONTACT_ENDPOINT: '',      // ← set this
CONTACT_FORMAT: 'form',    // 'form' = application/x-www-form-urlencoded (default), 'json' = application/json
```

`'form'` is deliberate: it is a "simple" CORS request with no preflight, which Zapier catch hooks accept from a browser. Only switch to `'json'` for an endpoint you control that answers `OPTIONS` preflight requests.

### Recommended: Option A — Zapier webhook (no server needed)

Requires Dubsado Premier + a Zapier plan that includes webhooks.

1. **Zapier → Create Zap → Trigger: Webhooks by Zapier → Catch Hook.** Copy the hook URL (`https://hooks.zapier.com/hooks/catch/…/…/`).
2. Put that URL in `CONFIG.CONTACT_ENDPOINT` in `js/main.js`. Keep `CONTACT_FORMAT: 'form'`.
3. Submit the form once from the site so Zapier can see sample data.
4. **Action 1: Dubsado → Create Project.** Map `firstName`, `lastName`, `email`, `phone` to the client; project name e.g. `{{service}} — {{firstName}} {{lastName}}`; status **Lead**; put `message`, `date` and `page` into notes. Choose the Dubsado workflow to apply if Michael uses one for new leads.
5. **Action 2: Email by Zapier (or Gmail) → Send email** to themckinnisedit@gmail.com with all fields. (Skip if Dubsado's own new-lead notification is enough.)
6. Optional: **Filter by Zapier** before the actions to stop spam (e.g. only continue if `email` contains "@").
7. Turn the Zap on and run the QA below.

### Option B — Dubsado's own lead capture form (zero code, least control)

Replace the `<form class="contact-form">` with Dubsado's lead capture **embed code** (Dubsado → Forms → the lead capture → Sharing → Embed code). Dubsado creates the contact + project and sends its own notifications. Trade-offs: Dubsado's form styling, an iframe that needs a sensible min-height, and you lose the per-page `service` pre-selection and `page` tracking. If chosen, apply it on all 5 pages and remove the contact-form CSS/JS only if no page still uses it.

### Option C — Serverless function (most control)

Host on Netlify / Vercel / Cloudflare and add a function (e.g. `/api/lead`) that validates the payload, sends the email (Resend, Postmark, SES…) and calls Zapier or Dubsado server-side with secrets stored as environment variables. Set `CONTACT_ENDPOINT: '/api/lead'` and `CONTACT_FORMAT: 'json'` (the function must handle CORS if on another domain). Only worth it if Michael wants no Zapier dependency or needs custom logic.

### Acceptance criteria

- [ ] Submitting from **each** of the 5 pages creates exactly one Dubsado project with status Lead and correct name, email, phone, service.
- [ ] `page` shows which landing page the lead came from.
- [ ] Michael receives an email for each submission.
- [ ] Filling the hidden `company` field (bots) creates nothing.
- [ ] If the endpoint is down, the visitor sees the error message with email + phone, not a fake "thank you".
- [ ] No API keys or secrets in any front-end file.
- [ ] Every package's "Continue to booking" opens the intended Dubsado link.
