const pages = [
  'home.html',
  'features.html',
  'docs.html',
  'team.html'
];

let loadedPages = new Set();
let loading = false;

async function fetchPageContent(page) {
  const res = await fetch(page);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  return doc.querySelector('.page-main')?.innerHTML || '';
}

async function appendNextPage() {
  if (loading) return;

  const app = document.getElementById('app-content');
  if (!app) return;

  loading = true;

  try {
    const nextPage = pages.find(p => !loadedPages.has(p));

    if (!nextPage) {
      loading = false;
      return;
    }

    loadedPages.add(nextPage);

    const html = await fetchPageContent(nextPage);

    const section = document.createElement('section');
    section.className = 'spa-page-block';
    section.setAttribute('data-page', nextPage);
    section.innerHTML = html;

    app.appendChild(section);

  } catch (err) {
    console.error(err);
  }

  loading = false;
}

async function initInfinitePages() {
  const app = document.getElementById('app-content');

  if (!app) return;

  app.innerHTML = '';

  await appendNextPage();

  const trigger = document.createElement('div');
  trigger.id = 'scroll-trigger';
  trigger.style.height = '1px';

  app.appendChild(trigger);

  const observer = new IntersectionObserver(async entries => {
    if (entries[0].isIntersecting) {
      await appendNextPage();
    }
  }, {
    rootMargin: '1200px'
  });

  observer.observe(trigger);
}

document.addEventListener('DOMContentLoaded', () => {
  initInfinitePages();

  document.body.addEventListener('click', e => {
    const link = e.target.closest('[data-spa]');

    if (!link) return;

    e.preventDefault();

    const target = link.getAttribute('href');

    const el = document.querySelector(`[data-page="${target}"]`);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});