/**
 * features.js — Architecture diagram interactions,
 *               code block highlights, feature card effects
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [+] Arch nodes stayed at opacity 0.4 permanently after the cursor left
 *      the .arch-flow container without hovering another node.
 *      Fixed by adding a mouseleave handler on the parent container that
 *      resets all nodes and arrows to their default state.
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

  function resetAll() {
    nodes.forEach(n => {
      n.style.opacity     = '';
      n.style.borderColor = '';
      n.style.boxShadow   = '';
    });
    arrows.forEach(a => { a.style.color = ''; });
  }

  nodes.forEach((node, i) => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach((n, j) => {
        n.style.opacity       = j === i ? '1' : '0.4';
        n.style.borderColor   = j === i ? 'var(--border2)' : 'var(--border)';
        n.style.boxShadow     = j === i ? 'var(--shadow-amber)' : 'none';
      });
      if (arrows[i - 1]) arrows[i - 1].style.color = 'var(--amber2)';
      if (arrows[i])     arrows[i].style.color     = 'var(--amber2)';
    });

    node.addEventListener('mouseleave', () => {
      // Individual node mouseleave — don't reset here.
      // The container mouseleave (below) handles full reset.
      // This prevents a flicker when moving between adjacent nodes.
    });
  });

  // FIX: when the cursor exits the entire flow container,
  // reset all nodes and arrows — previously they stayed dimmed forever.
  const flow = document.querySelector('.arch-flow');
  if (flow) {
    flow.addEventListener('mouseleave', resetAll);
  }
})();


/* ══════════════════════════════════════════════
   FEATURE CARDS — staggered reveal + active glow
══════════════════════════════════════════════ */
(function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });

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
    const header = card.querySelector('.code-header');
    const body   = card.querySelector('.code-body');
    if (!header || !body) return;

    const btn = document.createElement('button');
    btn.className   = 'btn btn-ghost btn-sm';
    btn.textContent = 'Copy';
    btn.style.cssText = 'margin-left:auto;font-size:11px;padding:3px 10px;border-radius:4px;';

    btn.addEventListener('click', () => {
      // Normalize extra blank lines that innerText produces from display:block spans
      const plain = (body.innerText || body.textContent)
        .replace(/\n{3,}/g, '\n\n')
        .trim();
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
   LAYER CARDS — reveal on scroll
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