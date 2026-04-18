/**
 * main.js
 * Entry point — wires together Physics, Renderer, and Controls.
 * Owns the simulation state and the rAF loop.
 */

const state = {
  n:          15,
  t:          0,
  speedMult:  1.0,
  ampRad:     36 * Math.PI / 180,
  running:    true,
  showTrails: true,
  showGrid:   false,
};

let lastTimestamp = null;

// ── Initialise ────────────────────────────────────
const canvas = document.getElementById('pendulum-canvas');
Renderer.init(canvas);
Renderer.resetTrails(state.n);

Controls.init(state, (changed) => {
  if (changed === 'reset') lastTimestamp = null;
  if (!state.running) Renderer.draw(state);
});

// ── Animation loop ────────────────────────────────
function loop(ts) {
  if (state.running) {
    if (lastTimestamp !== null) {
      const dt = Math.min((ts - lastTimestamp) / 1000, 0.05); // cap at 50ms
      state.t += dt * state.speedMult;
    }
    lastTimestamp = ts;

    Renderer.draw(state);

    // Update phase badge
    const pct = Math.round(Physics.cycleProgress(state.t) * 100);
    document.getElementById('phase-value').textContent = pct + '%';
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
