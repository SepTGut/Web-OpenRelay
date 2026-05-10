/**
 * team.js — Team card effects, timeline reveal,
 *            FIKSI badge interactions, skill tag hover
 * OpenRelay · FIKSI 2026
 *
 * BUGS FIXED:
 *  [+] School name stayed blank permanently if IntersectionObserver fired
 *      synchronously or not at all. Added a 2s fallback timeout.
 *  [+] Timeline items used inline style for opacity:0 — if element was already
 *      in viewport on load, transition had no start state and item just appeared.
 *      Now uses CSS class (.timeline-item / .revealed) for clean transitions.
 *      Add these rules to team.css (included as injected style for drop-in safety).
 */

'use strict';

/* ══════════════════════════════════════════════
   INJECT TIMELINE CSS — co-located with the JS
   that drives it. Safe to move to team.css.
══════════════════════════════════════════════ */
(function injectTimelineCSS() {
  if (document.getElementById('timeline-fix-style')) return;
  const s = document.createElement('style');
  s.id = 'timeline-fix-style';
  s.textContent = `
    .timeline-item {
      opacity: 0;
      transform: translateX(-12px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .timeline-item.revealed {
      opacity: 1;
      transform: none;
    }
  `;
  document.head.appendChild(s);
})();


/* ══════════════════════════════════════════════
   TEAM CARDS — avatar ring pulse on hover,
   skill tag stagger reveal
══════════════════════════════════════════════ */
(function initTeamCards() {
  document.querySelectorAll('.team-card').forEach(card => {
    const ring   = card.querySelector('.team-avatar-ring');
    const skills = card.querySelectorAll('.skill-tag');

    card.addEventListener('mouseenter', () => {
      if (ring) ring.style.animationDuration = '1s';
      skills.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.background  = 'var(--amber-dim)';
          tag.style.borderColor = 'var(--border2)';
          tag.style.color       = 'var(--amber)';
          tag.style.transition  = 'all 0.2s';
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
   FIX: use CSS class instead of inline style so the
   browser has a proper start state for transitions.
══════════════════════════════════════════════ */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // CSS class drives the hidden → visible transition (injected above).
  // No inline style needed here.

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const dot  = item.querySelector('.timeline-dot');
      const idx  = Array.from(items).indexOf(item);

      setTimeout(() => {
        item.classList.add('revealed');

        if (dot) {
          dot.style.transform  = 'scale(1.4)';
          dot.style.transition = 'transform 0.3s ease';
          setTimeout(() => { dot.style.transform = ''; }, 300);
        }
      }, idx * 140);

      observer.unobserve(item);
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
})();


/* ══════════════════════════════════════════════
   FIKSI BADGES — hover lift + glow
══════════════════════════════════════════════ */
(function initFiksiBadges() {
  document.querySelectorAll('.fiksi-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.transform   = 'translateY(-2px)';
      badge.style.boxShadow   = '0 6px 24px rgba(245,158,11,0.12)';
      badge.style.borderColor = 'var(--border3)';
      badge.style.transition  = 'all 0.2s ease';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform   = '';
      badge.style.boxShadow   = '';
      badge.style.borderColor = '';
    });
  });
})();


/* ══════════════════════════════════════════════
   SCHOOL CARD — typewriter effect on school name
   FIX: added 2s fallback timeout in case the
   IntersectionObserver never fires (element already
   in viewport, or threshold not met on short screens).
══════════════════════════════════════════════ */
(function initSchoolTypewriter() {
  const nameEl = document.querySelector('.school-name');
  if (!nameEl) return;

  const fullText = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.borderRight = '2px solid var(--amber)';

  let started = false;

  function startTypewriter() {
    if (started) return;
    started = true;
    clearTimeout(fallbackTimer);

    let i = 0;
    const interval = setInterval(() => {
      nameEl.textContent = fullText.slice(0, i + 1);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => { nameEl.style.borderRight = 'none'; }, 800);
      }
    }, 48);
  }

  // FIX: if the element is already in viewport or the observer never fires,
  // restore the full text after 2 seconds so the heading is never blank.
  const fallbackTimer = setTimeout(() => {
    if (!started) {
      nameEl.textContent       = fullText;
      nameEl.style.borderRight = 'none';
      started = true;
    }
  }, 2000);

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    startTypewriter();
  }, { threshold: 0.5 });

  observer.observe(nameEl);
})();


/* ══════════════════════════════════════════════
   SKILL TAGS — individual hover color per tag
══════════════════════════════════════════════ */
(function initSkillTags() {
  const palette = [
    { bg: 'var(--amber-dim)',  border: 'var(--border2)',              color: 'var(--amber)' },
    { bg: 'var(--green-dim)',  border: 'rgba(34,197,94,0.25)',        color: 'var(--green)' },
    { bg: 'var(--blue-dim)',   border: 'rgba(56,189,248,0.25)',       color: 'var(--blue)' },
  ];

  document.querySelectorAll('.skill-tag').forEach((tag, i) => {
    const p = palette[i % palette.length];
    tag.addEventListener('mouseenter', () => {
      tag.style.background  = p.bg;
      tag.style.borderColor = p.border;
      tag.style.color       = p.color;
      tag.style.transition  = 'all 0.18s';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.background  = '';
      tag.style.borderColor = '';
      tag.style.color       = '';
    });
  });
})();