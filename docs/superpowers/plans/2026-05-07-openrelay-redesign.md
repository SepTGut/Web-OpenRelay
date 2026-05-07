# OpenRelay Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the OpenRelay website into a single-page landing page that combines the visual sophistication of the reference design with the complete content and functionality of the current multi-page site.

**Architecture:** We'll use a content-first structured approach where we organize information based on the current site's architecture, then apply the reference design's visual language, layout system, and components. This preserves all existing content while achieving the desired aesthetic goals.

**Tech Stack:** HTML5, CSS3 (with CSS variables), Vanilla JavaScript, Google Fonts (Chakra Petch, DM Sans)

---

### Task 1: Project Setup and Backup

**Files:**
- Create: `docs/superpowers/plans/2026-05-07-openrelay-redesign.md`
- Modify: None
- Test: None

- [ ] **Step 1: Create backup of original files**

```bash
cp home.html home.html.backup-plan
cp css/style.css css/style.css.backup-plan
cp css/home.css css/home.css.backup-plan
cp js/app.js js/app.js.backup-plan
cp js/home.js js/home.js.backup-plan
```

- [ ] **Step 2: Verify backup files exist**

Run: `ls -la *.backup-plan css/*.backup-plan js/*.backup-plan`
Expected: List of backup files with .backup-plan extension

- [ ] **Step 3: Commit backups**

```bash
git add home.html.backup-plan css/style.css.backup-plan css/home.css.backup-plan js/app.js.backup-plan js/home.js.backup-plan
git commit -m "chore: create backups before redesign"
```

### Task 2: Foundation - CSS Variables and Reset

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Analyze reference design CSS variables**

Read the reference design's CSS variables to understand the color scheme, spacing, and typography system

- [ ] **Step 2: Update CSS variables to match reference while adapting for our content**

```css
/* ── CSS VARIABLES ── */
:root {
  --bg:           #070a0f;
  --bg2:          #0d1117;
  --bg3:          #131a23;
  --bg4:          #1a2232;

  --amber:        #f59e0b;
  --amber2:       #fbbf24;
  --amber3:       #d97706;
  --amber-dim:    rgba(245, 158, 11, 0.12);
  --amber-glow:   rgba(245, 158, 11, 0.25);

  --green:        #22c55e;
  --green-dim:    rgba(34, 197, 94, 0.12);
  --blue:         #38bdf8;
  --blue-dim:     rgba(56, 189, 248, 0.12);
  --red:          #ef4444;

  --text:         #e2e8f0;
  --text-dim:     #64748b;
  --text-muted:   #334155;
  --text-bright:  #f8fafc;

  --border:       rgba(245, 158, 11, 0.12);
  --border2:      rgba(245, 158, 11, 0.28);
  --border3:      rgba(245, 158, 11, 0.45);

  --radius-sm:    6px;
  --radius-md:    10px;
  --radius-lg:    14px;
  --radius-xl:    20px;
  --radius-full:  9999px;

  --shadow-sm:    0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md:    0 4px 24px rgba(0, 0, 0, 0.5);
  --shadow-amber: 0 0 24px rgba(245, 158, 11, 0.2);

  --nav-h:        64px;
  --transition:   0.2s ease;
}
```

- [ ] **Step 3: Verify CSS variables are correctly formatted**

Run: `npx stylelint css/style.css --fix` (if stylelint available) or manually check formatting
Expected: No syntax errors

- [ ] **Step 4: Commit CSS changes**

```bash
git add css/style.css
git commit -m "style: update CSS variables to match reference design"
```

### Task 3: Circuit Grid Background Implementation

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add circuit grid background to body::before**

```css
/* ── CIRCUIT GRID BACKGROUND ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(245, 158, 11, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 158, 11, 0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Verify background displays correctly**

Run: Open home.html in browser and check for subtle grid pattern
Expected: Visible but subtle circuit grid background

- [ ] **Step 3: Commit background implementation**

```bash
git add css/style.css
git commit -m "style: add circuit grid background from reference design"
```

### Task 4: Navigation Redesign

**Files:**
- Modify: `css/style.css`
- Modify: `home.html`

- [ ] **Step 1: Update nav styles in CSS to match reference**

```css
/* ── NAV ── */
nav.site-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background: rgba(7, 10, 15, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  gap: 16px;
}

