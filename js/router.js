const pages = [
  'features.html',
  'docs.html',
  'team.html'
];

let pageIndex = 0;
let loading = false;
let observer = null;

async function fetchSection(page) {
  const res = await fetch(page);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const content = doc.querySelector('.page-main');

  return content ? content.innerHTML : '';
}

function initDynamicContent(scope = document) {
  if (typeof window.initReveal === 'function') {
    window.initReveal(scope);
  }

  if (typeof window.initRelayVisualizer === 'function') {
    window.initRelayVisualizer(scope);
  }
}

async function streamNextSection() {
  if (loading) return;
  if (pageIndex >= pages.length) return;

  loading = true;

  try {
    const app = document.getElementById('app-content');

    if (!app) {
      loading = false;
      return;
    }

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

    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(40px)';
    wrapper.style.transition = 'opacity .6s ease, transform .6s ease';

    wrapper.innerHTML = html;

    const trigger = document.getElementById('scroll-trigger');

    app.insertBefore(wrapper, trigger);

    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });

    initDynamicContent(wrapper);

    pageIndex++;

  } catch (err) {
    console.error('Stream error:', err);
  }

  loading = false;
}

function setupInfiniteScroll() {
  const trigger = document.getElementById('scroll-trigger');

  if (!trigger) return;

  observer = new IntersectionObserver(async entries => {
    const entry = entries[0];

    if (!entry.isIntersecting || loading) return;

    observer.unobserve(trigger);

    await streamNextSection();

    observer.observe(trigger);

  }, {
    rootMargin: '0px 0px 70% 0px',
    threshold: 0.01
  });

  observer.observe(trigger);
}

function setupNavigation() {
  document.body.addEventListener('click', async e => {
    const link = e.target.closest('[data-spa]');

    if (!link) return;

    const href = link.getAttribute('href');

    if (!href || href.startsWith('http') || href.includes('NewStyle')) {
      return;
    }

    e.preventDefault();

    let targetEl = document.querySelector(`[data-page="${href}"]`);

    while (!targetEl && pageIndex < pages.length) {
      await streamNextSection();
      targetEl = document.querySelector(`[data-page="${href}"]`);
    }

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app-content');

  if (!app) return;

  if (!document.getElementById('scroll-trigger')) {
    const trigger = document.createElement('div');
    trigger.id = 'scroll-trigger';
    trigger.style.height = '2px';

    app.appendChild(trigger);
  }

  initDynamicContent(document);

  setupInfiniteScroll();
  setupNavigation();
});