/**
 * router.js — SPA-style streaming page loader
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [+] Dead code — checked for #app-content that didn't exist (now warns clearly)
 *  [13] Redundant `const app` inside catch block shadowed the outer variable and
 *       made an unnecessary DOM query. The outer `app` is already in scope.
 */

'use strict';

const pages = [
  'features.html',
  'docs.html',
  'team.html'
];

let pageIndex = 0;
let loading = false;

async function fetchSection(page) {
  const res = await fetch(page);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${page}`);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const content = doc.querySelector('.page-main');
  return content ? content.innerHTML : '';
}

function initDynamicContent(scope = document) {
  if (typeof window.initReveal === 'function')           window.initReveal(scope);
  if (typeof window.initRelayVisualizer === 'function')  window.initRelayVisualizer(scope);
}

async function streamNextSection() {
  if (loading) return;
  if (pageIndex >= pages.length) return;

  loading = true;

  const app = document.getElementById('app-content');
  if (!app) { loading = false; return; }

  try {
    const page = pages[pageIndex];

    if (document.querySelector(`[data-page="${page}"]`)) {
      pageIndex++;
      loading = false;
      return;
    }

    const html = await fetchSection(page);

    const wrapper = document.createElement('section');
    wrapper.className = 'stream-section';
    wrapper.dataset.page = page;
    wrapper.style.cssText = 'opacity:0;transform:translateY(40px);transition:opacity .6s ease,transform .6s ease;';
    wrapper.innerHTML = html;

    app.appendChild(wrapper);

    requestAnimationFrame(() => {
      wrapper.style.opacity   = '1';
      wrapper.style.transform = 'translateY(0)';
    });

    initDynamicContent(wrapper);
    pageIndex++;

  } catch (err) {
    console.error('Stream error:', err);

    // FIX [13]: `app` is already in scope from the outer const — no need to
    // re-query the DOM. The previous `const app` inside catch shadowed the outer
    // variable unnecessarily and made an extra getElementById call.
    if (app) {
      const errEl = document.createElement('p');
      errEl.style.cssText = 'text-align:center;color:var(--text-dim);padding:24px;font-size:13px;';
      errEl.textContent = 'Could not load section — check your connection.';
      app.appendChild(errEl);
    }
    pageIndex++;
  }

  loading = false;
}

function setupInfiniteScroll() {
  let ticking = false;

  async function checkScroll() {
    if (loading) { ticking = false; return; }

    const scrollBottom = window.innerHeight + window.scrollY;
    const preloadPoint = document.body.offsetHeight - 1400;

    if (scrollBottom >= preloadPoint) await streamNextSection();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(checkScroll);
      ticking = true;
    }
  }, { passive: true });

  checkScroll();
}

function setupNavigation() {
  document.body.addEventListener('click', async e => {
    const link = e.target.closest('[data-spa]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.includes('NewStyle')) return;

    e.preventDefault();

    let targetEl = document.querySelector(`[data-page="${href}"]`);

    while (!targetEl && pageIndex < pages.length) {
      await streamNextSection();
      targetEl = document.querySelector(`[data-page="${href}"]`);
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-content');

  if (!app) {
    console.warn(
      '[router.js] #app-content not found. ' +
      'Add <div id="app-content"></div> to your page to enable streaming.'
    );
    return;
  }

  initDynamicContent(document);
  setupInfiniteScroll();
  setupNavigation();
});