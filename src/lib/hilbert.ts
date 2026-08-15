// Hilbert curve geometry for the faint decorative background behind the
// "curves that nearly fill the plane" aside (docs/Refine_Explanations.md).
// Purely illustrative — a fixed order, not a second user-facing control
// (CLAUDE.md "Explicit exclusions": no extra parameter controls).

export interface Point {
  x: number;
  y: number;
}

const ORDER = 4;

/** Rotate/reflect the quadrant so the recursive curve joins up correctly. */
function rotate(n: number, p: Point, rx: number, ry: number): Point {
  if (ry !== 0) return p;
  let { x, y } = p;
  if (rx === 1) {
    x = n - 1 - x;
    y = n - 1 - y;
  }
  return { x: y, y: x };
}

/** Map a distance along the curve to its (x, y) grid cell (standard d2xy). */
function d2xy(order: number, d: number): Point {
  let point: Point = { x: 0, y: 0 };
  const n = 2 ** order;
  let t = d;
  for (let s = 1; s < n; s *= 2) {
    const rx = 1 & Math.floor(t / 2);
    const ry = 1 & (t ^ rx);
    point = rotate(s, point, rx, ry);
    point = { x: point.x + s * rx, y: point.y + s * ry };
    t = Math.floor(t / 4);
  }
  return point;
}

/** The order-4 Hilbert curve's grid points, normalised into [0, 1] x [0, 1]. */
export function generateHilbertPoints(): Point[] {
  const n = 2 ** ORDER;
  const total = n * n;
  const points: Point[] = [];
  for (let d = 0; d < total; d++) {
    const { x, y } = d2xy(ORDER, d);
    points.push({ x: (x + 0.5) / n, y: (y + 0.5) / n });
  }
  return points;
}

/** Serialise points into a single open SVG path `d` string. */
export function hilbertPathD(points: Point[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const move = `M ${first.x} ${first.y}`;
  const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
  return `${move} ${lines}`;
}
