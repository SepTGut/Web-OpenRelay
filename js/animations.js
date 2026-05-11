/**
 * animations.js — Eye-catching animations: particles, cursor trail,
 *                 parallax scrolling, magnetic buttons, typed text effects
 * OpenRelay · FIKSI 2026
 */

'use strict';

/* ══════════════════════════════════════════════
   PARTICLE FIELD — floating ambient particles
══════════════════════════════════════════════ */
(function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const field = document.createElement('div');
  field.className = 'particle-field';
  field.setAttribute('aria-hidden', 'true');
  document.body.appendChild(field);

  const PARTICLE_COUNT = 25;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    // randomize each particle
    const size = 2 + Math.random() * 3;
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 20;
    const delay = Math.random() * duration;
    const hue = Math.random() > 0.7 ? '152, 87%' : '36, 92%'; // green or amber
    const lightness = 50 + Math.random() * 20;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: hsl(${hue}, ${lightness}%);
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    field.appendChild(p);
  }
})();


/* ══════════════════════════════════════════════
   AURORA GLOW — subtle animated background glow
══════════════════════════════════════════════ */
(function initAurora() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const aurora = document.createElement('div');
  aurora.className = 'aurora-glow';
  aurora.setAttribute('aria-hidden', 'true');
  document.body.appendChild(aurora);
})();


/* ══════════════════════════════════════════════
   CURSOR GLOW TRAIL — subtle amber dot following cursor
══════════════════════════════════════════════ */
(function initCursorTrail() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('active');
  });

  function animate() {
    // Smooth follow with easing
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
    requestAnimationFrame(animate);
  }

  animate();
})();


/* ══════════════════════════════════════════════
   MAGNETIC BUTTONS — subtle magnetic pull on hover
══════════════════════════════════════════════ */
(function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   PARALLAX SECTIONS — subtle depth on scroll
══════════════════════════════════════════════ */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroContent = hero.querySelector('h1');
  const heroBadge = hero.querySelector('.hero-badge');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroBottom = hero.offsetTop + hero.offsetHeight;

        if (scrollY < heroBottom) {
          const factor = scrollY * 0.3;
          if (heroContent) {
            heroContent.style.transform = `translateY(${factor * 0.15}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrollY / (heroBottom * 0.6));
          }
          if (heroBadge) {
            heroBadge.style.transform = `translateY(${factor * -0.1}px)`;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════════
   ENHANCED SCROLL REVEAL — with stagger for grids
══════════════════════════════════════════════ */
(function initEnhancedReveal() {
  const grids = document.querySelectorAll('.features-grid, .mqtt-grid, .broker-grid, .payload-grid, .access-cards, .fiksi-badges, .comp-badges');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(30px)';
          child.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              child.style.opacity = '1';
              child.style.transform = 'none';
            });
          });
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  grids.forEach(g => observer.observe(g));
})();


/* ══════════════════════════════════════════════
   GLITCH REVEAL — enhanced for about section
══════════════════════════════════════════════ */
(function initGlitchReveal() {
  const els = document.querySelectorAll('.glitch-reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   TILT CARDS — 3D perspective tilt on hover
══════════════════════════════════════════════ */
(function initTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  const cards = document.querySelectorAll('.feature-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ══════════════════════════════════════════════
   NAV SCROLL EFFECT — glass effect intensifies on scroll
══════════════════════════════════════════════ */
(function initNavScrollEffect() {
  const nav = document.querySelector('nav.site-nav');
  if (!nav) return;

  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > 50) {
          nav.style.background = 'rgba(7, 10, 15, 0.95)';
          nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
          nav.style.backdropFilter = 'blur(20px)';
        } else {
          nav.style.background = 'rgba(7, 10, 15, 0.88)';
          nav.style.boxShadow = 'none';
          nav.style.backdropFilter = 'blur(14px)';
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ══════════════════════════════════════════════
   TYPED EFFECT — for hero subtitle
══════════════════════════════════════════════ */
(function initTypedEffect() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  // Add a subtle pulse to the live dot
  const dot = badge.querySelector('.dot-live');
  if (dot) {
    dot.style.animation = 'dotPulse 2s ease-in-out infinite';
  }
})();


/* ══════════════════════════════════════════════
   SMOOTH COUNTER — enhanced counting animation
══════════════════════════════════════════════ */
(function enhanceCounters() {
  // Add a visual "glow flash" when counters finish
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => {
          el.style.textShadow = '0 0 20px rgba(245, 158, 11, 0.8)';
          setTimeout(() => {
            el.style.textShadow = '';
            el.style.transition = 'text-shadow 0.5s ease';
          }, 300);
        }, 1500); // after counter animation finishes
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();
