/**
 * features.js — Architecture diagram interactions,
 *               code block highlights, feature card effects
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [+] Arch nodes stayed at opacity 0.4 permanently after cursor left .arch-flow
 *  [14] initCodeCopy used body.innerText which triggers layout reflow and includes
 *       pseudo-element content in some browsers. Switched to textContent for
 *       consistent, reflow-free text extraction.
 */

'use strict';

/* ══════════════════════════════════════════════
   ARCH FLOW — highlight node on hover
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
      // Container mouseleave handles the full reset — no flicker between nodes.
    });
  });

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
   FIX [14]: replaced innerText with textContent.
   innerText: triggers layout reflow, includes visible text only,
              normalizes whitespace per CSS (unreliable for code),
              may include ::before/::after pseudo-element text in some engines.
   textContent: no reflow, returns raw text of all child nodes,
                preserves whitespace as-is — correct for code copying.
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
      // FIX: textContent instead of innerText — no reflow, no pseudo-element leakage
      const plain = (body.textContent || '')
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