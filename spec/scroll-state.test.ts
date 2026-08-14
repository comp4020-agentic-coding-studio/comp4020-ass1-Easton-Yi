import { describe, expect, it } from "vitest";
import { MAX_ITERATION } from "../src/lib/koch.ts";
import { computeProgress, iterationForProgress } from "../src/lib/scrollState.ts";

// Acceptance tests 3, 9, 10 from docs/PROJECT_BRIEF.md: forward scroll raises
// data-iteration, reverse scroll lowers it and restores the matching
// narrative stage (data-reveal-stage), and resizing mid-interaction preserves
// the logical iteration.

describe("computeProgress", () => {
  const base = { sectionTop: 1000, sectionHeight: 4000, viewportHeight: 800 };

  it("is 0 before the section starts and 1 after it ends", () => {
    expect(computeProgress({ ...base, scrollY: 0 })).toBe(0);
    expect(computeProgress({ ...base, scrollY: 1000 })).toBe(0);
    expect(computeProgress({ ...base, scrollY: 1000 + (4000 - 800) })).toBe(1);
    expect(computeProgress({ ...base, scrollY: 999_999 })).toBe(1);
  });

  it("increases monotonically with scrollY", () => {
    let previous = -1;
    for (let scrollY = base.sectionTop; scrollY <= base.sectionTop + 3200; scrollY += 320) {
      const progress = computeProgress({ ...base, scrollY });
      expect(progress).toBeGreaterThanOrEqual(previous);
      previous = progress;
    }
  });

  it("stays close to the same value when viewportHeight changes slightly at fixed scrollY (resize mid-interaction)", () => {
    const scrollY = base.sectionTop + 2800; // deep into the section
    const before = computeProgress({ ...base, scrollY });
    const afterResize = computeProgress({ ...base, viewportHeight: 700, scrollY });
    expect(Math.abs(afterResize - before)).toBeLessThan(0.05);
  });
});

describe("iterationForProgress", () => {
  it("starts at iteration 0 and reaches MAX_ITERATION", () => {
    expect(iterationForProgress(0)).toBe(0);
    expect(iterationForProgress(1)).toBe(MAX_ITERATION);
  });

  it("is monotonically non-decreasing as progress increases (forward scroll only advances)", () => {
    let previous = -1;
    for (let p = 0; p <= 1; p += 0.01) {
      const iteration = iterationForProgress(p);
      expect(iteration).toBeGreaterThanOrEqual(previous);
      previous = iteration;
    }
  });

  it("is reversible: the same progress always yields the same iteration (scroll back and forth)", () => {
    for (const p of [0.05, 0.3, 0.55, 0.8, 0.99]) {
      expect(iterationForProgress(p)).toBe(iterationForProgress(p));
    }
    const forward = iterationForProgress(0.7);
    const backward = iterationForProgress(0.3);
    expect(backward).toBeLessThan(forward);
  });

  it("preserves iteration across a resize when progress barely moves (acceptance test 10, iteration >= 3)", () => {
    const base = { sectionTop: 1000, sectionHeight: 4000, viewportHeight: 800 };
    const scrollY = base.sectionTop + 2800;
    const before = iterationForProgress(computeProgress({ ...base, scrollY }));
    const after = iterationForProgress(computeProgress({ ...base, viewportHeight: 700, scrollY }));
    expect(before).toBeGreaterThanOrEqual(3);
    expect(after).toBe(before);
  });
});
