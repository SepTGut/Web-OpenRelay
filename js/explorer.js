/* ════════════════════════════════════════════════
   explorer.js — Hardware Explorer Logic
   OpenRelay · FIKSI 2026
═════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const nodes = document.querySelectorAll('.signal-flow-node');
  const connections = document.querySelectorAll('.signal-flow-connection');
  const detailPanel = document.getElementById('detail-panel');
  const detailPanelTitle = document.querySelector('.detail-panel-title');
  const detailPanelContent = document.querySelector('.detail-panel-content');
  const detailPanelClose = document.querySelector('.detail-panel-close');

  // Node details content
  const nodeDetails = {
    mqtt: {
      title: 'MQTT Broker',
      content: `
        <p>The MQTT broker acts as the central communication hub for the OpenRelay system.</p>
        <h4>Specifications:</h4>
        <ul>
          <li>Protocol: MQTT v3.1.1 / v5.0</li>
          <li>Port: 1883 (TCP), 8883 (TLS)</li>
          <li>Authentication: Username/Password or Certificate-based</li>
          <li>QoS Levels: 0, 1, 2</li>
          <li>Features: Retained messages, Last Will and Testament (LWT)</li>
        </ul>
        <h4>Topics:</h4>
        <ul>
          <li>home/relay/state - Relay state updates</li>
          <li>home/relay/command - Control commands</li>
          <li>home/relay/sensor - Sensor data</li>
          <li>home/relay/diagnostic - System diagnostics</li>
        </ul>
      `
    },
    esp: {
      title: 'ESP32 SOC',
      content: `
        <p>The ESP32 System-on-Chip is the main processing unit of the OpenRelay system.</p>
        <h4>Current Status:</h4>
        <ul>
          <li><strong>CPU Clock:</strong> 240 MHz (Dual-core)</li>
          <li><strong>Memory Usage:</strong> 312 KB / 520 KB SRAM (60%)</li>
          <li><strong>LittleFS:</strong> 1.2 MB / 4 MB Used (30%)</li>
          <li><strong>Wi-Fi:</strong> Connected to OpenRelay-SSID</li>
          <li><strong>IP Address:</strong> 192.168.1.105</li>
        </ul>
        <h4>Specifications:</h4>
        <ul>
          <li>CPU: Dual-core Tensilica LX6, up to 240 MHz</li>
          <li>Memory: 520 KB SRAM, 4 MB Flash</li>
          <li>Wi-Fi: 802.11 b/g/n (2.4 GHz)</li>
          <li>Bluetooth: v4.2 BR/EDR and BLE</li>
          <li>GPIO: 34 programmable pins</li>
          <li>Peripherals: SPI, I2C, I2S, UART, ADC, DAC</li>
        </ul>
        <h4>Functions:</h4>
        <ul>
          <li>MQTT client for communication</li>
          <li>I2C master for peripheral communication</li>
          <li>GPIO control for relay switching</li>
          <li>OTA update capability</li>
          <li>Local web dashboard hosting</li>
        </ul>
      `
    },
    i2c: {
      title: 'I2C Bus',
      content: `
        <p>The I2C (Inter-Integrated Circuit) bus is used for communication between the ESP32 and peripheral devices.</p>
        <h4>Specifications:</h4>
        <ul>
          <li>Protocol: I2C v3.0</li>
          <li>Speed: Standard (100 kHz), Fast (400 kHz)</li>
          <li>Addressing: 7-bit or 10-bit</li>
          <li>Master: ESP32</li>
          <li>Slaves: PCF8574, MCP23017, sensors</li>
        </ul>
        <h4>Connected Devices:</h4>
        <ul>
          <li>PCF8574 I/O Expander (Address: 0x20)</li>
          <li>MCP23017 I/O Expander (Address: 0x27)</li>
          <li>INMP441 I2S Microphone (Address: 0x4B)</li>
          <li>BME280 Environmental Sensor (Address: 0x76)</li>
        </ul>
      `
    },
    expander: {
      title: 'I/O Expander',
      content: `
        <p>The I/O expander provides additional GPIO pins for the ESP32 to control more devices.</p>
        <h4>Bit Mapping:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h5>MCP23017 (0x20) - 16-bit</h5>
            <div style="font-family: monospace; font-size: 12px;">
              <div>GPIO A0-A7: <span style="color: var(--amber);">11111111</span> (Relay Ch 1-8)</div>
              <div>GPIO B0-B3: <span style="color: var(--amber-dim);">0000</span> (Free)</div>
              <div>GPIO B4-B7: <span style="color: var(--amber);">1010</span> (Sensors)</div>
            </div>
          </div>
          <div>
            <h5>PCF8574 (0x27) - 8-bit</h5>
            <div style="font-family: monospace; font-size: 12px;">
              <div>GPIO P0-P7: <span style="color: var(--amber-dim);">00000000</span> (Inputs)</div>
            </div>
          </div>
        </div>
        <h4>Specifications:</h4>
        <ul>
          <li>Chip: MCP23017 (Primary), PCF8574 (Secondary)</li>
          <li>Interface: I2C</li>
          <li>MCP23017: 16-bit I/O with interrupts</li>
          <li>PCF8574: 8-bit simple I/O</li>
          <li>Operating Voltage: 1.8V to 5.5V</li>
        </ul>
        <h4>Pin Functions:</h4>
        <ul>
          <li>MCP23017:
            <ul>
              <li>GPIO A0-A7: Relay control channels 1-8</li>
              <li>GPIO B0-B7: Available for expansion</li>
            </ul>
          </li>
          <li>PCF8574:
            <ul>
              <li>GPIO P0-P7: Sensor inputs and status indicators</li>
            </ul>
          </li>
        </ul>
        <h4>Features:</h4>
        <ul>
          <li>Interrupt output for pin change detection</li>
          <li>Configurable pull-up/pull-down resistors</li>
          <li>Open-drain output option</li>
          <li>High current sink/source capability</li>
        </ul>
      `
    },
    relay: {
      title: 'Relay Channels',
      content: `
        <p>The relay channels provide physical switching capability for controlling external devices.</p>
        <h4>Current State:</h4>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 1</div>
            <div style="color: var(--green); font-weight: bold;">ON</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 2</div>
            <div style="color: var(--red); font-weight: bold;">OFF</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 3</div>
            <div style="color: var(--green); font-weight: bold;">ON</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 4</div>
            <div style="color: var(--red); font-weight: bold;">OFF</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 5</div>
            <div style="color: var(--green); font-weight: bold;">ON</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 6</div>
            <div style="color: var(--red); font-weight: bold;">OFF</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 7</div>
            <div style="color: var(--green); font-weight: bold;">ON</div>
          </div>
          <div style="text-align: center; padding: 8px; background: var(--bg3); border-radius: var(--radius-sm);">
            <div>Relay 8</div>
            <div style="color: var(--red); font-weight: bold;">OFF</div>
          </div>
        </div>
        <h4>MQTT Topics:</h4>
        <div style="margin-bottom: 20px;">
          <div style="font-family: monospace; font-size: 12px;">
            <div>home/relay/state: <span style="color: var(--amber);">{"1":true,"2":false,"3":true,"4":false,"5":true,"6":false,"7":true,"8":false}</span></div>
            <div>home/relay/command: <span style="color: var(--amber-dim);">Listening for control commands</span></div>
          </div>
        </div>
        <h4>Specifications:</h4>
        <ul>
          <li>Type: Electromechanical Relay (SPDT)</li>
          <li>Channels: 8 individual relays</li>
          <li>Contact Rating: 10A @ 250VAC / 30VDC</li>
          <li>Switching Voltage: Max 400VAC, 125VDC</li>
          <li>Switching Current: Max 10A</li>
          <li>Coil Voltage: 5VDC</li>
          <li>Coil Power: ~150mW per relay</li>
        </ul>
        <h4>Channel Mapping:</h4>
        <ul>
          <li>Relay 1: GPIO A0 (MCP23017) - Main Power</li>
          <li>Relay 2: GPIO A1 (MCP23017) - Auxiliary Power</li>
          <li>Relay 3: GPIO A2 (MCP23017) - Heating Control</li>
          <li>Relay 4: GPIO A3 (MCP23017) - Cooling Control</li>
          <li>Relay 5: GPIO A4 (MCP23017) - Valve Control</li>
          <li>Relay 6: GPIO A5 (MCP23017) - Pump Control</li>
          <li>Relay 7: GPIO A6 (MCP23017) - Fan Control</li>
          <li>Relay 8: GPIO A7 (MCP23017) - Alarm/Signal</li>
        </ul>
        <h4>Features:</h4>
        <ul>
          <li>LED status indicators for each channel</li>
          <li>Flyback diodes for back-EMF protection</li>
          <li>Opto-isolation available on some models</li>
          <li>Manual override switches (optional)</li>
        </ul>
      `
    }
  };

  // State
  let activeNodes = new Set();

  // Initialize connection lines based on node positions
  function updateConnections() {
    const nodePositions = {};

    // Get positions of all nodes
    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      nodePositions[node.id] = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    });

    // Update connection positions and sizes
    const connectionMap = [
      { from: 'node-mqtt', to: 'node-esp', id: 'conn-mqtt-esp' },
      { from: 'node-esp', to: 'node-i2c', id: 'conn-esp-i2c' },
      { from: 'node-i2c', to: 'node-exp', id: 'conn-i2c-exp' },
      { from: 'node-exp', to: 'node-relay', id: 'conn-exp-relay' }
    ];

    connectionMap.forEach(conn => {
      const fromPos = nodePositions[conn.from];
      const toPos = nodePositions[conn.to];
      const connectionEl = document.getElementById(conn.id);

      if (fromPos && toPos && connectionEl) {
        // Calculate connection dimensions
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        connectionEl.style.width = `${length}px`;
        connectionEl.style.left = `${fromPos.x}px`;
        connectionEl.style.top = `${fromPos.y}px`;
        connectionEl.style.transform = `rotate(${angle}deg)`;
      }
    });
  }

  // Update detail panel content
  function showDetailPanel(nodeId) {
    const detail = nodeDetails[nodeId];
    if (!detail) return;

    detailPanelTitle.textContent = detail.title;
    detailPanelContent.innerHTML = detail.content;
    detailPanel.classList.add('open');
  }

  // Hide detail panel
  function hideDetailPanel() {
    detailPanel.classList.remove('open');
  }

  // Set active connections based on hovered node
  function setActiveConnections(nodeId) {
    // Reset all connections
    connections.forEach(conn => conn.classList.remove('active'));

    // Determine which connections should be active based on node position
    const nodeIndex = Array.from(nodes).findIndex(node => node.id === nodeId);

    // Activate all connections from start to this node
    const connectionMap = [
      { from: 'node-mqtt', to: 'node-esp', id: 'conn-mqtt-esp' },
      { from: 'node-esp', to: 'node-i2c', id: 'conn-esp-i2c' },
      { from: 'node-i2c', to: 'node-exp', id: 'conn-i2c-exp' },
      { from: 'node-exp', to: 'node-relay', id: 'conn-exp-relay' }
    ];

    // For each connection, if the "from" node is at or before the clicked node, activate it
    connectionMap.forEach((conn, index) => {
      const fromNodeIndex = Array.from(nodes).findIndex(node => node.id === conn.from);
      if (fromNodeIndex <= nodeIndex) {
        const connectionEl = document.getElementById(conn.id);
        if (connectionEl) {
          connectionEl.classList.add('active');
        }
      }
    });
  }

  // Event Listeners
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      // Activate connections up to this node
      setActiveConnections(node.id);
    });

    node.addEventListener('mouseleave', () => {
      // Deactivate all connections when leaving nodes
      connections.forEach(conn => conn.classList.remove('active'));
    });

    node.addEventListener('click', () => {
      // Show detail panel for this node
      const nodeId = node.id.replace('node-', '');
      showDetailPanel(nodeId);

      // Keep connections active for this node
      setActiveConnections(node.id);

      // Mark as active node
      activeNodes.add(node.id);
      node.classList.add('active-node');
    });
  });

  // Close panel button
  detailPanelClose.addEventListener('click', hideDetailPanel);

  // Close panel when clicking outside
  detailPanel.addEventListener('click', (e) => {
    if (e.target === detailPanel) {
      hideDetailPanel();

      // Reset active state
      connections.forEach(conn => conn.classList.remove('active'));
      nodes.forEach(node => {
        node.classList.remove('active-node');
        activeNodes.delete(node.id);
      });
    }
  });

  // Escape key to close panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailPanel.classList.contains('open')) {
      hideDetailPanel();

      // Reset active state
      connections.forEach(conn => conn.classList.remove('active'));
      nodes.forEach(node => {
        node.classList.remove('active-node');
        activeNodes.delete(node.id);
      });
    }
  });

  // Initial setup
  updateConnections();

  // Update on resize
  window.addEventListener('resize', () => {
    updateConnections();

    // If detail panel is open, keep it positioned correctly
    if (detailPanel.classList.contains('open')) {
      // Re-show to trigger repositioning
      const firstActiveNode = Array.from(activeNodes)[0];
      if (firstActiveNode) {
        showDetailPanel(firstActiveNode.replace('node-', ''));
      }
    }
  });

  // Add active node class to CSS (would be better in CSS file, but adding here for completeness)
  const style = document.createElement('style');
  style.textContent = `
    .active-node {
      background: var(--amber) !important;
      color: #000 !important;
      border-color: var(--amber2) !important;
      box-shadow: 0 0 20px var(--amber) !important;
    }
  `;
  document.head.appendChild(style);
});