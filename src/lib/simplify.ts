// Douglas-Peucker polyline simplification, used at build time to derive
// coarser outlines from an existing real coastline path (see
// src/lib/coastline-samples.ts) — this does not invent new geography, it
// only discards points from data already used elsewhere on the page.

type Point = [number, number];

// Parses the "M x,y L x,y ... Z" format used by src/lib/britain.ts and
// src/lib/norway.ts.
export function parseCoastlinePath(d: string): Point[] {
  const tokens = d.trim().replace(/\s*Z\s*$/, "").split(/\s+/);
  const points: Point[] = [];
  for (const tok of tokens) {
    if (tok === "M" || tok === "L" || tok.length === 0) continue;
    const parts = tok.split(",");
    if (parts.length !== 2) continue;
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;
    points.push([x, y]);
  }
  return points;
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(x - x1, y - y1);
  const t = ((x - x1) * dx + (y - y1) * dy) / lengthSquared;
  const px = x1 + t * dx;
  const py = y1 + t * dy;
  return Math.hypot(x - px, y - py);
}

function douglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points.slice();
  let maxDistance = 0;
  let index = 0;
  const first = points[0];
  const last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], first, last);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }
  if (maxDistance > epsilon) {
    const left = douglasPeucker(points.slice(0, index + 1), epsilon);
    const right = douglasPeucker(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [first, last];
}

// Standard Douglas-Peucker assumes an open chain; a coastline ring closes
// back on itself, so split it into two chains at its widest pair of points
// first, simplify each half, then rejoin.
export function simplifyClosedPath(points: Point[], epsilon: number): Point[] {
  let farIndex = 0;
  let farDistance = 0;
  const [originX, originY] = points[0];
  for (let i = 1; i < points.length; i++) {
    const distance = Math.hypot(points[i][0] - originX, points[i][1] - originY);
    if (distance > farDistance) {
      farDistance = distance;
      farIndex = i;
    }
  }
  const firstHalf = points.slice(0, farIndex + 1);
  const secondHalf = points.slice(farIndex).concat([points[0]]);
  const simplifiedFirst = douglasPeucker(firstHalf, epsilon);
  const simplifiedSecond = douglasPeucker(secondHalf, epsilon);
  return simplifiedFirst.slice(0, -1).concat(simplifiedSecond);
}

export function pathFromPoints(points: Point[]): string {
  const coords = (p: Point) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const [first, ...rest] = points;
  return `M ${coords(first)} L ${rest.map(coords).join(" L ")} Z`;
}

// Open-chain Douglas-Peucker, exposed for callers (e.g. Norway's coastline
// subpaths) that aren't closed rings.
export function simplifyOpenPath(points: Point[], epsilon: number): Point[] {
  return douglasPeucker(points, epsilon);
}

// Parses the space-separated, multi-"M", no-"Z" format used by
// src/lib/norway.ts's coastline path: many disjoint open subpaths (mainland
// shoreline plus separate island fragments), each an implicit-lineto
// polyline after its own "M x y".
export function parseMultiPolyline(d: string): Point[][] {
  const subpaths = d.trim().split(/M\s*/).filter((part) => part.trim().length > 0);
  return subpaths.map((part) => {
    const numbers = part.trim().split(/\s+/).map(Number);
    const points: Point[] = [];
    for (let i = 0; i + 1 < numbers.length; i += 2) {
      points.push([numbers[i], numbers[i + 1]]);
    }
    return points;
  });
}

export function multiPolylineToPathD(subpaths: Point[][]): string {
  return subpaths
    .filter((points) => points.length > 0)
    .map((points) => `M ${points.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ")}`)
    .join(" ");
}
