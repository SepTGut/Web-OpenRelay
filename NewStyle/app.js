console.log('OpenRelay NewStyle loaded');

const cards = document.querySelectorAll('.glass-card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(245,158,11,0.14), rgba(255,255,255,0.04))`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = 'rgba(255,255,255,0.04)';
  });
});