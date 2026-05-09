const pages = [
  'features.html',
  'docs.html',
  'team.html'
];

let pageIndex = 0;
let loading = false;

async function fetchSection(page) {
  const res = await fetch(page);
  const html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const content = doc.querySelector('.page-main');

  return content ? content.innerHTML : '';
}

async function streamNextSection() {
  if (loading) return;
  if (pageIndex >= pages.length) return;

  loading = true;

  try {
    const app = document.getElementById('app-content');

    if (!app) return;

    const page = pages[pageIndex];

    const html = await fetchSection(page);

    const wrapper = document.createElement('section');
    wrapper.className = 'stream-section';
    wrapper.dataset.page = page;

    wrapper.style.opacity = '0';
    wrapper.style.transform = 'translateY(40px)';
    wrapper.style.transition = 'all .6s ease';

    wrapper.innerHTML = html;

    const trigger = document.getElementById('scroll-trigger');

    app.insertBefore(wrapper, trigger);

    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      wrapper.style.transform = 'translateY(0)';
    });

    pageIndex++;

  } catch (err) {
    console.error(err);
  }

  loading = false;
}

function setupInfiniteScroll() {
  const trigger = document.getElementById('scroll-trigger');

  if (!trigger) return;

  const observer = new IntersectionObserver(async entries => {
    if (entries[0].isIntersecting) {
      await streamNextSection();
    }
  }, {
    rootMargin: '70%'
  });

  observer.observe(trigger);
}

function setupNavigation() {
  document.body.addEventListener('click', async e => {
    const link = e.target.closest('[data-spa]');

    if (!link) return;

    e.preventDefault();

    const target = link.getAttribute('href');

    let targetEl = document.querySelector(`[data-page="${target}"]`);

    while (!targetEl && pageIndex < pages.length) {
      await streamNextSection();
      targetEl = document.querySelector(`[data-page="${target}"]`);
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

  setupInfiniteScroll();
  setupNavigation();
});