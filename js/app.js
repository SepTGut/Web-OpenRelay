/**
 * app.js — Shared utilities: nav active state, mobile menu,
 *           scroll reveal, smooth scroll, toast notifications
 * OpenRelay · FIKSI 2026
 */

'use strict';

/* ══════════════════════════════════════════════
   NAV — active link highlight + mobile menu
══════════════════════════════════════════════ */
(function initNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active nav link
  document.querySelectorAll('.nav-links a, .nav-mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile hamburger toggle
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate hamburger to X
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

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Nav background solidifies on scroll
  const nav = document.querySelector('nav.site-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
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
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ══════════════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════════════ */
(function() {
  // Create toast container
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

  /**
   * Show a toast notification
   * @param {string} message
   * @param {'info'|'ok'|'warn'|'error'} type
   * @param {number} duration ms
   */
  window.showToast = function(message, type = 'info', duration = 3000) {
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
  };
})();


/* ══════════════════════════════════════════════
   COPY TO CLIPBOARD utility
══════════════════════════════════════════════ */
window.copyToClipboard = function(text, label = 'Copied!') {
  navigator.clipboard.writeText(text).then(() => {
    window.showToast(`✓ ${label}`, 'ok', 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    window.showToast(`✓ ${label}`, 'ok', 2000);
  });
};


/* ══════════════════════════════════════════════
   YEAR in footer copyright
══════════════════════════════════════════════ */
document.querySelectorAll('.footer-year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
