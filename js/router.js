/**
 * router.js — Infinite-scroll single-page experience
 * OpenRelay · FIKSI 2026
 *
 * How it works:
 *  - home.html includes <div id="app-content"></div> after its main content.
 *  - As the user scrolls near the bottom, the next page's .page-main sections
 *    are fetched and appended one at a time: features → docs → team.
 *  - Each streamed section gets its page-specific JS initialised via
 *    initSectionScripts() so animations, copy buttons, etc. all work.
 *  - Nav links with href matching a page trigger an instant stream-then-scroll
 *    so clicking "Fitur" from home feels instant.
 *  - The URL hash updates as sections scroll into view (shallow history).
 *
 * REQUIRES: <div id="app-content"></div> at the bottom of home.html's <main>.
 */

'use strict';

/* ── Pages to stream in order ── */
const PAGES = [
  { file: 'features.html', id: 'stream-features', label: 'Fitur' },
  { file: 'docs.html', id: 'stream-docs', label: 'Dokumentasi' },
  { file: 'team.html', id: 'stream-team', label: 'Tim' },
];

let pageIndex = 0;
let loading = false;

/* ════════════════════════════════════════════════
   FETCH — pull .page-main inner sections from a page
   Strips the page's own nav/footer/hero so only the
   content sections land in the stream.
════════════════════════════════════════════════ */
async function fetchSections(file) {
  const res = await fetch(file);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${file}`);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const main = doc.querySelector('.page-main');
  if (!main) return '';

  // Remove page-level hero / header divs that duplicate the home hero
  main.querySelectorAll('.features-hero, .docs-hero, .team-hero').forEach(el => el.remove());

  return main.innerHTML;
}

/* ════════════════════════════════════════════════
   INIT SCRIPTS — re-run page-specific initialisers
   for a newly injected DOM subtree.
════════════════════════════════════════════════ */
function initSectionScripts(wrapper, file) {
  // Global animations from animations.js
  if (window.OR) {
    if (window.OR.initMagnetic) window.OR.initMagnetic(wrapper);
    if (window.OR.initTilt) window.OR.initTilt(wrapper);
    if (window.OR.initStagger) window.OR.initStagger(wrapper);
  }

  // Scroll-reveal: pick up any .reveal elements in the new section
  if (typeof IntersectionObserver !== 'undefined') {
    const reveals = wrapper.querySelectorAll('.reveal');
    if (reveals.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(el => obs.observe(el));
    }
  }

  // features.html scripts
  if (file === 'features.html') {
    initArchFlow(wrapper);
    initFeatureCards(wrapper);
    initCodeCopy(wrapper);
    initArchTable(wrapper);
    initLayerReveal(wrapper);
  }

  // docs.html scripts
  if (file === 'docs.html') {
    initTopicCopy(wrapper);
    initCredsCopy(wrapper);
    initPayloadHighlight();
    initBrokerStatus(); // idempotent — checks for element first
  }

  // team.html scripts
  if (file === 'team.html') {
    initTeamCards(wrapper);
    initTimeline(wrapper);
    initFiksiBadges(wrapper);
    initSchoolTypewriter(wrapper);
    initSkillTags(wrapper);
    injectTimelineCSS();
  }

  // Smooth scroll for any new anchor links
  wrapper.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.dataset.bound) return;
    anchor.dataset.bound = '1';
    anchor.addEventListener('click', e => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ════════════════════════════════════════════════
   STREAM — fetch next page and append it
════════════════════════════════════════════════ */
async function streamNext() {
  if (loading || pageIndex >= PAGES.length) return;
  loading = true;

  const app = document.getElementById('app-content');
  if (!app) { loading = false; return; }

  const { file, id, label } = PAGES[pageIndex];

  // Already streamed?
  if (document.getElementById(id)) {
    pageIndex++;
    loading = false;
    return;
  }

  try {
    const html = await fetchSections(file);

    // Section label divider
    const divider = document.createElement('div');
    divider.className = 'stream-divider';
    divider.innerHTML = `
      <div class="divider" aria-hidden="true"></div>
      <div class="stream-section-label" aria-hidden="true">${label}</div>
    `;
    app.appendChild(divider);

    // Content wrapper
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.dataset.page = file;
    wrapper.className = 'stream-section';
    wrapper.style.cssText = 'opacity:0;transform:translateY(32px);transition:opacity .55s ease,transform .55s ease;';
    wrapper.innerHTML = html;
    app.appendChild(wrapper);

    // Animate in next frame
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });

    initSectionScripts(wrapper, file);
    pageIndex++;

  } catch (err) {
    console.error('[router] Stream error:', err);
    const errEl = document.createElement('p');
    errEl.className = 'stream-error';
    errEl.textContent = `Could not load ${label} — check your connection.`;
    app.appendChild(errEl);
    pageIndex++; // advance so we don't retry forever
  }

  loading = false;
}

/* ════════════════════════════════════════════════
   INFINITE SCROLL — trigger streamNext near bottom
════════════════════════════════════════════════ */
function setupInfiniteScroll() {
  let ticking = false;

  function check() {
    if (!loading && pageIndex < PAGES.length) {
      const threshold = window.innerHeight * 0.8;
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
      if (nearBottom) streamNext();
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(check); ticking = true; }
  }, { passive: true });

  // Run once on load in case page is short
  check();
}

/* ════════════════════════════════════════════════
   NAV CLICK — stream-then-scroll for nav links
   Add data-spa to nav <a> tags to opt in.
   Also intercepts plain href nav links on home.html.
════════════════════════════════════════════════ */
function setupNavigation() {
  // Map page filenames to streamed section IDs
  const pageToId = {};
  PAGES.forEach(p => { pageToId[p.file] = p.id; });

  document.body.addEventListener('click', async e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Only intercept links to pages we stream
    const match = PAGES.find(p => p.file === href);
    if (!match) return;

    e.preventDefault();

    // Stream until this section exists
    while (!document.getElementById(match.id) && pageIndex <= PAGES.indexOf(match)) {
      await streamNext();
    }

    const target = document.getElementById(match.id);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
}

/* ════════════════════════════════════════════════
   HASH TRACKING — update URL as sections scroll by
════════════════════════════════════════════════ */
function setupHashTracking() {
  const map = [
    { id: 'beranda', hash: '#beranda' },
    { id: 'stream-features', hash: '#fitur' },
    { id: 'stream-docs', hash: '#dokumentasi' },
    { id: 'stream-team', hash: '#tim' },
  ];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const found = map.find(m => m.id === entry.target.id);
        if (found) history.replaceState(null, '', found.hash);
      }
    });
  }, { threshold: 0.25 });

  const missing = map.filter(m => !document.getElementById(m.id));
  map.filter(m => document.getElementById(m.id)).forEach(m => obs.observe(document.getElementById(m.id)));

  if (missing.length) {
    const container = document.getElementById('app-content') || document.body;
    const mo = new MutationObserver(() => {
      for (let i = missing.length - 1; i >= 0; i--) {
        const item = missing[i];
        const el = document.getElementById(item.id);
        if (el) {
          obs.observe(el);
          missing.splice(i, 1);
        }
      }
      if (!missing.length) mo.disconnect();
    });
    mo.observe(container, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 60000); // Extended safety
  }
}

/* ════════════════════════════════════════════════
   STUB INITS — called for streamed sections.
   These mirror the IIFEs in each page's JS file.
   They're defined here so router.js is self-contained
   and doesn't need the page JS files to be loaded.
════════════════════════════════════════════════ */

function injectTimelineCSS() {
  if (document.getElementById('timeline-fix-style')) return;
  const s = document.createElement('style');
  s.id = 'timeline-fix-style';
  s.textContent = `
    .timeline-item { opacity:0; transform:translateX(-12px); transition:opacity .5s ease,transform .5s ease; }
    .timeline-item.revealed { opacity:1; transform:none; }
    .stream-divider { position:relative; }
    .stream-section-label {
      text-align:center;
      font-family:'Chakra Petch',monospace;
      font-size:10px;
      letter-spacing:3px;
      text-transform:uppercase;
      color:var(--text-muted);
      padding:8px 0 0;
    }
    .stream-error {
      text-align:center;
      color:var(--text-dim);
      padding:24px;
      font-size:13px;
    }
  `;
  document.head.appendChild(s);
}

/* features.js stubs */
function initArchFlow(scope) {
  const nodes = scope.querySelectorAll('.arch-node');
  const arrows = scope.querySelectorAll('.arch-arrow');
  if (!nodes.length) return;
  function resetAll() {
    nodes.forEach(n => { n.style.opacity = ''; n.style.borderColor = ''; n.style.boxShadow = ''; });
    arrows.forEach(a => { a.style.color = ''; });
  }
  nodes.forEach((node, i) => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach((n, j) => {
        n.style.opacity = j === i ? '1' : '0.4';
        n.style.borderColor = j === i ? 'var(--border2)' : 'var(--border)';
        n.style.boxShadow = j === i ? 'var(--shadow-amber)' : 'none';
      });
      if (arrows[i - 1]) arrows[i - 1].style.color = 'var(--amber2)';
      if (arrows[i]) arrows[i].style.color = 'var(--amber2)';
    });
  });
  const flow = scope.querySelector('.arch-flow');
  if (flow) flow.addEventListener('mouseleave', resetAll);
}

function initFeatureCards(scope) {
  scope.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
    card.addEventListener('mouseenter', () => { card.style.boxShadow = '0 8px 32px rgba(245,158,11,0.10)'; });
    card.addEventListener('mouseleave', () => { card.style.boxShadow = ''; });
  });
}

function initCodeCopy(scope) {
  scope.querySelectorAll('.code-card').forEach(card => {
    if (card.dataset.copyInit) return;
    card.dataset.copyInit = '1';
    const header = card.querySelector('.code-header');
    const body = card.querySelector('.code-body');
    if (!header || !body) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost btn-sm';
    btn.textContent = 'Copy';
    btn.style.cssText = 'margin-left:auto;font-size:11px;padding:3px 10px;border-radius:4px;';
    btn.addEventListener('click', () => {
      const plain = (body.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
      window.OR.copyToClipboard(plain, 'Code copied!');
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
    header.appendChild(btn);
  });
}

function initArchTable(scope) {
  scope.querySelectorAll('.relay-arch-table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', () => { row.style.background = 'rgba(245,158,11,0.04)'; });
    row.addEventListener('mouseleave', () => { row.style.background = ''; });
  });
}

function initLayerReveal(scope) {
  const layers = scope.querySelectorAll('.arch-layer');
  if (!layers.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.borderColor = 'var(--border2)';
          entry.target.style.transition = 'border-color 0.4s ease';
        }, i * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  layers.forEach(l => obs.observe(l));
}

/* docs.js stubs */
function initTopicCopy(scope) {
  scope.querySelectorAll('.topic-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.closest('.topic-row')?.querySelector('.topic-name')?.textContent?.trim();
      if (!topic) return;
      window.copyToClipboard(topic, `Topic copied: ${topic}`);
      const svg = btn.querySelector('svg');
      if (svg) { svg.style.color = 'var(--green)'; setTimeout(() => { svg.style.color = ''; }, 1800); }
    });
  });
}

function initCredsCopy(scope) {
  scope.querySelectorAll('.cred-item').forEach(item => {
    const val = item.querySelector('.cred-val');
    if (!val) return;
    item.style.cursor = 'pointer';
    item.title = 'Click to copy';
    let resetTimer = null;
    item.addEventListener('click', () => {
      window.copyToClipboard(val.textContent.trim(), `"${val.textContent.trim()}" copied!`);
      val.style.color = 'var(--green)';
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { val.style.color = ''; resetTimer = null; }, 1500);
    });
    item.addEventListener('mouseenter', () => { if (!resetTimer) val.style.color = 'var(--amber2)'; });
    item.addEventListener('mouseleave', () => { if (!resetTimer) val.style.color = ''; });
  });
}

function initPayloadHighlight() {
  if (document.getElementById('payload-hover-style')) return;
  const s = document.createElement('style');
  s.id = 'payload-hover-style';
  s.textContent = '.payload-body:hover{background:rgba(245,158,11,0.05);border-radius:4px;transition:background .15s;}';
  document.head.appendChild(s);
}

function initBrokerStatus() {
  const badge = document.getElementById('broker-status-badge');
  if (!badge || badge.dataset.probed) return;
  badge.dataset.probed = '1';
  try {
    const ws = new WebSocket('wss://broker.hivemq.com:8884/mqtt');
    const t = setTimeout(() => { ws.close(); badge.textContent = 'Unreachable'; badge.style.color = 'var(--red)'; }, 4000);
    ws.addEventListener('open', () => { clearTimeout(t); ws.close(); badge.innerHTML = '<span class="dot-live" style="margin-right:6px;"></span>broker.hivemq.com reachable'; badge.style.color = 'var(--green)'; });
    ws.addEventListener('error', () => { clearTimeout(t); badge.textContent = 'Unreachable'; badge.style.color = 'var(--red)'; });
  } catch (_) { badge.textContent = 'Unreachable'; badge.style.color = 'var(--red)'; }
}

/* team.js stubs */
function initTeamCards(scope) {
  scope.querySelectorAll('.team-card').forEach(card => {
    const ring = card.querySelector('.team-avatar-ring');
    const skills = card.querySelectorAll('.skill-tag');
    card.addEventListener('mouseenter', () => {
      if (ring) ring.style.animationDuration = '1s';
      skills.forEach((tag, i) => setTimeout(() => {
        tag.style.background = 'var(--amber-dim)'; tag.style.borderColor = 'var(--border2)'; tag.style.color = 'var(--amber)'; tag.style.transition = 'all 0.2s';
      }, i * 60));
    });
    card.addEventListener('mouseleave', () => {
      if (ring) ring.style.animationDuration = '';
      skills.forEach(tag => { tag.style.background = ''; tag.style.borderColor = ''; tag.style.color = ''; });
    });
  });
}

function initTimeline(scope) {
  const items = scope.querySelectorAll('.timeline-item');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const dot = item.querySelector('.timeline-dot');
      const idx = Array.from(items).indexOf(item);
      setTimeout(() => {
        item.classList.add('revealed');
        if (dot) { dot.style.transform = 'scale(1.4)'; dot.style.transition = 'transform .3s ease'; setTimeout(() => { dot.style.transform = ''; }, 300); }
      }, idx * 140);
      obs.unobserve(item);
    });
  }, { threshold: 0.2 });
  items.forEach(item => obs.observe(item));
}

function initFiksiBadges(scope) {
  scope.querySelectorAll('.fiksi-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => { badge.style.transform = 'translateY(-2px)'; badge.style.boxShadow = '0 6px 24px rgba(245,158,11,0.12)'; badge.style.borderColor = 'var(--border3)'; badge.style.transition = 'all .2s ease'; });
    badge.addEventListener('mouseleave', () => { badge.style.transform = ''; badge.style.boxShadow = ''; badge.style.borderColor = ''; });
  });
}

function initSchoolTypewriter(scope) {
  const nameEl = scope.querySelector('.school-name');
  if (!nameEl) return;
  const fullText = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.borderRight = '2px solid var(--amber)';
  let started = false;
  function start() {
    if (started) return;
    started = true;
    clearTimeout(fallback);
    let i = 0;
    const iv = setInterval(() => {
      nameEl.textContent = fullText.slice(0, ++i);
      if (i >= fullText.length) { clearInterval(iv); setTimeout(() => { nameEl.style.borderRight = 'none'; }, 800); }
    }, 48);
  }
  const fallback = setTimeout(() => { if (!started) { nameEl.textContent = fullText; nameEl.style.borderRight = 'none'; started = true; } }, 2000);
  const obs = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) return; obs.disconnect(); start(); }, { threshold: 0.5 });
  obs.observe(nameEl);
}

function initSkillTags(scope) {
  const palette = [
    { bg: 'var(--amber-dim)', border: 'var(--border2)', color: 'var(--amber)' },
    { bg: 'var(--green-dim)', border: 'rgba(34,197,94,0.25)', color: 'var(--green)' },
    { bg: 'var(--blue-dim)', border: 'rgba(56,189,248,0.25)', color: 'var(--blue)' },
  ];
  scope.querySelectorAll('.skill-tag').forEach((tag, i) => {
    const p = palette[i % palette.length];
    tag.addEventListener('mouseenter', () => { tag.style.background = p.bg; tag.style.borderColor = p.border; tag.style.color = p.color; tag.style.transition = 'all .18s'; });
    tag.addEventListener('mouseleave', () => { tag.style.background = ''; tag.style.borderColor = ''; tag.style.color = ''; });
  });
}

/* ════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-content');
  if (!app) {
    console.warn('[router.js] #app-content not found — add <div id="app-content"></div> to home.html');
    return;
  }

  window.OR = window.OR || {};
  window.OR.routerActive = true;

  injectTimelineCSS();
  setupInfiniteScroll();
  setupNavigation();
  setupHashTracking();
});