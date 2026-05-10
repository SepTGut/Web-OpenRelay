/**
 * home.js — Hero relay dot animator, hero entrance animations
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [5] Dangling RAF handle: cancelAnimationFrame left a stale ID
 *  [6] animateCount captured start time before first RAF frame — deferred
 *  [+] Relay dot className cached — only written when state changes
 *  [12] initSpecHover set inline style on mouseleave instead of removing the
 *       override — a stale inline color blocks future CSS cascade changes.
 *       Fixed: use style.removeProperty('color') on mouseleave so CSS wins.
 */

'use strict';

/* ══════════════════════════════════════════════
   RELAY DOT VISUALIZER
══════════════════════════════════════════════ */
(function initRelayVis() {
  const container = document.getElementById('relay-vis');
  if (!container) return;

  const TOTAL = 64;
  const dots  = [];

  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'relay-dot';
    d._state = '';
    container.appendChild(d);
    dots.push(d);
  }

  let frame = null;

  function animate() {
    const t = Date.now() * 0.001;

    dots.forEach((dot, i) => {
      const wave1 = Math.sin(t * 1.1 + i * 0.38);
      const wave2 = Math.sin(t * 0.7 + i * 0.22 + 1.5);
      const combined = (wave1 + wave2) / 2;
      const next = combined > 0.55 ? 'alt' : combined > 0.1 ? 'on' : '';

      if (dot._state !== next) {
        dot._state = next;
        dot.className = 'relay-dot' + (next ? ' ' + next : '');
      }
    });

    frame = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = null;
    } else if (!frame) {
      frame = requestAnimationFrame(animate);
    }
  });

  frame = requestAnimationFrame(animate);
})();


/* ══════════════════════════════════════════════
   STAT COUNTER ANIMATION
══════════════════════════════════════════════ */
(function initStatCounters() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    let start = null;

    function step(now) {
      if (!start) start = now;
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   LIVE STATUS INDICATOR
══════════════════════════════════════════════ */
(function initStatusPulse() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const dot = badge.querySelector('.dot-live');
  if (!dot) return;

  setInterval(() => {
    const flicker = Math.random() > 0.85;
    dot.style.opacity = flicker ? '0.2' : '1';
    setTimeout(() => { dot.style.opacity = '1'; }, 120);
  }, 2200);
})();


/* ══════════════════════════════════════════════
   SPEC CARD HOVER
   FIX [12]: use removeProperty('color') on mouseleave instead of setting
   style.color = 'var(--amber)' inline. Setting an inline style defeats the CSS
   cascade — future CSS changes to .spec-val color are silently overridden.
   Removing the property lets the stylesheet rule take over cleanly.
══════════════════════════════════════════════ */
(function initSpecHover() {
  document.querySelectorAll('.spec-row').forEach(row => {
    const val = row.querySelector('.spec-val');
    if (!val) return;
    row.addEventListener('mouseenter', () => {
      val.style.setProperty('color', 'var(--amber2)');
    });
    row.addEventListener('mouseleave', () => {
      // FIX: remove inline override so CSS cascade takes over
      val.style.removeProperty('color');
    });
  });
})();