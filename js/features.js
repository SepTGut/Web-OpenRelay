/**
 * features.js — Architecture diagram interactions,
 *               code block highlights, feature card effects
 * OpenRelay · FIKSI 2026
 */

'use strict';

/* ══════════════════════════════════════════════
   ARCH FLOW — highlight node on hover,
   animate the arrow between them
══════════════════════════════════════════════ */
(function initArchFlow() {
  const nodes  = document.querySelectorAll('.arch-node');
  const arrows = document.querySelectorAll('.arch-arrow');
  if (!nodes.length) return;

  nodes.forEach((node, i) => {
    node.addEventListener('mouseenter', () => {
      // Dim all others
      nodes.forEach((n, j) => {
        n.style.opacity       = j === i ? '1' : '0.4';
        n.style.borderColor   = j === i ? 'var(--border2)' : 'var(--border)';
        n.style.boxShadow     = j === i ? 'var(--shadow-amber)' : 'none';
      });
      // Highlight adjacent arrows
      if (arrows[i - 1]) arrows[i - 1].style.color = 'var(--amber2)';
      if (arrows[i])     arrows[i].style.color     = 'var(--amber2)';
    });

    node.addEventListener('mouseleave', () => {
      nodes.forEach(n => {
        n.style.opacity     = '';
        n.style.borderColor = '';
        n.style.boxShadow   = '';
      });
      arrows.forEach(a => { a.style.color = ''; });
    });
  });
})();


/* ══════════════════════════════════════════════
   FEATURE CARDS — staggered reveal + active glow
══════════════════════════════════════════════ */
(function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  // Stagger the reveal delays
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });

  // Subtle amber glow on hover via box-shadow
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 8px 32px rgba(245,158,11,0.10)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   CODE BLOCKS — copy button per block
══════════════════════════════════════════════ */
(function initCodeCopy() {
  document.querySelectorAll('.code-card').forEach(card => {
    const header   = card.querySelector('.code-header');
    const body     = card.querySelector('.code-body');
    if (!header || !body) return;

    const btn = document.createElement('button');
    btn.className   = 'btn btn-ghost btn-sm';
    btn.textContent = 'Copy';
    btn.style.cssText = `
      margin-left: auto;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 4px;
    `;

    btn.addEventListener('click', () => {
      // Strip HTML tags to get plain text
      const plain = body.innerText || body.textContent;
      window.copyToClipboard(plain, 'Code copied!');
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });

    header.appendChild(btn);
  });
})();


/* ══════════════════════════════════════════════
   RELAY ARCH TABLE — row highlight
══════════════════════════════════════════════ */
(function initArchTable() {
  document.querySelectorAll('.relay-arch-table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(245,158,11,0.04)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   LAYER CARDS — count-up on scroll into view
══════════════════════════════════════════════ */
(function initLayerReveal() {
  const layers = document.querySelectorAll('.arch-layer');
  if (!layers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.borderColor = 'var(--border2)';
          entry.target.style.transition  = 'border-color 0.4s ease';
        }, i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  layers.forEach(l => observer.observe(l));
})();
