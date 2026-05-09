/**
 * docs.js — MQTT topic copy-to-clipboard, broker status,
 *            payload syntax highlight interactions
 * OpenRelay · FIKSI 2026
 */

'use strict';

/* ══════════════════════════════════════════════
   TOPIC ROWS — copy button wiring
   Each topic row has a .topic-copy button
══════════════════════════════════════════════ */
(function initTopicCopy() {
  document.querySelectorAll('.topic-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const row   = btn.closest('.topic-row');
      const topic = row?.querySelector('.topic-name')?.textContent?.trim();
      if (!topic) return;

      window.copyToClipboard(topic, `Topic copied: ${topic}`);

      // Visual feedback on the button
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
   Simulates a live "reachable" indicator
   (does not actually ping — visual only)
══════════════════════════════════════════════ */
(function initBrokerStatus() {
  const badge = document.getElementById('broker-status-badge');
  if (!badge) return;

  // Simulate latency check with a short delay
  setTimeout(() => {
    badge.innerHTML = `
      <span class="dot-live" style="margin-right:6px;"></span>
      broker.hivemq.com reachable
    `;
    badge.style.color       = 'var(--green)';
    badge.style.borderColor = 'rgba(34,197,94,0.35)';
    badge.style.background  = 'var(--green-dim)';
  }, 1200);
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

      // Flash the value green briefly
      val.style.color      = 'var(--green)';
      val.style.transition = 'color 0.2s';
      setTimeout(() => { val.style.color = ''; }, 1500);
    });

    // Hover hint
    item.addEventListener('mouseenter', () => {
      val.style.color = 'var(--amber2)';
    });
    item.addEventListener('mouseleave', () => {
      val.style.color = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   PAYLOAD ROWS — hover highlight
══════════════════════════════════════════════ */
(function initPayloadHighlight() {
  document.querySelectorAll('.payload-body').forEach(body => {
    // Wrap each line in a span for per-line hover
    const lines = body.innerHTML.split('\n');
    body.innerHTML = lines.map(line =>
      line.trim()
        ? `<span class="payload-line" style="display:block;padding:1px 0;border-radius:3px;transition:background 0.15s;">${line}</span>`
        : `<span style="display:block;height:6px;"></span>`
    ).join('');

    body.querySelectorAll('.payload-line').forEach(line => {
      line.addEventListener('mouseenter', () => {
        line.style.background = 'rgba(245,158,11,0.06)';
      });
      line.addEventListener('mouseleave', () => {
        line.style.background = '';
      });
    });
  });
})();
