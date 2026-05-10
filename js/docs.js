/**
 * docs.js — MQTT topic copy-to-clipboard, broker status,
 *            payload syntax highlight interactions
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [9]  Broker badge always showed "Online" via unconditional setTimeout —
 *       now does a real WebSocket probe to broker.hivemq.com:8884.
 *  [10] initPayloadHighlight split innerHTML by '\n', cutting across existing
 *       <span> tags and producing broken HTML. Replaced with a CSS hover rule.
 *  [11] initCredsCopy race condition — mouseleave cleared inline color before
 *       the click's 1500ms timeout fired, permanently stranding the green flash.
 *       Fixed by tracking and clearing the active timeout on mouseleave.
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
   Real WebSocket probe with 4s timeout.
══════════════════════════════════════════════ */
(function initBrokerStatus() {
  const badge = document.getElementById('broker-status-badge');
  if (!badge) return;

  function setOnline() {
    badge.innerHTML = `<span class="dot-live" style="margin-right:6px;"></span>broker.hivemq.com reachable`;
    badge.style.color = 'var(--green)';
  }

  function setOffline() {
    badge.textContent = 'Unreachable';
    badge.style.color = 'var(--red)';
  }

  try {
    const ws = new WebSocket('wss://broker.hivemq.com:8884/mqtt');
    const timeout = setTimeout(() => { ws.close(); setOffline(); }, 4000);
    ws.addEventListener('open', () => { clearTimeout(timeout); ws.close(); setOnline(); });
    ws.addEventListener('error', () => { clearTimeout(timeout); setOffline(); });
  } catch (_) {
    setOffline();
  }
})();


/* ══════════════════════════════════════════════
   CREDS BOX — click any cred value to copy
   FIX [11]: track the active reset timer per item and cancel it on mouseleave
   so the green flash always completes its full 1500ms, not cut short by hover-out.
══════════════════════════════════════════════ */
(function initCredsCopy() {
  document.querySelectorAll('.cred-item').forEach(item => {
    const val = item.querySelector('.cred-val');
    if (!val) return;

    item.style.cursor = 'pointer';
    item.title        = 'Click to copy';

    let resetTimer = null;

    item.addEventListener('click', () => {
      window.copyToClipboard(val.textContent.trim(), `"${val.textContent.trim()}" copied!`);
      val.style.color      = 'var(--green)';
      val.style.transition = 'color 0.2s';
      // FIX: clear any previous timer before setting a new one
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        val.style.color = '';
        resetTimer = null;
      }, 1500);
    });

    item.addEventListener('mouseenter', () => {
      // Only tint if not in the middle of the green-flash sequence
      if (!resetTimer) val.style.color = 'var(--amber2)';
    });

    item.addEventListener('mouseleave', () => {
      // Only clear if we're not mid-flash
      if (!resetTimer) val.style.color = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   PAYLOAD ROWS — hover highlight (pure CSS injection)
══════════════════════════════════════════════ */
(function initPayloadHighlight() {
  if (!document.getElementById('payload-hover-style')) {
    const style = document.createElement('style');
    style.id = 'payload-hover-style';
    style.textContent = `.payload-body:hover { background: rgba(245,158,11,0.05); border-radius: 4px; transition: background 0.15s; }`;
    document.head.appendChild(style);
  }
})();