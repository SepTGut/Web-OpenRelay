/**
 * docs.js — MQTT topic copy-to-clipboard, broker status,
 *            payload syntax highlight interactions
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [9]  Broker badge always showed "Online" via unconditional setTimeout —
 *       now does a real WebSocket probe to broker.hivemq.com:8884.
 *  [10] initPayloadHighlight split innerHTML by '\n', cutting across existing
 *       <span> tags and producing broken HTML. Replaced with a CSS hover rule
 *       approach — no DOM surgery needed.
 */

'use strict';

/* ══════════════════════════════════════════════
   TOPIC ROWS — copy button wiring
══════════════════════════════════════════════ */
(function initTopicCopy() {
  document.querySelectorAll('.topic-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const row   = btn.closest('.topic-row');
      const topic = row?.querySelector('.topic-name')?.textContent?.trim();
      if (!topic) return;

      window.copyToClipboard(topic, `Topic copied: ${topic}`);

      const svg = btn.querySelector('svg');
      if (svg) {
        svg.style.color = 'var(--green)';
        setTimeout(() => { svg.style.color = ''; }, 1800);
      }
    });
  });
})();


/* ══════════════════════════════════════════════
   BROKER STATUS BADGE
   FIX [9]: replaced fake setTimeout with a real WebSocket connectivity probe.
   Opens a connection to broker.hivemq.com:8884 (MQTT over WSS).
   4 second timeout — shows "Unreachable" if connection doesn't open in time.
══════════════════════════════════════════════ */
(function initBrokerStatus() {
  const badge = document.getElementById('broker-status-badge');
  if (!badge) return;

  function setOnline() {
    badge.innerHTML = `<span class="dot-live" style="margin-right:6px;"></span>broker.hivemq.com reachable`;
    badge.style.color       = 'var(--green)';
    badge.style.borderColor = 'rgba(34,197,94,0.35)';
    badge.style.background  = 'var(--green-dim)';
  }

  function setOffline() {
    badge.textContent       = 'Unreachable';
    badge.style.color       = 'var(--red)';
    badge.style.borderColor = 'rgba(239,68,68,0.35)';
    badge.style.background  = 'rgba(239,68,68,0.1)';
  }

  try {
    const ws = new WebSocket('wss://broker.hivemq.com:8884/mqtt');

    // 4 second timeout — if no open event, mark offline
    const timeout = setTimeout(() => {
      ws.close();
      setOffline();
    }, 4000);

    ws.addEventListener('open', () => {
      clearTimeout(timeout);
      ws.close();
      setOnline();
    });

    ws.addEventListener('error', () => {
      clearTimeout(timeout);
      setOffline();
    });
  } catch (_) {
    // WebSocket constructor can throw in very restricted environments
    setOffline();
  }
})();


/* ══════════════════════════════════════════════
   CREDS BOX — click any cred value to copy
══════════════════════════════════════════════ */
(function initCredsCopy() {
  document.querySelectorAll('.cred-item').forEach(item => {
    const val = item.querySelector('.cred-val');
    if (!val) return;

    item.style.cursor = 'pointer';
    item.title        = 'Click to copy';

    item.addEventListener('click', () => {
      window.copyToClipboard(val.textContent.trim(), `"${val.textContent.trim()}" copied!`);
      val.style.color      = 'var(--green)';
      val.style.transition = 'color 0.2s';
      setTimeout(() => { val.style.color = ''; }, 1500);
    });

    item.addEventListener('mouseenter', () => { val.style.color = 'var(--amber2)'; });
    item.addEventListener('mouseleave', () => { val.style.color = ''; });
  });
})();


/* ══════════════════════════════════════════════
   PAYLOAD ROWS — hover highlight
   FIX [10]: the original code split innerHTML by '\n', which sliced across
   existing <span class="key"> / <span class="str"> etc. tags and produced
   broken HTML fragments.
   
   Replaced with a pure CSS hover on the container — same visual effect
   (subtle amber tint on hover), zero DOM surgery, zero risk of breaking
   the existing syntax-highlight spans.
   
   The CSS rule is injected once here to keep it co-located with this feature.
══════════════════════════════════════════════ */
(function initPayloadHighlight() {
  // Inject the hover style once — no DOM restructuring needed
  if (!document.getElementById('payload-hover-style')) {
    const style = document.createElement('style');
    style.id = 'payload-hover-style';
    style.textContent = `.payload-body:hover { background: rgba(245,158,11,0.05); border-radius: 4px; transition: background 0.15s; }`;
    document.head.appendChild(style);
  }
})();