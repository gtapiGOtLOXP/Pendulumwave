/**
 * renderer.js
 * Handles all canvas drawing: pivot rail, strings, bobs, trails, and grid.
 */

const Renderer = (() => {
  const COLORS = [
    '#a78bfa','#818cf8','#60a5fa','#34d399','#facc15',
    '#fb923c','#f87171','#e879f9','#2dd4bf','#38bdf8',
    '#a3e635','#fbbf24','#c084fc','#67e8f9','#86efac',
    '#fca5a5','#93c5fd','#6ee7b7','#fde68a','#d8b4fe',
  ];

  const TRAIL_LENGTH = 55;
  const PIVOT_Y_RATIO = 0.09;    // pivot rail as fraction of canvas height
  const BOB_RADIUS_BASE = 8;

  let canvas, ctx;
  let trails = [];

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
  }

  function resize() {
    const wrapper = canvas.parentElement;
    const w = wrapper.clientWidth;
    const h = Math.round(w * 0.62);   // 16:10-ish aspect ratio
    canvas.width = w;
    canvas.height = h;
  }

  function resetTrails(n) {
    trails = Array.from({ length: n }, () => []);
  }

  /**
   * Computes the canvas (x, y) position of a bob.
   * @param {number} i      - pendulum index
   * @param {number} n      - total pendulums
   * @param {number} theta  - current angle (radians)
   * @param {number} maxLen - physical length of longest pendulum (metres)
   */
  function bobPosition(i, n, theta, maxLen) {
    const W = canvas.width, H = canvas.height;
    const pivY = H * PIVOT_Y_RATIO;
    const availH = H - pivY - 30;

    const physLen = Physics.length(i, n);
    const scaledLen = (physLen / maxLen) * availH;

    const pivX = ((i + 0.5) / n) * W;
    const bx = pivX + scaledLen * Math.sin(theta);
    const by = pivY + scaledLen * Math.cos(theta);

    return { x: bx, y: by, pivX, pivY };
  }

  /**
   * Main draw call — renders a full frame.
   *
   * @param {object} state - simulation state from main.js
   */
  function draw(state) {
    const { n, t, ampRad, showTrails, showGrid } = state;
    const W = canvas.width, H = canvas.height;
    const pivY = H * PIVOT_Y_RATIO;

    ctx.clearRect(0, 0, W, H);

    if (showGrid) drawGrid(W, H);

    // Pivot rail
    ctx.beginPath();
    ctx.moveTo(16, pivY);
    ctx.lineTo(W - 16, pivY);
    ctx.strokeStyle = '#2d2b3d';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Find max physical length for scaling
    const maxLen = Physics.length(0, n); // index 0 = slowest = longest

    for (let i = 0; i < n; i++) {
      const theta = Physics.angle(i, n, t, ampRad);
      const pos = bobPosition(i, n, theta, maxLen);
      const color = COLORS[i % COLORS.length];

      // Trails
      if (showTrails && trails[i]) {
        const tl = trails[i];
        if (tl.length > 1) {
          ctx.beginPath();
          ctx.moveTo(tl[0].x, tl[0].y);
          for (let j = 1; j < tl.length; j++) {
            ctx.lineTo(tl[j].x, tl[j].y);
          }
          ctx.strokeStyle = color + '44';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        tl.push({ x: pos.x, y: pos.y });
        if (tl.length > TRAIL_LENGTH) tl.shift();
      }

      // String
      ctx.beginPath();
      ctx.moveTo(pos.pivX, pos.pivY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#38364e';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Bob
      const r = Math.max(3.5, BOB_RADIUS_BASE - n * 0.22);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Pivot pin
      ctx.beginPath();
      ctx.arc(pos.pivX, pivY, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#4a4768';
      ctx.fill();
    }
  }

  function drawGrid(W, H) {
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function getTrails() { return trails; }

  return { init, resize, resetTrails, draw, getTrails, COLORS };
})();
