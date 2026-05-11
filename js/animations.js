/**
 * animations.js — Eye-catching animations: particles, cursor trail,
 *                 parallax scrolling, magnetic buttons, tilt cards.
 * OpenRelay · FIKSI 2026
 * 
 * IMPROVEMENTS:
 *  - Refactored to be idempotent & re-initializable for streamed sections.
 *  - Added 3D glare effect to tilt cards.
 *  - Enhanced cursor trail with smooth spring physics.
 */

'use strict';

window.OR = window.OR || {};

/* ══════════════════════════════════════════════
   PARTICLE FIELD
   Exposed: window.OR.initParticles()
══════════════════════════════════════════════ */
window.OR.initParticles = function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.querySelector('.particle-field')) return; // already exists

  const field = document.createElement('div');
  field.className = 'particle-field';
  field.setAttribute('aria-hidden', 'true');
  document.body.appendChild(field);

  const PARTICLE_COUNT = 30;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = 1 + Math.random() * 3;
    const left = Math.random() * 100;
    const duration = 15 + Math.random() * 25;
    const delay = Math.random() * duration;
    const hue = Math.random() > 0.8 ? '152, 87%' : '38, 95%'; // green or amber
    const lightness = 60 + Math.random() * 20;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: hsl(${hue}, ${lightness}%);
      box-shadow: 0 0 10px hsla(${hue}, ${lightness}%, 0.4);
      animation: particleFloat ${duration}s linear -${delay}s infinite;
    `;

    field.appendChild(p);
  }
};


/* ══════════════════════════════════════════════
   AURORA GLOW
   Exposed: window.OR.initAurora()
══════════════════════════════════════════════ */
window.OR.initAurora = function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.querySelector('.aurora-glow')) return;

  const aurora = document.createElement('div');
  aurora.className = 'aurora-glow';
  aurora.setAttribute('aria-hidden', 'true');
  document.body.prepend(aurora);
};


/* ══════════════════════════════════════════════
   CURSOR TRAIL
   Exposed: window.OR.initCursorTrail()
══════════════════════════════════════════════ */
window.OR.initCursorTrail = function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;
  if (document.querySelector('.cursor-dot')) return;

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
    // Smooth follow with spring-like easing
    dotX += (mouseX - dotX) * 0.12;
    dotY += (mouseY - dotY) * 0.12;
    dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
    requestAnimationFrame(animate);
  }
  animate();
};


/* ══════════════════════════════════════════════
   MAGNETIC ELEMENTS
   Exposed: window.OR.initMagnetic(scope)
══════════════════════════════════════════════ */
window.OR.initMagnetic = function(scope = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  const targets = scope.querySelectorAll('.btn-primary, .btn-outline, .nav-cta, .nav-links a');
  
  targets.forEach(el => {
    if (el.dataset.magneticInit) return;
    el.dataset.magneticInit = '1';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });
};


/* ══════════════════════════════════════════════
   TILT CARDS — with glare effect
   Exposed: window.OR.initTilt(scope)
══════════════════════════════════════════════ */
window.OR.initTilt = function(scope = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return;

  const cards = scope.querySelectorAll('.feature-card, .team-card, .spec-card, .access-card, .broker-card, .mqtt-card');

  cards.forEach(card => {
    if (card.dataset.tiltInit) return;
    card.dataset.tiltInit = '1';

    // Add glare element
    const glare = document.createElement('div');
    glare.className = 'card-glare';
    glare.style.cssText = `
      position: absolute; inset: 0; pointer-events: none; opacity: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 70%);
      transition: opacity 0.4s ease; z-index: 10;
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(glare);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = (y - 0.5) * -12;
      const tiltY = (x - 0.5) * 12;
      
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
      card.style.transition = 'none';

      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.15), transparent 70%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
      glare.style.opacity = '0';
    });
  });
};


/* ══════════════════════════════════════════════
   PARALLAX SCROLLING
══════════════════════════════════════════════ */
window.OR.initParallax = function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroContent = hero.querySelector('h1');
  const heroBadge = hero.querySelector('.hero-badge');
  const heroSub = hero.querySelector('.hero-sub');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = hero.offsetHeight;

        if (y < h + 100) {
          if (heroContent) {
            heroContent.style.transform = `translateY(${y * 0.2}px)`;
            heroContent.style.opacity = Math.max(0, 1 - y / (h * 0.7));
          }
          if (heroSub) {
            heroSub.style.transform = `translateY(${y * 0.1}px)`;
            heroSub.style.opacity = Math.max(0, 1 - y / (h * 0.8));
          }
          if (heroBadge) {
            heroBadge.style.transform = `translateY(${y * -0.15}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
};


/* ══════════════════════════════════════════════
   REVEAL STAGGER
   Exposed: window.OR.initStagger(scope)
══════════════════════════════════════════════ */
window.OR.initStagger = function(scope = document) {
  const grids = scope.querySelectorAll('.features-grid, .mqtt-grid, .broker-grid, .access-cards, .fiksi-badges, .comp-badges, .about-highlights, .payload-grid');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(25px)';
          child.style.transition = `opacity 0.7s ease ${i * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  grids.forEach(g => observer.observe(g));
};


/* ══════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  window.OR.initParticles();
  window.OR.initAurora();
  window.OR.initCursorTrail();
  window.OR.initMagnetic();
  window.OR.initTilt();
  window.OR.initParallax();
  window.OR.initStagger();
});
