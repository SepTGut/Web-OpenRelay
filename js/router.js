async function loadPage(page) {
  const app = document.getElementById('app-content');

  if (!app) return;

  try {
    app.style.opacity = '0.4';

    const res = await fetch(page);
    const text = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const newMain = doc.querySelector('.page-main') || doc.body;

    app.innerHTML = newMain.innerHTML;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    history.pushState({}, '', page);

    app.style.opacity = '1';
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    const link = e.target.closest('[data-spa]');

    if (!link) return;

    e.preventDefault();

    loadPage(link.getAttribute('href'));
  });
});

window.addEventListener('popstate', () => {
  loadPage(location.pathname.split('/').pop() || 'home.html');
});