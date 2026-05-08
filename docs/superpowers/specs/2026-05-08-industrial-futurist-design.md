# Design Specification: Industrial-Futurist UI Elevation & Hardware Explorer

## 1. Aesthetic Direction
**Tone:** Industrial-Futurist / Tactical HUD.
**Goal:** Transform the landing pages from a "clean dark site" to a "high-fidelity hardware interface."
**Key Visual Pillars:**
- **Precision:** Technical grid lines, coordinate markers, and architectural blueprints.
- **Atmosphere:** Noise/grain textures to remove digital flatness, depth via layered transparencies.
- **Tacticality:** L-shaped corner brackets, micro-data readouts, and amber-on-black high contrast.

---

## 2. Global UI Elevation (All Pages)
These elements will be implemented as a global layer to maintain cohesion.

### 2.1 Atmospheric Layer
- **Grain/Noise Overlay**: A fixed, full-screen overlay with a subtle animated SVG noise filter.
- **Dynamic Grid**: Enhancement of the current `body::before` grid to include occasional "pulses" of light moving along the lines.
- **The Scan-line**: A thin, semi-transparent amber line that slowly sweeps from top to bottom, with a very subtle horizontal shift (glitch) every few seconds.

### 2.2 HUD Framework
- **Corner Brackets**: Four absolute-positioned L-shaped brackets in the viewport corners, pulsing slightly in `var(--amber-dim)`.
- **Live Data Readouts**: Small, monospace text blocks in the margins (e.g., `SYSTEM_STATUS: NOMINAL`, `VCC: 3.3V`, `SDA_BUS: ACTIVE`) that occasionally update their values to simulate real-time monitoring.
- **Custom Cursor**: A "crosshair" cursor (`+`) that expands or changes color when hovering over interactive elements (`.btn`, `.card`).

### 2.3 Motion & Interaction
- **Glitch Reveal**: Replace the standard `reveal` animation with a staggered "glitch" effect (rapid horizontal shifts + opacity flicker).
- **Glass-Panel Cards**: Cards will use `backdrop-filter: blur(12px)` and high-contrast 1px borders to feel like physical translucent panels.

---

## 3. Hardware Explorer (`explorer.html`)
A new, dedicated page focused on the a technical "deep dive" into the system signal flow.

### 3.1 The Signal Flow Map
- **Visualization**: A horizontal chain of nodes:
  `MQTT Broker` $\rightarrow$ `ESP32` $\rightarrow$ `I2C Bus` $\rightarrow$ `Expander` $\rightarrow$ `Relay`.
- **Interactive Flow**: 
  - Hovering over a node lights up the path from the start of the chain to that node.
  - Clicking a node opens a "Detail Panel" on the right side of the screen.
- **Blueprint Aesthetic**: 
  - Background: Deep black with a heavy 20px grid.
  - Lines: Thin amber lines with "marching ants" animation to show data moving.

### 3.2 Node Details
- **ESP32 Node**: Shows memory usage, CPU clock, and LittleFS status.
- **Expander Node**: Shows the bit-mapping for PCF8574 and MCP23017.
- **Relay Node**: Displays the current state (ON/OFF) and the corresponding MQTT topic.

---

## 4. Technical Implementation
- **CSS**: Use a new `explorer.css` and update `style.css` for global HUD elements.
- **JS**: A new `explorer.js` to handle the signal flow logic and node interactions.
- **HTML**: Create `explorer.html` using the same nav/footer structure as the rest of the site.

---

## 5. Success Criteria
- The site feels like a "piece of hardware" rather than a webpage.
- The Hardware Explorer clearly explains the system's architecture visually.
- All animations remain performant (GPU accelerated).
