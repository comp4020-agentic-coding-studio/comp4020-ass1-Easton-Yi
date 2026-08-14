// Pure scroll -> state mapping for the Koch scene. No DOM access here so it
// can be unit tested directly; src/scripts/koch-scene.ts wires it to real
// scroll/resize events. See docs/PROJECT_BRIEF.md "Scroll implementation".

import { MAX_ITERATION } from "./koch.ts";

export interface ScrollGeometry {
  /** Absolute document-Y position of the sticky section's top edge. */
  sectionTop: number;
  /** Total height of the (tall) section, in px — the scroll distance that drives it. */
  sectionHeight: number;
  viewportHeight: number;
  scrollY: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Normalized progress through the pinned section, in [0, 1]. Depends only on
 * document geometry, not on any prior state — so re-deriving it after a
 * resize (same scrollY, same sectionTop, slightly different viewportHeight)
 * naturally reproduces the same iteration for a tall section, which is what
 * acceptance test 10 (resize mid-interaction) requires.
 */
export function computeProgress(geo: ScrollGeometry): number {
  const scrollable = geo.sectionHeight - geo.viewportHeight;
  if (scrollable <= 0) return 1;
  return clamp((geo.scrollY - geo.sectionTop) / scrollable, 0, 1);
}

/** Maps progress to a discrete iteration 0..maxIteration (thresholds, not a continuous value). */
export function iterationForProgress(progress: number, maxIteration = MAX_ITERATION): number {
  const buckets = maxIteration + 1;
  return clamp(Math.floor(clamp(progress, 0, 1) * buckets), 0, maxIteration);
}

/** maxRevealStage is monotonic: it only ever increases within a session. */
export function nextMaxRevealStage(previousMax: number, candidateStage: number): number {
  return Math.max(previousMax, candidateStage);
}
