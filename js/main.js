/* =========================================================
   The McKinnis Edit — site scripts
   ========================================================= */

/* ---------- CONFIG: fill these in later ---------- */
const CONFIG = {
  // Used when a package card has no data-dubsado-url of its own.
  // Currently the studio's existing Dubsado scheduler.
  DUBSADO_FALLBACK_URL:
    'https://hello.dubsado.com/public/appointment-scheduler/62105b369a4d30eaf363a718/schedule',

  // Contact form endpoint (email notification + Dubsado lead). See docs/DUBSADO-INTEGRATION.md.
  // e.g. a Zapier "Catch Hook" URL (https://hooks.zapier.com/hooks/catch/...) or a
  // serverless function. While empty, the form validates and shows the success state
  // without sending anything (demo mode — payload is logged to the console).
  CONTACT_ENDPOINT: '',

  // 'form' sends application/x-www-form-urlencoded — a "simple" CORS request with no
  // preflight, which Zapier catch hooks accept from the browser. Use 'json' only for an
  // endpoint you control that answers CORS preflight (OPTIONS) requests.
  CONTACT_FORMAT: 'form',
};

/* ---------- Broken images → styled placeholders ---------- */
document.querySelectorAll('img:not([data-lb-img])').forEach((img) => {
  const mark = () => img.classList.add('is-missing');
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) mark();
  else img.addEventListener('error', mark, { once: true });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: ghost → solid on scroll ---------- */
(() => {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const THRESHOLD = 40;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-solid', window.scrollY > THRESHOLD);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();

  // Mobile menu
  const toggle = header.querySelector('[data-menu-toggle]');
  const menu = header.querySelector('[data-mobile-menu]');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Close menu' : 'Menu';
    menu.hidden = !open;
    header.classList.toggle('menu-is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Highlight current section in nav
  const links = [...header.querySelectorAll('.primary-nav > ul > li > a')].filter((a) => a.getAttribute('href').startsWith('#'));
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  // Mark the current portfolio page in the dropdown
  const here = location.pathname.split('/').pop();
  header.querySelectorAll('.subnav a, .mobile-sub a').forEach((a) => {
    if (here && a.getAttribute('href').endsWith(here)) a.setAttribute('aria-current', 'page');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
})();

/* ---------- Hero title: scale so the longest line spans the column ---------- */
(() => {
  const title = document.querySelector('[data-fit-title]');
  if (!title) return;
  const lines = [...title.querySelectorAll('.hero__title-line')];
  const MAX = 168; // px cap for very wide screens
  const fit = () => {
    const col = title.parentElement.clientWidth;
    if (!col) return;
    title.style.fontSize = '100px';
    const widest = Math.max(...lines.map((l) => l.scrollWidth));
    if (!widest) return;
    title.style.fontSize = `${Math.min(MAX, Math.floor((100 * col) / widest) - 1)}px`;
  };
  fit();
  if (document.fonts?.ready) document.fonts.ready.then(fit);
  new ResizeObserver(fit).observe(title.parentElement);
})();

/* ---------- Hero carousel (auto-advancing) ---------- */
(() => {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const slides = [...root.querySelectorAll('.hero__slide')];
  const dotsWrap = root.querySelector('[data-dots]');
  const caption = root.querySelector('[data-caption]');
  const toggleBtn = root.querySelector('[data-toggle]');
  const bgWrap = root.querySelector('[data-bgs]');
  const bgs = slides.map((slide) => {
    const bg = document.createElement('div');
    bg.className = 'hero__bg';
    bg.style.setProperty('--tint', slide.dataset.tint || '#243b6c');
    bg.style.setProperty('--focus', slide.dataset.focus || '70% 30%');
    if ((slide.dataset.tint || '').toLowerCase() === '#243b6c') bg.setAttribute('data-base', '');
    bgWrap.appendChild(bg);
    return bg;
  });
  let index = 0;
  const single = slides.length < 2;
  if (single) root.classList.add('is-single');
  let paused = reduceMotion || single; // respect reduced-motion: no autoplay

  // Build progress indicators
  const dots = slides.map((slide, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Show slide ${i + 1}: ${slide.querySelector('figcaption')?.textContent || ''}`);
    btn.appendChild(document.createElement('span'));
    btn.addEventListener('click', () => goTo(i));
    li.appendChild(btn);
    dotsWrap.appendChild(li);
    return btn;
  });

  // Advance when the active progress bar finishes (pausing the CSS animation pauses the timer)
  dots.forEach((dot) => {
    dot.querySelector('span').addEventListener('animationend', () => {
      if (!paused && dot.classList.contains('is-active')) goTo(index + 1);
    });
  });

  function goTo(next) {
    const n = (next + slides.length) % slides.length;
    slides[index].classList.remove('is-active');
    index = n;
    const slide = slides[index];
    const img = slide.querySelector('img');
    if (img.loading === 'lazy') img.loading = 'eager';
    slide.classList.add('is-active');
    bgs.forEach((bg, i) => bg.classList.toggle('is-active', i === index));


    dots.forEach((d, i) => {
      d.classList.remove('is-active');
      d.classList.toggle('is-done', i < index);
      d.removeAttribute('aria-current');
    });
    void dots[index].offsetWidth; // restart the progress animation
    dots[index].classList.add('is-active');
    dots[index].setAttribute('aria-current', 'true');

    caption.classList.add('is-fading');
    setTimeout(() => {
      caption.textContent = slide.querySelector('figcaption')?.textContent || '';
      caption.classList.remove('is-fading');
    }, 300);

    // Warm the next image
    const upcoming = slides[(index + 1) % slides.length].querySelector('img');
    if (upcoming.loading === 'lazy') upcoming.loading = 'eager';
  }

  function setPaused(p) {
    paused = p;
    root.classList.toggle('is-paused', p);
    toggleBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
  }

  root.querySelector('[data-prev]').addEventListener('click', () => goTo(index - 1));
  root.querySelector('[data-next]').addEventListener('click', () => goTo(index + 1));
  toggleBtn.addEventListener('click', () => setPaused(!paused));

  // Keyboard arrows when focus is inside the hero
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // Swipe
  let startX = null;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Pause while hero is off-screen or tab hidden, resume after (unless user paused)
  let userPaused = false;
  toggleBtn.addEventListener('click', () => { userPaused = paused; });
  const autoPause = (hidden) => { if (!userPaused && !reduceMotion && !single) setPaused(hidden); };
  new IntersectionObserver(([entry]) => autoPause(!entry.isIntersecting), { threshold: 0.15 }).observe(root);
  document.addEventListener('visibilitychange', () => autoPause(document.hidden));

  setPaused(paused);
  goTo(0);
})();

/* ---------- Package selector → Dubsado ---------- */
(() => {
  const form = document.querySelector('[data-pkg-form]');
  if (!form) return;
  const tabs = [...document.querySelectorAll('.pkg-tabs [role="tab"]')];
  const panels = [...form.querySelectorAll('[data-panel]')];
  const label = form.querySelector('[data-pkg-label]');
  const cta = form.querySelector('[data-pkg-continue]');

  function selectTab(key, focus = false) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => { p.hidden = p.dataset.panel !== key; });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length].dataset.tab, true);
    });
  });

  // "See ___ packages" links on service cards open the matching tab
  document.querySelectorAll('[data-service-link]').forEach((a) => {
    a.addEventListener('click', () => selectTab(a.dataset.serviceLink));
  });

  form.addEventListener('change', (e) => {
    const input = e.target;
    if (input.name !== 'package') return;
    const url = input.dataset.dubsadoUrl || CONFIG.DUBSADO_FALLBACK_URL;
    label.textContent = `${input.dataset.service} — ${input.dataset.name}`;
    cta.href = url;
    cta.classList.remove('is-disabled');
    cta.removeAttribute('aria-disabled');
  });

  form.addEventListener('submit', (e) => e.preventDefault());
})();

/* ---------- Dubsado lead capture embed: auto-height ---------- */
// The iframe-resizer library (loaded from cdnjs in each page) sizes the Dubsado form
// to its content so visitors never see an inner scroll bar. If it fails to load, the
// iframe keeps its fixed height and still works.
(() => {
  const frames = document.querySelectorAll('[data-dubsado-form]');
  if (!frames.length) return;
  const start = () => {
    if (typeof window.iFrameResize === 'function') {
      window.iFrameResize({ checkOrigin: false }, '[data-dubsado-form]');
    }
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();

/* ---------- Contact form (legacy custom form; unused while Dubsado embeds are live) ---------- */
(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');

  const messages = {
    valueMissing: 'This field is required.',
    typeMismatch: 'Please enter a valid email address.',
  };

  function showError(field, msg) {
    const wrap = field.closest('.field');
    wrap.classList.add('has-error');
    let err = wrap.querySelector('.error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'error';
      err.id = `${field.id}-error`;
      wrap.appendChild(err);
    }
    err.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', err.id);
  }
  function clearError(field) {
    const wrap = field.closest('.field');
    wrap.classList.remove('has-error');
    wrap.querySelector('.error')?.remove();
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }

  form.querySelectorAll('input, select, textarea').forEach((f) => {
    f.addEventListener('input', () => { if (f.validity.valid) clearError(f); });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let firstInvalid = null;
    form.querySelectorAll('.field input, .field select, .field textarea').forEach((f) => {
      if (f.validity.valid) { clearError(f); return; }
      showError(f, f.validity.valueMissing ? messages.valueMissing : messages.typeMismatch);
      firstInvalid ||= f;
    });
    if (firstInvalid) { firstInvalid.focus(); status.textContent = ''; return; }

    const data = Object.fromEntries(new FormData(form));
    if (data.company) return; // honeypot tripped — silently drop
    delete data.company;
    data.source = 'themckinnisedit.com contact form';
    data.page = location.pathname; // which landing page the lead came from
    data.submittedAt = new Date().toISOString();

    form.classList.add('is-sending');
    status.textContent = 'Sending…';

    try {
      if (CONFIG.CONTACT_ENDPOINT) {
        const asJson = CONFIG.CONTACT_FORMAT === 'json';
        const res = await fetch(CONFIG.CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': asJson ? 'application/json' : 'application/x-www-form-urlencoded' },
          body: asJson ? JSON.stringify(data) : new URLSearchParams(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        console.info('[demo mode] Contact form payload:', data);
        await new Promise((r) => setTimeout(r, 600));
      }
      form.reset();
      status.textContent = `Thank you, ${data.firstName}. We'll be in touch soon.`;
    } catch (err) {
      console.error(err);
      status.innerHTML = 'Something went wrong. Please email <a href="mailto:themckinnisedit@gmail.com">themckinnisedit@gmail.com</a> or call 210-376-1166.';
    } finally {
      form.classList.remove('is-sending');
    }
  });
})();

/* ---------- Gallery lightbox ---------- */
(() => {
  const gallery = document.querySelector('[data-gallery]');
  const box = document.querySelector('[data-lightbox]');
  if (!gallery || !box || typeof box.showModal !== 'function') return;
  const imgs = [...gallery.querySelectorAll('img')];
  const view = box.querySelector('[data-lb-img]');
  let i = 0;
  const show = (n) => {
    i = (n + imgs.length) % imgs.length;
    view.classList.remove('is-missing');
    view.src = imgs[i].dataset.full || imgs[i].currentSrc || imgs[i].src;
    view.alt = imgs[i].alt;
  };
  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    show(imgs.indexOf(btn.querySelector('img')));
    box.showModal();
  });
  box.querySelector('[data-lb-close]').addEventListener('click', () => box.close());
  box.querySelector('[data-lb-prev]').addEventListener('click', () => show(i - 1));
  box.querySelector('[data-lb-next]').addEventListener('click', () => show(i + 1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

/* ---------- Reveal on scroll ---------- */
(() => {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.section-head, .edit__grid > *, .service-card, .pkg-tabs, .gallery li, .about__grid > *, .contact__grid > *');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  targets.forEach((t, n) => {
    t.classList.add('reveal');
    t.style.transitionDelay = `${(n % 4) * 80}ms`;
    io.observe(t);
  });
})();

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
