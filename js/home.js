// Relay dot animator for Home page
// Animates dots representing relay states - matching reference design

function animateRelayDots() {
  const visualizer = document.getElementById("relay-vis");
  if (!visualizer) return;

  // Clear the visualizer
  visualizer.innerHTML = "";

  // Create 64 dots (matching reference)
  for (let i = 0; i < 64; i++) {
    const d = document.createElement("div");
    d.className = "relay-dot";
    visualizer.appendChild(d);
  }

  // Animation loop
  function animate() {
    const t = Date.now();
    const dots = visualizer.querySelectorAll(".relay-dot");
    dots.forEach((dot, i) => {
      const wave = Math.sin(t * 0.001 + i * 0.4);
      const on = wave > 0.3;
      const green = wave > 0.7;
      dot.className = "relay-dot" + (on ? (green ? " green" : " on") : "");
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Initialize when page loads
window.addEventListener("load", function() {
  animateRelayDots();
});