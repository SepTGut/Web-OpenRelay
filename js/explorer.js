/* ════════════════════════════════════════════════
   explorer.js — Hardware Explorer Logic
   OpenRelay · FIKSI 2026
 
   BUGS FIXED:
    [7] Touch double-fire: touchstart+touchend both triggered click() — some
        browsers also fired the native click, toggling panel open then shut.
        Removed touchstart handler; kept only touchend with preventDefault.
    [8] closePanel() crashed with TypeError when lastFocusedElement was null
        (e.g. Escape pressed before any panel was ever opened).
    [+] mouseleave now checks if any node is active before resetting connections,
        so connections stay lit while a panel is open.
═════════════════════════════════════════════════ */

'use strict';

(function initExplorer() {

  const nodes       = document.querySelectorAll('.signal-flow-node');
  const conns       = document.querySelectorAll('.signal-flow-connection');
  const panel       = document.getElementById('detail-panel');
  const panelTitle  = document.getElementById('detail-panel-title');
  const panelBody   = document.getElementById('detail-panel-content');
  const panelClose  = document.getElementById('detail-panel-close');
  const overlay     = document.getElementById('panel-overlay');
  let lastFocusedElement = null;

  if (!nodes.length || !panel) return;

  /* ── NODE DETAILS ── */
  const details = {
    mqtt: {
      title: 'MQTT Broker',
      specs: [
        { k: 'Host',      v: 'broker.hivemq.com',      cls: '' },
        { k: 'TCP Port',  v: '1883',                   cls: 'blue' },
        { k: 'WSS Port',  v: '8884',                   cls: 'blue' },
        { k: 'WSS Path',  v: '/mqtt',                   cls: '' },
        { k: 'Auth',      v: 'Not Required',            cls: 'green' },
        { k: 'QoS',       v: '0 / 1 / 2',              cls: '' },
        { k: 'Status',    v: 'Online',                  cls: 'green' },
      ],
      items: [
        'Acts as the central communication hub for all OpenRelay devices.',
        'Supports retained messages and Last Will & Testament (LWT).',
        'Compatible with Home Assistant, Node-RED, and any MQTT client.',
        'Dashboard uses MQTT over WSS for secure browser connectivity.',
      ],
      topics: [
        'home/relay — main control',
        'home/relay/v — full state dump',
        'home/relay/relay/N/set — per-relay',
        'home/relay/status — LWT online/offline',
      ],
    },
    esp: {
      title: 'ESP32 SOC',
      specs: [
        { k: 'CPU',        v: 'Dual-core LX6',   cls: '' },
        { k: 'Clock',      v: '240 MHz',          cls: 'blue' },
        { k: 'SRAM',       v: '520 KB',           cls: '' },
        { k: 'Flash',      v: 'LittleFS 8 MB',    cls: '' },
        { k: 'Wi-Fi',      v: '802.11 b/g/n',     cls: '' },
        { k: 'OTA',        v: 'Supported',         cls: 'green' },
        { k: 'Watchdog',   v: 'Hardware 10s',      cls: '' },
      ],
      items: [
        'Main processing unit — runs firmware, MQTT client, and HTTP server.',
        'Hosts the local web dashboard via LittleFS.',
        'Manages I2C master bus to all expanders.',
        'Supports OTA firmware updates via ArduinoOTA.',
        'Hardware watchdog resets device if firmware hangs.',
      ],
      topics: [],
    },
    i2c: {
      title: 'I2C Bus',
      specs: [
        { k: 'Master',   v: 'ESP32',             cls: '' },
        { k: 'Speed',    v: '100 / 400 kHz',     cls: 'blue' },
        { k: 'SDA Pin',  v: 'GPIO 21',           cls: '' },
        { k: 'SCL Pin',  v: 'GPIO 22',           cls: '' },
        { k: 'MCP23017', v: '0x20–0x27',         cls: 'green' },
        { k: 'PCF8574',  v: '0x20–0x27',         cls: 'green' },
      ],
      items: [
        'Serial two-wire bus connecting ESP32 to all I/O expanders.',
        'Supports multiple expanders at different I2C addresses.',
        'Low-speed (100 kHz) for stability over longer PCB traces.',
        'Up to 128 relay channels via chained expander ICs.',
      ],
      topics: [],
    },
    expander: {
      title: 'I/O Expander',
      specs: [
        { k: 'MCP23017',  v: '16-bit I/O',   cls: '' },
        { k: 'PCF8574',   v: '8-bit I/O',    cls: '' },
        { k: 'Interface', v: 'I2C',           cls: 'blue' },
        { k: 'VCC',       v: '1.8V – 5.5V',  cls: '' },
        { k: 'Max CH',    v: '128 per bus',   cls: 'green' },
        { k: 'Interrupt', v: 'Supported',      cls: 'green' },
      ],
      items: [
        'MCP23017 provides 16 GPIOs via two 8-bit ports (A and B).',
        'PCF8574 provides 8 GPIOs for simpler expansion needs.',
        'Each IC supports configurable pull-ups and open-drain outputs.',
        'MCP23017 has interrupt-on-change output for efficient polling.',
        'Multiple ICs can be chained — up to 8 per address range.',
      ],
      topics: [],
    },
    relay: {
      title: 'Relay Channels',
      specs: [
        { k: 'Type',         v: 'SPDT Electromechanical', cls: '' },
        { k: 'Max Channels', v: '128',                    cls: 'blue' },
        { k: 'Contact',      v: '10A @ 250VAC',           cls: '' },
        { k: 'Coil',         v: '5V DC · ~150mW',         cls: '' },
        { k: 'Control',      v: 'MQTT / WebSocket / API', cls: 'green' },
        { k: 'Failsafe',     v: 'Hardware watchdog',      cls: 'green' },
      ],
      items: [
        'Physical output stage — switches real-world AC or DC loads.',
        'Each channel controllable via MQTT, WebSocket, or REST API.',
        'Supports pulse mode (momentary), timer mode, and pattern sequencer.',
        'Flyback diodes protect ESP32 GPIOs from coil back-EMF.',
        'LED indicators per channel show live ON/OFF state.',
      ],
      topics: [
        'home/relay/api — JSON command',
        'home/relay/relay/N/set — per-channel set',
        'home/relay/relay/N/v — per-channel state',
        'home/relay/v — full state JSON',
      ],
    },
  };

  /* ── BUILD PANEL HTML ── */
  function buildPanel(key) {
    const d = details[key];
    if (!d) return '';

    // Use DOM methods for all dynamic content — safe if data ever becomes dynamic
    const frag = document.createDocumentFragment();

    const intro = document.createElement('p');
    intro.style.cssText = 'color:var(--text-dim);margin-bottom:18px;font-size:13.5px;line-height:1.75;';
    intro.textContent = d.items[0];
    frag.appendChild(intro);

    const h4specs = document.createElement('h4');
    h4specs.textContent = 'Specifications';
    frag.appendChild(h4specs);

    const specWrap = document.createElement('div');
    specWrap.style.marginBottom = '20px';
    d.specs.forEach(s => {
      const row = document.createElement('div');
      row.className = 'detail-spec-row';
      const key = document.createElement('span');
      key.className = 'detail-spec-key';
      key.textContent = s.k;
      const val = document.createElement('span');
      val.className = `detail-spec-val ${s.cls}`;
      val.textContent = s.v;
      row.appendChild(key);
      row.appendChild(val);
      specWrap.appendChild(row);
    });
    frag.appendChild(specWrap);

    if (d.items.length > 1) {
      const h4det = document.createElement('h4');
      h4det.textContent = 'Details';
      frag.appendChild(h4det);
      const ul = document.createElement('ul');
      d.items.slice(1).forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }

    if (d.topics.length) {
      const h4top = document.createElement('h4');
      h4top.textContent = 'MQTT Topics';
      frag.appendChild(h4top);
      const ul = document.createElement('ul');
      d.topics.forEach(t => {
        const li = document.createElement('li');
        li.style.cssText = "font-family:'Chakra Petch',monospace;font-size:11px;color:var(--green);";
        li.textContent = t;
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }

    return frag;
  }

  /* ── OPEN / CLOSE PANEL ── */
  function openPanel(key) {
    const d = details[key];
    if (!d) return;

    lastFocusedElement = document.activeElement;

    panelTitle.textContent = d.title;
    panelBody.innerHTML    = '';
    panelBody.appendChild(buildPanel(key));
    panel.classList.add('open');
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => panelClose.focus());
  }

  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    conns.forEach(c => c.classList.remove('conn-active'));
    nodes.forEach(n => n.classList.remove('node-active'));

    // FIX [8]: guard against null — lastFocusedElement is null before first open
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  /* ── ACTIVATE CONNECTIONS UP TO NODE INDEX ── */
  function activateUpTo(idx) {
    conns.forEach((c, i) => c.classList.toggle('conn-active', i < idx));
  }

  /* ── NODE EVENTS ── */
  nodes.forEach((node, idx) => {

    node.addEventListener('mouseenter', () => activateUpTo(idx));

    node.addEventListener('mouseleave', () => {
      // FIX [+]: only reset if NO node is currently active (panel open)
      const anyActive = [...nodes].some(n => n.classList.contains('node-active'));
      if (!anyActive) {
        conns.forEach(c => c.classList.remove('conn-active'));
      }
    });

    node.addEventListener('click', () => {
      if (node.classList.contains('node-active')) {
        closePanel();
        return;
      }
      nodes.forEach(n => n.classList.remove('node-active'));
      node.classList.add('node-active');
      activateUpTo(idx);
      openPanel(node.dataset.detail);
    });

    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
    });

    // FIX [7]: Removed touchstart handler that called e.preventDefault() but
    // did nothing — it was causing double-fire on some browsers because
    // touchend then called node.click() AND the browser fired a synthetic click.
    // Now only touchend is used, which reliably fires once.
    node.addEventListener('touchend', e => {
      e.preventDefault();
      node.click();
    });
  });

  /* ── CLOSE TRIGGERS ── */
  panelClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

})();