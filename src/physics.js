/**
 * physics.js
 * Calculates pendulum lengths and periods for the wave synchronization effect.
 *
 * The Harvard pendulum wave:
 *   - N pendulums, each tuned to complete an integer number of swings per cycle.
 *   - Pendulum i completes (MIN_SWINGS + i * step) oscillations in CYCLE_TIME seconds.
 *   - Length derived from the simple pendulum period formula: L = g * (T / 2π)²
 */

const Physics = (() => {
  const G = 9.81;            // gravitational acceleration (m/s²)
  const CYCLE_TIME = 60;     // seconds of sim-time per full re-sync
  const MIN_SWINGS = 25;     // swings per cycle for the longest pendulum
  const MAX_SWINGS = 40;     // swings per cycle for the shortest pendulum

  /**
   * Returns the number of complete oscillations per cycle for pendulum index i.
   * @param {number} i     - pendulum index (0-based)
   * @param {number} total - total number of pendulums
   */
  function swingCount(i, total) {
    return MIN_SWINGS + (MAX_SWINGS - MIN_SWINGS) * (i / (total - 1));
  }

  /**
   * Returns the natural period (seconds) for pendulum i.
   * @param {number} i     - pendulum index
   * @param {number} total - total number of pendulums
   */
  function period(i, total) {
    return CYCLE_TIME / swingCount(i, total);
  }

  /**
   * Returns the physical length (metres) for pendulum i using L = g(T/2π)².
   * @param {number} i     - pendulum index
   * @param {number} total - total number of pendulums
   */
  function length(i, total) {
    const T = period(i, total);
    return G * Math.pow(T / (2 * Math.PI), 2);
  }

  /**
   * Returns the angular displacement (radians) of pendulum i at time t.
   * Uses the small-angle approximation: θ(t) = A · cos(2π t / T)
   *
   * @param {number} i        - pendulum index
   * @param {number} total    - total number of pendulums
   * @param {number} t        - current simulation time (seconds)
   * @param {number} ampRad   - amplitude in radians
   */
  function angle(i, total, t, ampRad) {
    const T = period(i, total);
    return ampRad * Math.cos((2 * Math.PI * t) / T);
  }

  /**
   * Returns the fraction (0–1) of progress through the current cycle.
   * @param {number} t - current simulation time (seconds)
   */
  function cycleProgress(t) {
    return (t % CYCLE_TIME) / CYCLE_TIME;
  }

  return { G, CYCLE_TIME, MIN_SWINGS, MAX_SWINGS, swingCount, period, length, angle, cycleProgress };
})();
