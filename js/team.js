/**
 * team.js — Team card effects, timeline reveal,
 *            FIKSI badge interactions, skill tag hover
 * OpenRelay · FIKSI 2026
 */

'use strict';

/* ══════════════════════════════════════════════
   TEAM CARDS — avatar ring pulse on hover,
   skill tag stagger reveal
══════════════════════════════════════════════ */
(function initTeamCards() {
  document.querySelectorAll('.team-card').forEach(card => {
    const ring   = card.querySelector('.team-avatar-ring');
    const skills = card.querySelectorAll('.skill-tag');

    // Accelerate ring pulse on hover
    card.addEventListener('mouseenter', () => {
      if (ring) ring.style.animationDuration = '1s';
      // Stagger skill tags highlight
      skills.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.background   = 'var(--amber-dim)';
          tag.style.borderColor  = 'var(--border2)';
          tag.style.color        = 'var(--amber)';
          tag.style.transition   = 'all 0.2s';
        }, i * 60);
      });
    });

    card.addEventListener('mouseleave', () => {
      if (ring) ring.style.animationDuration = '';
      skills.forEach(tag => {
        tag.style.background  = '';
        tag.style.borderColor = '';
        tag.style.color       = '';
      });
    });
  });
})();


/* ══════════════════════════════════════════════
   TIMELINE — animate items in sequence
   when they scroll into view
══════════════════════════════════════════════ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const dot  = item.querySelector('.timeline-dot');
      const idx  = Array.from(items).indexOf(item);

      // Stagger each item by its position
      setTimeout(() => {
        item.style.opacity   = '1';
        item.style.transform = 'none';

        // Pulse the dot when it appears
        if (dot) {
          dot.style.transform  = 'scale(1.4)';
          dot.style.transition = 'transform 0.3s ease';
          setTimeout(() => { dot.style.transform = ''; }, 300);
        }
      }, idx * 140);

      observer.unobserve(item);
    });
  }, { threshold: 0.2 });

  // Set initial hidden state
  items.forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-12px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });
})();


/* ══════════════════════════════════════════════
   FIKSI BADGES — hover lift + glow
══════════════════════════════════════════════ */
(function initFiksiBadges() {
  document.querySelectorAll('.fiksi-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform  = 'translateY(-2px)';
      badge.style.boxShadow  = '0 6px 24px rgba(245,158,11,0.12)';
      badge.style.borderColor= 'var(--border3)';
      badge.style.transition = 'all 0.2s ease';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform  = '';
      badge.style.boxShadow  = '';
      badge.style.borderColor= '';
    });
  });
})();


/* ══════════════════════════════════════════════
   SCHOOL CARD — typewriter effect on the school name
══════════════════════════════════════════════ */
(function initSchoolTypewriter() {
  const nameEl = document.querySelector('.school-name');
  if (!nameEl) return;

  const fullText = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.borderRight = '2px solid var(--amber)';

  let i = 0;

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();

    const interval = setInterval(() => {
      nameEl.textContent = fullText.slice(0, i + 1);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        // Remove cursor after typing
        setTimeout(() => {
          nameEl.style.borderRight = 'none';
        }, 800);
      }
    }, 48);
  }, { threshold: 0.5 });

  observer.observe(nameEl);
})();


/* ══════════════════════════════════════════════
   SKILL TAGS — individual hover color per tag
══════════════════════════════════════════════ */
(function initSkillTags() {
  const palette = [
    { bg: 'var(--amber-dim)',  border: 'var(--border2)', color: 'var(--amber)' },
    { bg: 'var(--green-dim)',  border: 'rgba(34,197,94,0.25)', color: 'var(--green)' },
    { bg: 'var(--blue-dim)',   border: 'rgba(56,189,248,0.25)', color: 'var(--blue)' },
  ];

  document.querySelectorAll('.skill-tag').forEach((tag, i) => {
    const p = palette[i % palette.length];
    tag.addEventListener('mouseenter', () => {
      tag.style.background   = p.bg;
      tag.style.borderColor  = p.border;
      tag.style.color        = p.color;
      tag.style.transition   = 'all 0.18s';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.background  = '';
      tag.style.borderColor = '';
      tag.style.color       = '';
    });
  });
})();
