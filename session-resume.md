## RESUME CONTEXT — OpenRelay Static Site — 2026-05-06

PROJECT: Static promo/info website for OpenRelay (ESP32 IoT relay controller, FIKSI 2026) — 5 pages, separated HTML/CSS/JS.

STATE:
- Folder: /home/claude/openrelay/ with css/ and js/ subdirs
- CSS done: style.css, home.css, features.css, docs.css, team.css ✓
- JS done: app.js ✓
- HTML done: none yet
- JS remaining: home.js, features.js, docs.js, team.js
- HTML remaining: index.html, home.html, features.html, docs.html, team.html

STRUCTURE:
- index.html → redirect to home.html
- home.html → Hero, Stats, Relay Visualizer, Competition Banner, About
- features.html → Feature grid (9 cards), Architecture flow, Code blocks, Relay arch table
- docs.html → MQTT topics, Broker info, Payload examples, Access cards, Creds box
- team.html → Team cards (GT + Rizky), FIKSI info, Timeline, School card
- css/style.css → shared: reset, vars, nav, footer, buttons, cards, reveal
- css/home.css, features.css, docs.css, team.css → page-specific styles
- js/app.js → nav active, mobile menu, scroll reveal, toast, copyToClipboard util
- js/home.js, features.js, docs.js, team.js → page-specific JS

TECH (OpenRelay project info for site content):
- ESP32, PlatformIO, LittleFS 8MB, MAX_RELAYS=128, PCF8574+MCP23017 expanders
- MQTT prefix: home/relay; broker: broker.hivemq.com TCP:1883 WSS:8884
- AP: ESP32-Relay / relay1234; OTA pw: relay_ota; hostname: relaycrtl
- WLED compat: ver=0.14.0-relay; Team: GT + M. Rizky Alfianno, SMKN 1 Madiun
- Dashboard hosted on GitHub Pages (HTTPS+MQTT WSS)

DESIGN:
- Colors: --bg #070a0f, --amber #f59e0b, --green #22c55e, --blue #38bdf8
- Fonts: Chakra Petch (headings/mono), DM Sans (body)
- Circuit grid background, scroll reveal (.reveal → .visible), amber accent

OPEN:
- All 4 remaining JS files
- All 5 HTML files
- Output zip or copy all to /mnt/user-data/outputs/

CONTINUE: Build home.js next (relay dot animator, hero animation), then features.js, docs.js, team.js, then all HTML files one by one.