/* ... rest of nav styles from reference ... */
```

- [ ] **Step 2: Update home.html nav structure to match reference**

```html
<!-- ══ NAV ══ -->
<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <a href="home.html" class="nav-logo">
    <div class="nav-logo-mark">
      <!-- SVG logo -->
    </div>
    <span class="nav-brand">OpenRelay</span>
  </a>

  <ul class="nav-links" role="list">
    <li><a href="#about">Tentang</a></li>
    <li><a href="#features">Fitur</a></li>
    <li><a href="#architecture">Arsitektur</a></li>
    <li><a href="#team">Tim</a></li>
  </ul>

  <div class="nav-cta-wrap">
    <a href="#access" class="nav-cta">
      <!-- SVG icon -->
      Akses Sekarang
    </a>
  </div>

  <button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>
```

- [ ] **Step 3: Update mobile menu styles**

```css
/* Mobile hamburger */
.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 32px;
  padding: 4px;
  cursor: pointer;
}

.nav-hamburger span {
  display: block;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.3s;
}

.nav-mobile-menu {
  display: none;
  position: fixed;
  top: var(--nav-h);
  left: 0; right: 0;
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px 24px;
  z-index: 999;
  flex-direction: column;
  gap: 4px;
}

/* ... mobile menu styles ... */
```

- [ ] **Step 4: Test navigation functionality**

Run: Open home.html in browser and test:
  - Desktop nav links scroll to sections
  - Hamburger menu opens/closes mobile menu
  - Mobile menu links work
  - Active link highlighting
Expected: All navigation functions work correctly

- [ ] **Step 5: Commit navigation changes**

```bash
git add css/style.css home.html
git commit -m "nav: redesign navigation to match reference design"
```

### Task 5: Hero Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Update hero section styles in home.css**

```css
/* ── HERO ── */
.hero {
  min-height: calc(100vh - var(--nav-h));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px 60px;
  position: relative;
}

