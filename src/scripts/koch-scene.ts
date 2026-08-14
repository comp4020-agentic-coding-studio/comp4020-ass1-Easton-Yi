// Interaction controller for Act 2 (docs/PROJECT_BRIEF.md): maps native page
// scroll to the Koch construction. Geometry is cached once per iteration and
// only swapped at thresholds; only a wrapper transform changes continuously.
// See docs/CONTENT_SOURCES.md ("Should wheel events be captured directly?")
// for why this uses the document scroll event rather than wheel capture.
import {
  generateKochPoints,
  getCoveringMeasure,
  getKochMetrics,
  kochPathD,
  MAX_ITERATION,
} from "../lib/koch.ts";
import { computeProgress, iterationForProgress } from "../lib/scrollState.ts";

// Narrative stages (revealCopy in index.astro) are fewer than iterations —
// clamp to the last stage once the construction keeps refining past it.
const MAX_NARRATIVE_STAGE = 4;

const scene = document.querySelector<HTMLElement>("#koch-scene");

if (scene) {
  const sticky = scene.querySelector<HTMLElement>(".koch-sticky");
  const wrapper = scene.querySelector<SVGGElement>("#koch-wrapper");
  const path = scene.querySelector<SVGPathElement>("#koch-path");
  const insetPath = scene.querySelector<SVGPathElement>("#koch-inset-path");
  const revealItems = Array.from(scene.querySelectorAll<HTMLElement>("[data-stage]"));
  const stat = {
    iteration: scene.querySelector<HTMLElement>("#stat-iteration"),
    segments: scene.querySelector<HTMLElement>("#stat-segments"),
    scale: scene.querySelector<HTMLElement>("#stat-scale"),
    m1: scene.querySelector<HTMLElement>("#stat-m1"),
  };

  // Generate/cache every path once (docs/PROJECT_BRIEF.md "Koch renderer") —
  // never regenerated on scroll.
  const pathCache = Array.from({ length: MAX_ITERATION + 1 }, (_, n) => kochPathD(generateKochPoints(n)));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let currentIteration = -1;
  let revealStage = -1;

  function applyIteration(n: number): void {
    if (n === currentIteration) return;
    currentIteration = n;
    if (path) path.setAttribute("d", pathCache[n]);
    if (insetPath) insetPath.setAttribute("d", pathCache[n]);

    const metrics = getKochMetrics(n);
    const m1 = getCoveringMeasure(n, 1);

    scene!.dataset.iteration = String(n);
    if (stat.iteration) stat.iteration.textContent = String(n);
    if (stat.segments) stat.segments.textContent = String(metrics.segmentCount);
    if (stat.scale) stat.scale.textContent = metrics.coverScale.toFixed(6);
    if (stat.m1) stat.m1.textContent = m1.toFixed(4);
  }

  // Tracks the current scroll position directly (not monotonic) so scrolling
  // back up restores the narrative text for that earlier stage, with the
  // next stage dimmed as a "previous" glance-back — mirroring how iteration
  // itself already reverses on scroll-up.
  function applyReveal(stage: number): void {
    if (stage === revealStage) return;
    revealStage = stage;
    scene!.dataset.revealStage = String(revealStage);
    for (const item of revealItems) {
      const itemStage = Number(item.dataset.stage);
      item.classList.toggle("revealed", itemStage === revealStage);
      item.classList.toggle("previous", itemStage === revealStage - 1 || itemStage === revealStage + 1);
    }
  }

  function update(): void {
    const rect = scene!.getBoundingClientRect();
    const progress = computeProgress({
      sectionTop: rect.top + window.scrollY,
      sectionHeight: scene!.offsetHeight,
      viewportHeight: window.innerHeight,
      scrollY: window.scrollY,
    });
    const iteration = iterationForProgress(progress);
    applyIteration(iteration);
    applyReveal(Math.min(iteration, MAX_NARRATIVE_STAGE));

    if (wrapper) {
      // Zoom is capped responsively via --camera-zoom-max (set in CSS, ~1.4
      // on mobile / ~1.75 on desktop) so the full snowflake bounding box
      // never exceeds the SVG viewBox and gets clipped to a fragment.
      const zoomMax = Number(getComputedStyle(wrapper).getPropertyValue("--camera-zoom-max")) || 1.4;
      const scale = reduceMotion.matches ? 1 : 1 + progress * (zoomMax - 1);
      wrapper.style.setProperty("--camera-scale", String(scale));
    }

    if (sticky && !reduceMotion.matches) {
      // Blend the sticky field toward Act 1's sky / Act 3's mist within the
      // first and last 10% of progress, full fjord-deep in the middle.
      const edge = 0.1;
      const blend = Math.min(progress / edge, (1 - progress) / edge, 1);
      sticky.style.setProperty("--scene-blend", String(Math.max(0, blend)));
    }
  }

  let ticking = false;
  function onScrollOrResize(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  update();
}
