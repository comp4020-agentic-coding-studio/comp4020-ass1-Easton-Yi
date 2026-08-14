import { describe, expect, it } from "vitest";
import {
  generateKochPoints,
  getCoveringMeasure,
  getKochMetrics,
  HAUSDORFF_DIMENSION,
  kochPathD,
  MAX_ITERATION,
} from "../src/lib/koch.ts";

// Exact math from docs/PROJECT_BRIEF.md and docs/CONTENT_SOURCES.md.
// Assignment-1 acceptance tests 4-8 (spec/Ass1_spec.md via
// docs/PROJECT_BRIEF.md "Acceptance tests"):
//   4. segment count equals 3 * 4^n
//   5. cover scale equals 3^-n
//   6. M_1(n) = 3 * (4/3)^n grows across iterations
//   7. M_2(n) = 3 * (4/9)^n shrinks across iterations
//   8. M_D(n), with D = log(4)/log(3), stays approximately 3

describe("Koch geometry", () => {
  it("generates a closed triangle at iteration 0", () => {
    const points = generateKochPoints(0);
    expect(points).toHaveLength(3);
  });

  it("quadruples segment count at each iteration up to the cache limit", () => {
    for (let n = 0; n <= MAX_ITERATION; n++) {
      const points = generateKochPoints(n);
      expect(points).toHaveLength(3 * 4 ** n);
    }
  });

  it("rejects iterations outside the cached range", () => {
    expect(() => generateKochPoints(-1)).toThrow();
    expect(() => generateKochPoints(MAX_ITERATION + 1)).toThrow();
  });

  it("produces a well-formed closed SVG path", () => {
    const d = kochPathD(generateKochPoints(2));
    expect(d.startsWith("M ")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    expect(d).toMatch(/^M -?\d/);
  });

  it("bows outward: enclosed area grows toward 8/5 of the seed triangle", () => {
    const a0 = getKochMetrics(0).enclosedArea;
    let previous = a0;
    for (let n = 1; n <= MAX_ITERATION; n++) {
      const { enclosedArea } = getKochMetrics(n);
      expect(enclosedArea).toBeGreaterThan(previous);
      expect(enclosedArea).toBeLessThan(1.6 * a0);
      previous = enclosedArea;
    }
  });
});

describe("Koch metrics (acceptance tests 4-5)", () => {
  it("segment count N_n = 3 * 4^n", () => {
    for (let n = 0; n <= MAX_ITERATION; n++) {
      expect(getKochMetrics(n).segmentCount).toBe(3 * 4 ** n);
    }
  });

  it("cover scale epsilon_n = 3^-n", () => {
    for (let n = 0; n <= MAX_ITERATION; n++) {
      expect(getKochMetrics(n).coverScale).toBeCloseTo(3 ** -n, 12);
    }
  });

  it("perimeter P_n = 3 * (4/3)^n diverges as n grows", () => {
    const perimeters = Array.from({ length: MAX_ITERATION + 1 }, (_, n) => getKochMetrics(n).perimeter);
    for (let n = 0; n <= MAX_ITERATION; n++) {
      expect(perimeters[n]).toBeCloseTo(3 * (4 / 3) ** n, 10);
    }
    for (let n = 1; n <= MAX_ITERATION; n++) {
      expect(perimeters[n]).toBeGreaterThan(perimeters[n - 1]);
    }
  });
});

describe("Covering measure M_s(n) = N_n * epsilon_n^s (acceptance tests 6-8)", () => {
  it("s = 1: M_1(n) grows without bound", () => {
    let previous = getCoveringMeasure(0, 1);
    for (let n = 1; n <= MAX_ITERATION; n++) {
      const value = getCoveringMeasure(n, 1);
      expect(value).toBeCloseTo(3 * (4 / 3) ** n, 10);
      expect(value).toBeGreaterThan(previous);
      previous = value;
    }
  });

  it("s = 2: M_2(n) shrinks toward zero", () => {
    let previous = getCoveringMeasure(0, 2);
    for (let n = 1; n <= MAX_ITERATION; n++) {
      const value = getCoveringMeasure(n, 2);
      expect(value).toBeCloseTo(3 * (4 / 9) ** n, 10);
      expect(value).toBeLessThan(previous);
      previous = value;
    }
  });

  it("s = D = log(4)/log(3): M_D(n) stays approximately 3 (stable)", () => {
    expect(HAUSDORFF_DIMENSION).toBeCloseTo(1.2618595, 6);
    for (let n = 0; n <= MAX_ITERATION; n++) {
      expect(getCoveringMeasure(n, HAUSDORFF_DIMENSION)).toBeCloseTo(3, 9);
    }
  });

  it("s=1 grows, s=D holds, s=2 shrinks — simultaneously, at the same iteration", () => {
    const n = 4;
    const nPlus1 = 5;
    expect(getCoveringMeasure(nPlus1, 1)).toBeGreaterThan(getCoveringMeasure(n, 1));
    expect(getCoveringMeasure(nPlus1, 2)).toBeLessThan(getCoveringMeasure(n, 2));
    expect(getCoveringMeasure(nPlus1, HAUSDORFF_DIMENSION)).toBeCloseTo(
      getCoveringMeasure(n, HAUSDORFF_DIMENSION),
      9,
    );
  });
});