/* radial glow behind hero text */
.hero::after {
  content: '';
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* ... hero badge, h1, sub, actions styles ... */
```

- [ ] **Step 2: Update home.html hero section structure**

```html
<!-- ── HERO ── -->
<section class="hero" aria-label="Hero section">
  <div class="hero-badge">
    <span class="dot-live"></span>
    FIKSI 2026 &nbsp;·&nbsp; SMK Negeri 1 Madiun
  </div>

  <h1>
    Kontroler Relay IoT
    <span class="accent">Open Source</span>
  </h1>

  <p class="hero-sub">
    Sistem kontroler relay berbasis ESP32 yang memungkinkan pengendalian hingga 128 relay melalui
    protokol MQTT, dengan antarmuka web modern yang dapat diakses dari mana saja.
  </p>

  <div class="hero-actions">
    <a href="#access" class="btn btn-primary">
      <!-- SVG icon -->
      Coba Dashboard
    </a>
    <a href="#features" class="btn btn-outline">
      <!-- SVG icon -->
      Lihat Fitur
    </a>
  </div>

  <!-- Stats bar -->
  <div class="hero-stats" role="list" aria-label="Project statistics">
    <!-- Stats items -->
  </div>

  <!-- Relay visualizer -->
  <div class="relay-vis-wrap" aria-hidden="true">
    <div class="relay-vis-label">— Live relay simulation —</div>
    <div class="relay-vis" id="relay-vis"></div>
  </div>
</section>
```

- [ ] **Step 3: Update hero stats and actions styles**

```css
/* ── STATS BAR ── */
.hero-stats {
  margin-top: 72px;
  display: flex;
  gap: 0;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  /* ... animation and positioning ... */
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 20px 40px;
}

/* ... stat, stat-num, stat-label, stat-divider styles ... */

/* ── RELAY VISUALIZER ── */
/* ... relay-vis-wrap, relay-vis-label, relay-vis, relay-dot styles ... */
```

- [ ] **Step 4: Test hero section functionality**

Run: Open home.html in browser and verify:
  - Hero section fills viewport minus nav height
  - Radial gradient appears behind text
  - Hero badge animates in
  - Heading and subheading fade up with staggered delays
  - CTA buttons display correctly
  - Stats bar appears with proper styling
  - Relay visualizer label appears
Expected: All hero elements display and animate correctly

- [ ] **Step 5: Commit hero section changes**

```bash
git add css/home.css home.html
git commit -m "hero: implement hero section with reference design styling"
```

### Task 6: Competition Banner Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add competition banner styles to home.css**

```css
/* ── COMPETITION BANNER ── */
.comp-banner {
  background: linear-gradient(135deg, rgba(13,26,15,0.9) 0%, rgba(7,16,26,0.9) 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 1;
}

.comp-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 52px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

/* ... comp-left, comp-badges, comp-badge, comp-badge-icon, comp-badge-name, comp-badge-sub styles ... */
```

- [ ] **Step 2: Add competition banner to home.html**

```html
<!-- ── COMPETITION BANNER ── -->
<div class="comp-banner" role="complementary" aria-label="Competition info">
  <div class="comp-inner">
    <div class="comp-left">
      <h2>Kompetisi FIKSI 2026</h2>
      <p>
        Diajukan sebagai karya unggulan Teknologi Informasi dan Komunikasi
        tingkat nasional — firmware, PCB, dan web dashboard terintegrasi.
      </p>
    </div>
    <div class="comp-badges">
      <!-- Badge items -->
    </div>
  </div>
</div>
```

- [ ] **Step 3: Test competition banner display**

Run: Open home.html in browser and verify:
  - Banner appears with dark gradient background
  - Left side shows competition title and description
  - Right side shows badges with icons and text
  - Banner has top and bottom borders
Expected: Competition banner displays correctly with all content

- [ ] **Step 4: Commit competition banner changes**

```bash
git add css/home.css home.html
git commit -m "comp: add competition banner with reference design styling"
```

### Task 7: About Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add about section styles to home.css**

```css
/* ── ABOUT SECTION ── */
.about-section { position: relative; z-index: 1; }

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  margin-top: 56px;
  align-items: start;
}

/* ... about-text, about-text p, about-text p strong, about-text p:last-child styles ... */

.about-highlights {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ... highlight-item, highlight-item::before styles ... */

.spec-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
}

/* ... spec-card::before, spec-card-header, spec-card-title, spec-rows, spec-row, spec-key, spec-val styles ... */
```

- [ ] **Step 2: Add about section to home.html**

```html
<!-- ── ABOUT ── -->
<section class="about-section" id="tentang" aria-labelledby="about-heading">
  <div class="section-inner">
    <div class="section-tag">Tentang Proyek</div>
    <h2 class="section-title" id="about-heading">Apa Itu OpenRelay?</h2>
    <p class="section-desc">
      Sistem kontroler relay IoT open source yang dibangun di atas ESP32,
      dirancang untuk memudahkan otomasi rumah dan industri dengan antarmuka modern.
    </p>

    <div class="about-grid reveal">
      <!-- Left: text content -->
      <div class="about-text">
        <!-- About paragraphs -->
      </div>

      <!-- Right: spec card -->
      <div class="spec-card reveal reveal-delay-2">
        <div class="spec-card-header">
          <div class="spec-card-title">// Spesifikasi Utama</div>
        </div>
        <div class="spec-rows">
          <!-- Spec rows -->
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="margin-top: 56px; display: flex; gap: 14px; flex-wrap: wrap;" class="reveal reveal-delay-3">
      <!-- CTA buttons -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Test about section display**

Run: Open home.html in browser and verify:
  - Section tag appears
  - Section title and description display
  - About grid shows text on left and spec card on right
  - Highlights list displays properly
  - Spec card shows specification details with proper styling
  - CTA buttons display correctly
  - Reveal animations work on scroll
Expected: About section displays all content correctly with proper styling and animations

- [ ] **Step 4: Commit about section changes**

```bash
git add css/home.css home.html
git commit -m "about: implement about section with reference design styling"
```

### Task 8: Features Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add features section styles to home.css**

```css
/* ── FEATURES SECTION ── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

/* ... feature-card, feature-card:hover, feature-card::before, feature-icon, feature-title, feature-description styles ... */
```

- [ ] **Step 2: Add features section to home.html**

```html
<!-- ── FEATURES ── -->
<section class="features-section" id="features" aria-labelledby="features-heading">
  <div class="section-inner">
    <div class="section-tag">Fitur Unggulan</div>
    <h2 class="section-title" id="features-heading">Semua yang Kamu Butuhkan</h2>
    <p class="section-desc">
      OpenRelay hadir dengan fitur lengkap dari firmware hingga dashboard, semua dalam satu paket open source.
    </p>

    <div class="features-grid reveal reveal-delay-1">
      <!-- Feature cards -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Test features section display**

Run: Open home.html in browser and verify:
  - Section tag and title display
  - Section description displays
  - Features grid shows cards in responsive layout
  - Each feature card has icon, title, and description
  - Cards have proper hover effects (border color change and slight lift)
  - Reveal animations work on scroll
Expected: Features section displays all feature cards correctly with proper styling, hover effects, and animations

- [ ] **Step 4: Commit features section changes**

```bash
git add css/home.css home.html
git commit -m "features: implement features section with reference design styling"
```

### Task 9: Architecture Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add architecture section styles to home.css**

```css
/* ── ARCHITECTURE SECTION ── */
.architecture-content {
  margin-top: 32px;
}

/* ... arch-flow, arch-node, arch-node:hover, arch-node-icon, arch-node-title, arch-node-subtitle, arch-arrow, arch-details, detail-item, detail-label, detail-value styles ... */
```

- [ ] **Step 2: Add architecture section to home.html**

```html
<!-- ── ARCHITECTURE ── -->
<section class="architecture-section" id="architecture" aria-labelledby="architecture-heading">
  <div class="section-inner">
    <div class="section-tag">Arsitektur Sistem</div>
    <h2 class="section-title" id="architecture-heading">Bagaimana Cara Kerjanya</h2>
    <p class="section-desc">
      Tiga layer yang terpisah namun terintegrasi: hardware, firmware, dan web dashboard.
    </p>

    <div class="architecture-content reveal">
      <div class="arch-flow">
        <!-- Architecture flow nodes and arrows -->
      </div>

      <div class="arch-details">
        <!-- Architecture details items -->
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Test architecture section display**

Run: Open home.html in browser and verify:
  - Section tag and title display
  - Section description displays
  - Architecture flow shows nodes connected by arrows
  - Each node has icon, title, and subtitle with proper styling
  - Architecture details show specification items in grid
  - Reveal animations work on scroll
Expected: Architecture section displays the system flow and details correctly with proper styling and animations

- [ ] **Step 4: Commit architecture section changes**

```bash
git add css/home.css home.html
git commit -m "architecture: implement architecture section with reference design styling"
```

### Task 10: Team Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add team section styles to home.css**

```css
/* ── TEAM SECTION ── */
.team-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

/* ... team-member, team-member:hover, team-avatar, team-name, team-role, team-school styles ... */
```

- [ ] **Step 2: Add team section to home.html**

```html
<!-- ── TEAM ── -->
<section class="team-section" id="team" aria-labelledby="team-heading">
  <div class="section-inner">
    <div class="section-tag">Tim Pengembang</div>
    <h2 class="section-title" id="team-heading">Dibuat oleh Pelajar Indonesia</h2>
    <p class="section-desc" style="text-align: center; max-width: 600px; margin: 0 auto 2rem;">
      Proyek ini dikerjakan oleh dua siswa SMK Negeri 1 Madiun sebagai karya kompetisi FIKSI 2026.
    </p>

    <div class="team-content reveal">
      <!-- Team member cards -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Test team section display**

Run: Open home.html in browser and verify:
  - Section tag and title display
  - Section description displays
  - Team grid shows member cards in responsive layout
  - Each team member card has avatar, name, role, and school
  - Cards have proper hover effects (border color change and slight lift)
  - Reveal animations work on scroll
Expected: Team section displays all team members correctly with proper styling, hover effects, and animations

- [ ] **Step 4: Commit team section changes**

```bash
git add css/home.css home.html
git commit -m "team: implement team section with reference design styling"
```

### Task 11: Access Section Implementation

**Files:**
- Modify: `css/home.css`
- Modify: `home.html`

- [ ] **Step 1: Add access section styles to home.css**

```css
/* ── ACCESS SECTION ── */
.access-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

/* ... access-card, access-card:hover, access-card::before, access-icon, access-title, access-description, access-link, access-link:hover styles ... */

/* WiFi Access Point Info */
.wifi-info {
  text-align: center;
  margin-top: 32px;
  padding: 24px;
  background: #2b3e64;
  border-radius: 5px;
  border: 1px solid #2b3e64;
}

/* ... wifi-info p, wifi-grid, wifi-item, wifi-label, wifi-value styles ... */
```

- [ ] **Step 2: Add access section to home.html**

```html
<!-- ── ACCESS ── -->
<section class="access-section" id="access" aria-labelledby="access-heading">
  <div class="section-inner">
    <div class="section-tag">Akses Proyek</div>
    <h2 class="section-title" id="access-heading">Mulai Sekarang</h2>
    <p class="section-desc">
      Dashboard web bisa langsung diakses dari browser. Firmware dan PCB tersedia untuk dikembangkan lebih lanjut.
    </p>

    <div class="access-content reveal">
      <!-- Access cards -->
    </div>

    <!-- WiFi Access Point Info -->
    <div style="text-align: center; margin-top: 4rem; padding: 2rem; background: var(--bg2); border-radius: var(--radius-lg); border: 1px solid var(--border); max-width: 500px; margin-left: auto; margin-right: auto;">
      <!-- WiFi info content -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: Test access section display**

Run: Open home.html in browser and verify:
  - Section tag and title display
  - Section description displays
  - Access grid shows cards in responsive layout
  - Each access card has icon, title, description, and link
  - Cards have proper hover effects (border color change and slight lift)
  - WiFi access point info displays correctly with proper styling
  - Reveal animations work on scroll
Expected: Access section displays all access options and WiFi info correctly with proper styling, hover effects, and animations

- [ ] **Step 4: Commit access section changes**

```bash
git add css/home.css home.html
git commit -m "access: implement access section with reference design styling"
```

### Task 12: Footer Implementation

**Files:**
- Modify: `css/style.css`
- Modify: `home.html`

- [ ] **Step 1: Update footer styles in CSS to match reference**

```css
/* ── FOOTER ── */
footer.site-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 0 48px;
}

/* ... footer-main, footer-brand, footer-desc, footer-col-title, footer-links-list, footer-links-list a, footer-links-list a:hover, footer-spec-row, footer-spec-key, footer-spec-val, footer-bottom, footer-copy, footer-bottom-links, footer-bottom-links a, footer-bottom-links a:hover styles ... */

/* Responsive footer styles */
```

- [ ] **Step 2: Update home.html footer structure**

```html
<!-- ══ FOOTER ══ -->
<footer class="site-footer" role="contentinfo">
  <div class="footer-main">
    <!-- Footer brand, navigation, device info sections -->
  </div>

  <div class="footer-bottom">
    <!-- Copyright and bottom links -->
  </div>
</footer>
```

- [ ] **Step 3: Test footer display**

Run: Open home.html in browser and verify:
  - Footer displays with top border
  - Footer brand shows logo and description
  - Navigation links work correctly
  - Device info section shows specifications
  - Copyright shows current year and credits
  - Bottom links work correctly
  - Responsive behavior at different breakpoints
Expected: Footer displays all content correctly with proper styling and responsive behavior

- [ ] **Step 4: Commit footer changes**

```bash
git add css/style.css home.html
git commit -m "footer: update footer to match reference design styling"
```

### Task 13: JavaScript Enhancements

**Files:**
- Modify: `js/app.js`
- Modify: `js/home.js`

- [ ] **Step 1: Enhance navigation in app.js**

Ensure the navigation active state works correctly with anchor links in the single page
Ensure mobile menu hamburger to X animation works
Ensure smooth scroll for anchor links functions properly
Ensure scroll reveal animations work with the new structure
Ensure toast notifications function properly
Ensure year in footer updates correctly

- [ ] **Step 2: Enhance relay dot animator in home.js**

Ensure the relay visualizer works with 64 dots and wave animation
Ensure it pauses when tab is hidden to save CPU
Ensure it resumes when tab becomes visible

- [ ] **Step 3: Test all JavaScript functionality**

Run: Open home.html in browser and test:
  - Navigation active state on scroll
  - Mobile menu toggle with hamburger to X animation
  - Smooth scroll when clicking nav links
  - Scroll reveal animations as sections enter viewport
  - Toast notifications (can test by calling showToast function)
  - Relay dot animator shows waving dots
  - Year in footer displays current year
Expected: All JavaScript functionality works correctly

- [ ] **Step 4: Commit JavaScript changes**

```bash
git add js/app.js js/home.js
git commit -m "js: enhance navigation and relay visualizer functionality"
```

### Task 14: Responsive Design Implementation

**Files:**
- Modify: `css/style.css`
- Modify: `css/home.css`

- [ ] **Step 1: Update responsive breakpoints in CSS**

Ensure the responsive designs work correctly at:
  - Mobile (< 600px)
  - Tablet (600px - 900px)
  - Desktop (> 900px)

- [ ] **Step 2: Test responsive design**

Run: Open home.html in browser and test at different widths:
  - Mobile width: Verify navigation becomes hamburger menu, sections stack vertically
  - Tablet width: Verify some sections may show side-by-side layout
  - Desktop width: Verify multi-column layouts work properly
Expected: Responsive design works correctly at all breakpoints

- [ ] **Step 3: Commit responsive design changes**

```bash
git add css/style.css css/home.css
git commit -m "responsive: update responsive design for all breakpoints"
```

### Task 15: Final Integration and Testing

**Files:**
- Modify: `home.html`
- Modify: `css/style.css`
- Modify: `css/home.css`
- Modify: `js/app.js`
- Modify: `js/home.js`

- [ ] **Step 1: Perform final visual inspection**

Run: Open home.html in browser and compare with reference design
Check for visual consistency in:
  - Color scheme
  - Typography
  - Spacing and layout
  - Component styling
  - Animations and transitions

- [ ] **Step 2: Test all functionality**

Run: Comprehensive test of:
  - All navigation links
  - Mobile menu functionality
  - All interactive buttons and links
  - Animations on scroll
  - Relay visualizer animation
  - Stat counter animations
  - Responsive behavior
  - Console for any errors

- [ ] **Step 3: Verify content completeness**

Check that all information from the original multi-page site is present:
  - Hero section content
  - About section ("Tentang Proyek")
  - Features section ("Fitur Utama")
  - Architecture section
  - Team section
  - Access section
  - Competition banner
  - Footer information

- [ ] **Step 4: Commit final changes**

```bash
git add home.html css/style.css css/home.css js/app.js js/home.js
git commit -m "feat: complete OpenRelay website redesign implementation"
```

## Verification

1. Visual inspection: Compare home.html to reference design
2. Responsive testing: Check mobile breakpoints
3. Functionality: Ensure navigation anchors work, relay animator functions
4. Performance: Check for any console errors
5. Content completeness: Verify all information from current site is present

## Rollback Plan

Since we're modifying core files, we can:
1. Restore from backup files created in Task 1
2. If needed, use git reset to revert commits
3. The redirect in index.html provides a safety net

## Dependencies

- Google Fonts: Chakra Petch and DM Sans (already used)
- No external libraries needed (pure HTML/CSS/JS)