// Verification gate for the live deployment.
// Usage: node verify.mjs [url]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'https://on-par.github.io/mckinnis-edit-site/';

const results = [];
let failed = 0;

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failed++;
  const tag = ok ? 'PASS' : 'FAIL';
  console.log(`${tag}  ${name}${detail ? `  ->  ${detail}` : ''}`);
}

mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

const consoleErrors = [];
const failedRequests = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(`${msg.text()}`);
});
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
page.on('requestfailed', (req) =>
  failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`)
);
page.on('response', (res) => {
  if (res.status() >= 400) failedRequests.push(`${res.url()} -> HTTP ${res.status()}`);
});

console.log(`\nVerifying ${URL}\n${'-'.repeat(60)}`);

const resp = await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
check('HTTP 200', resp?.status() === 200, `status ${resp?.status()}`);

// Nudge lazy images into view, then settle.
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1200);

check('No console errors', consoleErrors.length === 0, consoleErrors.join(' | '));
check('No failed network requests', failedRequests.length === 0, failedRequests.join(' | '));

const h1s = await page.locator('h1').count();
check('Exactly one <h1>', h1s === 1, `found ${h1s}`);

const desc = await page.getAttribute('meta[name="description"]', 'content').catch(() => null);
check(
  'meta description with real content',
  !!desc && desc.trim().length >= 50,
  desc ? `${desc.length} chars` : 'missing'
);

const imgs = await page.$$eval('img', (nodes) =>
  nodes.map((n) => ({
    src: n.currentSrc || n.src,
    alt: n.getAttribute('alt'),
    nw: n.naturalWidth,
  }))
);
const badAlt = imgs.filter((i) => !i.alt || !i.alt.trim());
const notLoaded = imgs.filter((i) => !(i.nw > 0));
check('Every <img> has non-empty alt', badAlt.length === 0, badAlt.map((i) => i.src).join(' | '));
check(
  'Every <img> actually loaded (naturalWidth > 0)',
  notLoaded.length === 0,
  notLoaded.map((i) => i.src).join(' | ')
);
check('At least 8 images render', imgs.length >= 8, `${imgs.length} images`);

const bodyText = await page.evaluate(() => document.body.innerText);
check('No em dash in rendered body text', !bodyText.includes('—'));

const required = [
  "LET'S CREATE TOGETHER",
  'San Antonio',
  'The Moment',
  'The Momentum',
  'The Archive',
  'mckinnis.edit@gmail.com',
];
for (const s of required) {
  check(`Contains "${s}"`, bodyText.includes(s));
}

const anchors = await page.$$eval('nav a[href^="#"], a.skip[href^="#"], a.mark[href^="#"]', (nodes) =>
  nodes.map((n) => n.getAttribute('href'))
);
const missingTargets = [];
for (const href of anchors) {
  const id = href.slice(1);
  if (!id) continue;
  const exists = await page.evaluate((i) => !!document.getElementById(i), id);
  if (!exists) missingTargets.push(href);
}
check(
  'Every nav anchor resolves to an element',
  missingTargets.length === 0,
  missingTargets.length ? missingTargets.join(', ') : `${anchors.length} anchors checked`
);

// Anchors actually scroll.
if (anchors.length) {
  const target = anchors.find((h) => h !== '#top') || anchors[0];
  await page.click(`nav a[href="${target}"]`);
  await page.waitForTimeout(1200);
  const y = await page.evaluate(() => window.scrollY);
  check(`Clicking ${target} scrolls the page`, y > 0, `scrollY ${y}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

await page.screenshot({ path: 'shots/desktop-full.png', fullPage: true });
check('Saved shots/desktop-full.png', true);

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(900);
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
  window.scrollTo(0, 0);
});
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);

const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
check(
  'No horizontal overflow at 390x844',
  overflow.scrollWidth <= overflow.innerWidth + 1,
  `scrollWidth ${overflow.scrollWidth} vs innerWidth ${overflow.innerWidth}`
);

await page.screenshot({ path: 'shots/mobile-full.png', fullPage: true });
check('Saved shots/mobile-full.png', true);

await browser.close();

console.log('-'.repeat(60));
console.log(failed === 0 ? `RESULT: PASS (${results.length} checks)` : `RESULT: FAIL (${failed} of ${results.length} checks failed)`);
process.exit(failed === 0 ? 0 : 1);
