'use strict';

console.log('OpenRelay NewStyle loaded');

/**
 * NewStyle/app.js
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [10] mousemove was reassigning card.style.background on every pixel —
 *       hundreds of full repaints per second during mouse drag.
 *       Fix: use CSS custom properties (--mx, --my) instead.
 *       The browser batches CSS var updates and only triggers one composite
 *       pass, not a full repaint. The visual result is identical.
 *
 *       Update .glass-card in NewStyle/style.css to use:
 *         background: radial-gradient(
 *           circle at var(--mx, 50%) var(--my, 50%),
 *           rgba(245,158,11,0.14),
 *           rgba(255,255,255,0.04)
 *         );
 */

const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });

  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});