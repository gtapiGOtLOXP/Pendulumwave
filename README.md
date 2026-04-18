# Pendulum Wave | Synchronization Simulator

A physics-based interactive simulation of the Harvard pendulum wave experiment, built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step just open `index.html`.

!<img width="1398" height="814" alt="image" src="https://github.com/user-attachments/assets/6bf00c1e-c7ac-4735-9836-a754757ba8ca" />

## Demo

Open `index.html` in any modern browser, or host the folder on any static file server.

```bash
# Quick local server (Python)
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

## How it works

Each pendulum's length is calculated so it completes a precise integer number of oscillations within a fixed **cycle time** (60 simulated seconds). The longest pendulum completes 25 swings per cycle; the shortest completes 40. Because they start in phase but oscillate at slightly different frequencies, they drift apart — producing traveling waves, standing waves, and apparent chaos — before snapping back into perfect synchrony at the end of each cycle.

The length of pendulum *i* is derived from the simple pendulum period formula:

```
L = g · (T / 2π)²
```

where `T = CYCLE_TIME / swings_i` and `g = 9.81 m/s²`.

## Project Structure

```
pendulum-wave/
├── index.html          # Entry point — markup and script includes
├── src/
│   ├── physics.js      # Period / length / angle calculations
│   ├── renderer.js     # Canvas drawing (bobs, strings, trails, grid)
│   ├── controls.js     # UI bindings — sliders, buttons, keyboard shortcuts
│   └── style.css       # Dark-mode styles
├── assets/
│   └── favicon.svg     # SVG favicon
└── docs/
    └── screenshot.png  # (add your own)
```

## Controls

| Control | Description |
|---------|-------------|
| **Pendulums** slider | Number of pendulums (5–20) |
| **Speed** slider | Simulation speed multiplier (0.2×–3×) |
| **Amplitude** slider | Starting swing angle (10°–60°) |
| **Play / Pause** | Toggle animation |
| **Reset** | Restart from t = 0 |
| **Trails** | Toggle motion trails |
| **Grid** | Toggle background grid |

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `R` | Reset |
| `T` | Toggle trails |
| `G` | Toggle grid |
| `↑` / `↓` | Increase / decrease speed |

## Browser Support

All modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).  
Uses Canvas 2D API and `requestAnimationFrame` — no polyfills needed.

## License

MIT see [LICENSE](LICENSE).
