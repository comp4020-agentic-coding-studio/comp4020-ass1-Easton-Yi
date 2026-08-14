// Deterministic Koch snowflake geometry and the exact scale/covering
// measures described in docs/PROJECT_BRIEF.md and docs/CONTENT_SOURCES.md.
//
// Convention: the snowflake starts from an equilateral triangle of side
// length 1 (docs/CONTENT_SOURCES.md, "Verified mathematical facts"). Each
// replacement step turns one segment into four segments each 1/3 the length,
// bowing outward. Iterations are cached by the caller — this module is pure
// and has no DOM/animation concerns.

export interface Point {
  x: number;
  y: number;
}

export const MAX_ITERATION = 5;

/** log(4)/log(3), the Koch curve's similarity (and Hausdorff) dimension. */
export const HAUSDORFF_DIMENSION = Math.log(4) / Math.log(3);

/**
 * Replace segment p0->p1 with the four-segment Koch motif, appending the
 * three new interior vertices (not p1, so callers can chain segments into a
 * closed loop without duplicating shared vertices).
 */
function kochReplace(p0: Point, p1: Point, out: Point[]): void {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;

  const a: Point = { x: p0.x + dx / 3, y: p0.y + dy / 3 };
  const b: Point = { x: p0.x + (2 * dx) / 3, y: p0.y + (2 * dy) / 3 };

  // Peak of the equilateral bump on segment a->b, rotated outward (clockwise
  // screen coordinates, sign chosen so enclosed area grows toward 8/5 A0 —
  // see spec/koch.test.ts, which checks area against the closed form).
  const bax = b.x - a.x;
  const bay = b.y - a.y;
  const cos60 = 0.5;
  const sin60 = Math.sqrt(3) / 2;
  const peak: Point = {
    x: a.x + bax * cos60 - bay * sin60,
    y: a.y + bax * sin60 + bay * cos60,
  };

  out.push(a, peak, b);
}

/**
 * The closed Koch snowflake boundary at a given iteration, as an ordered
 * list of points (first point is not repeated at the end). Starts from an
 * equilateral triangle centred near the origin with side length 1.
 */
export function generateKochPoints(iteration: number): Point[] {
  if (!Number.isInteger(iteration) || iteration < 0 || iteration > MAX_ITERATION) {
    throw new RangeError(`iteration must be an integer in [0, ${MAX_ITERATION}]`);
  }

  const side = 1;
  const height = (side * Math.sqrt(3)) / 2;
  let points: Point[] = [
    { x: -side / 2, y: height / 3 },
    { x: side / 2, y: height / 3 },
    { x: 0, y: height / 3 - height },
  ];

  for (let step = 0; step < iteration; step++) {
    const next: Point[] = [];
    for (let i = 0; i < points.length; i++) {
      const p0 = points[i];
      const p1 = points[(i + 1) % points.length];
      next.push(p0);
      kochReplace(p0, p1, next);
    }
    points = next;
  }

  return points;
}

/** Serialise points into a single closed SVG path `d` string. */
export function kochPathD(points: Point[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const move = `M ${first.x} ${first.y}`;
  const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
  return `${move} ${lines} Z`;
}

export interface KochMetrics {
  iteration: number;
  /** Segment count N_n = 3 * 4^n. */
  segmentCount: number;
  /** Construction-aligned cover scale epsilon_n = 3^-n (segment length). */
  coverScale: number;
  /** Ordinary 1D perimeter P_n = 3 * (4/3)^n, for initial side length 1. */
  perimeter: number;
  /** Enclosed area A_n = (1/5)[8 - 3*(4/9)^n] * A0, A0 the seed triangle area. */
  enclosedArea: number;
}

function seedTriangleArea(): number {
  const side = 1;
  return (Math.sqrt(3) / 4) * side * side;
}

export function getKochMetrics(iteration: number): KochMetrics {
  if (!Number.isInteger(iteration) || iteration < 0) {
    throw new RangeError("iteration must be a non-negative integer");
  }
  const segmentCount = 3 * 4 ** iteration;
  const coverScale = 3 ** -iteration;
  const perimeter = 3 * (4 / 3) ** iteration;
  const a0 = seedTriangleArea();
  const enclosedArea = (1 / 5) * (8 - 3 * (4 / 9) ** iteration) * a0;
  return { iteration, segmentCount, coverScale, perimeter, enclosedArea };
}

/**
 * The construction-aligned covering sum M_s(n) = N_n * epsilon_n^s. This is
 * the intuitive covering sum for the canonical Koch cover, not the full
 * formal Hausdorff measure (which infimises over all sufficiently fine
 * covers) — see docs/CONTENT_SOURCES.md.
 */
export function getCoveringMeasure(iteration: number, exponent: number): number {
  if (!Number.isInteger(iteration) || iteration < 0) {
    throw new RangeError("iteration must be a non-negative integer");
  }
  const { segmentCount, coverScale } = getKochMetrics(iteration);
  return segmentCount * coverScale ** exponent;
}
