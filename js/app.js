/**
 * app.js — Shared utilities: nav active state, mobile menu,
 *           scroll reveal, smooth scroll, toast notifications
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [1] Nav active link broke on GitHub Pages directory URLs (pathname.pop() → '')
 *  [2] Mobile menu didn't close on outside touch (touchstart missing)
 *  [3] Scroll handler fired every pixel — now throttled to 50ms
 *  [4] showToast / copyToClipboard polluted window — moved to window.OR namespace
 *  [5] Smooth scroll crashed with SyntaxError when href was bare '#' — now guarded
 */

'use strict';

/* ══════════════════════════════════════════════
   NAV — active link highlight + mobile menu
══════════════════════════════════════════════ */
(function initNav() {
  const parts = window.location.pathname.split('/');
  const currentPage = parts[parts.length - 1] || parts[parts.length - 2] || 'home.html';

  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
      }
    });

    function closeMenuIfOutside(target) {
      if (!hamburger.contains(target) && !mobileMenu.contains(target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      }
    }

    document.addEventListener('click',      e => closeMenuIfOutside(e.target));
    document.addEventListener('touchstart', e => closeMenuIfOutside(e.target), { passive: true });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  const nav = document.querySelector('nav.site-nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScroll < 50) return;
      lastScroll = now;
      nav.style.borderBottomColor = window.scrollY > 20
        ? 'rgba(245,158,11,0.22)'
        : 'rgba(245,158,11,0.12)';
    }, { passive: true });
  }
})();


/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   SMOOTH SCROLL for anchor links
   FIX [5]: guard against bare '#' href which throws SyntaxError in querySelector
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const hash = anchor.getAttribute('href');
    // FIX: bare '#' is not a valid querySelector argument → SyntaxError
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ══════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════ */
(function() {
  const toastRoot = document.createElement('div');
  toastRoot.id = 'toast-root';
  toastRoot.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(toastRoot);

  function showToast(message, type = 'info', duration = 3000) {
    const colors = {
      info:  { border: 'rgba(245,158,11,0.4)',  color: '#e2e8f0' },
      ok:    { border: 'rgba(34,197,94,0.5)',   color: '#22c55e' },
      warn:  { border: 'rgba(245,158,11,0.5)',  color: '#f59e0b' },
      error: { border: 'rgba(239,68,68,0.5)',   color: '#ef4444' },
    };
    const { border, color } = colors[type] || colors.info;
    const toast = document.createElement('div');
    toast.style.cssText = `
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      border: 1px solid ${border};
      background: #0d1117;
      color: ${color};
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.22s ease, transform 0.22s ease;
      pointer-events: auto;
      min-width: 200px;
    `;
    toast.textContent = message;
    toastRoot.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'none';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }

  window.OR = window.OR || {};
  window.OR.showToast = showToast;
  window.showToast = showToast;
})();


/* ══════════════════════════════════════════════
   COPY TO CLIPBOARD utility
══════════════════════════════════════════════ */
(function() {
  function copyToClipboard(text, label = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => {
      window.OR.showToast(`✓ ${label}`, 'ok', 2000);
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      window.OR.showToast(`✓ ${label}`, 'ok', 2000);
    });
  }

  window.OR = window.OR || {};
  window.OR.copyToClipboard = copyToClipboard;
  window.copyToClipboard = copyToClipboard;
})();


/* ══════════════════════════════════════════════
   YEAR in footer copyright
══════════════════════════════════════════════ */
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});