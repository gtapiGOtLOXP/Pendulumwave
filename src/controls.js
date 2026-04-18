/**
 * controls.js
 * Binds UI controls (sliders, buttons) to the simulation state.
 */

const Controls = (() => {
  function init(state, onStateChange) {

    // ── Sliders ────────────────────────────────────
    const nPendSlider = document.getElementById('nPend');
    const speedSlider = document.getElementById('speed');
    const ampSlider   = document.getElementById('amp');

    nPendSlider.addEventListener('input', () => {
      state.n = parseInt(nPendSlider.value, 10);
      document.getElementById('nPendVal').textContent = state.n;
      Renderer.resetTrails(state.n);
      onStateChange('n');
    });

    speedSlider.addEventListener('input', () => {
      state.speedMult = parseFloat(speedSlider.value);
      document.getElementById('speedVal').textContent = state.speedMult.toFixed(1) + '×';
      onStateChange('speed');
    });

    ampSlider.addEventListener('input', () => {
      state.ampRad = (parseInt(ampSlider.value, 10) * Math.PI) / 180;
      document.getElementById('ampVal').textContent = parseInt(ampSlider.value, 10) + '°';
      onStateChange('amp');
    });

    // ── Buttons ────────────────────────────────────
    const btnPlay   = document.getElementById('btnPlay');
    const btnReset  = document.getElementById('btnReset');
    const btnTrails = document.getElementById('btnTrails');
    const btnGrid   = document.getElementById('btnGrid');

    btnPlay.addEventListener('click', () => {
      state.running = !state.running;
      btnPlay.textContent = state.running ? 'Pause' : 'Play';
      btnPlay.classList.toggle('active', state.running);
      onStateChange('running');
    });

    btnReset.addEventListener('click', () => {
      state.t = 0;
      Renderer.resetTrails(state.n);
      onStateChange('reset');
    });

    btnTrails.addEventListener('click', () => {
      state.showTrails = !state.showTrails;
      btnTrails.textContent = state.showTrails ? 'Trails' : 'Trails';
      btnTrails.classList.toggle('active', state.showTrails);
      if (!state.showTrails) Renderer.resetTrails(state.n);
      onStateChange('trails');
    });

    btnGrid.addEventListener('click', () => {
      state.showGrid = !state.showGrid;
      btnGrid.classList.toggle('active', state.showGrid);
      onStateChange('grid');
    });

    // ── Keyboard shortcuts ─────────────────────────
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          btnPlay.click();
          break;
        case 'r':
        case 'R':
          btnReset.click();
          break;
        case 't':
        case 'T':
          btnTrails.click();
          break;
        case 'g':
        case 'G':
          btnGrid.click();
          break;
        case 'ArrowUp':
          speedSlider.value = Math.min(3, parseFloat(speedSlider.value) + 0.2).toFixed(1);
          speedSlider.dispatchEvent(new Event('input'));
          break;
        case 'ArrowDown':
          speedSlider.value = Math.max(0.2, parseFloat(speedSlider.value) - 0.2).toFixed(1);
          speedSlider.dispatchEvent(new Event('input'));
          break;
      }
    });

    // ── Resize ─────────────────────────────────────
    window.addEventListener('resize', () => {
      Renderer.resize();
      Renderer.resetTrails(state.n);
    });
  }

  return { init };
})();
