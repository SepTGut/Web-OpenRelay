/**
 * home.js — Hero relay dot animator, hero entrance animations
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [5] Dangling RAF handle: cancelAnimationFrame left a stale ID; restarted
 *      animate() directly instead of via requestAnimationFrame
 *  [6] animateCount captured start time synchronously before first RAF frame —
 *      now deferred to first callback (no jump on frame 1)
 *  [+] Relay dot className now cached — only written when state changes
 *      (avoids 64 style recalcs per frame when dots haven't changed)
 */

'use strict';

/* ══════════════════════════════════════════════
   RELAY DOT VISUALIZER
   Simulates 64 relay channels with wave animation
══════════════════════════════════════════════ */
(function initRelayVis() {
  const container = document.getElementById('relay-vis');
  if (!container) return;

  const TOTAL = 64;
  const dots  = [];

  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'relay-dot';
    d._state = '';          // cache: track last applied state
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

      // Determine new state
      const next = combined > 0.55 ? 'alt' : combined > 0.1 ? 'on' : '';

      // FIX [+]: only write className when state actually changes
      if (dot._state !== next) {
        dot._state = next;
        dot.className = 'relay-dot' + (next ? ' ' + next : '');
      }
    });

    frame = requestAnimationFrame(animate);
  }

  // FIX [5]: on hide — cancel and null the ID.
  //          on show — only restart if not already running.
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
   Counts up numbers when stats scroll into view
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

    // FIX [6]: start is null — set on first RAF frame, not synchronously.
    // This prevents the small timing jump caused by the gap between
    // performance.now() capture and the actual first callback.
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
   Simulates a "connected" pulse in the hero badge
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
   SPEC CARD HOVER — highlight row on hover
══════════════════════════════════════════════ */
(function initSpecHover() {
  document.querySelectorAll('.spec-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.querySelector('.spec-val')?.style.setProperty('color', 'var(--amber2)');
    });
    row.addEventListener('mouseleave', () => {
      row.querySelector('.spec-val')?.style.setProperty('color', 'var(--amber)');
    });
  });
})();