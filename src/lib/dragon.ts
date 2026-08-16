// Postscript background motif: a Heighway dragon curve, drawn at increasing
// order as the visitor scrolls through the postscript (mirrors, in miniature,
// the Koch scene's own "more detail as you go further" idea). Fixed orders,
// no runtime/user controls — purely decorative, like the existing Hilbert-
// curve and Norway-coastline backgrounds elsewhere on the page.

export interface Point {
  x: number;
  y: number;
}

export const MAX_ITERATION = 12;

// Standard L-system turn sequence: L(n) = L(n-1) + [right] + reverse(-L(n-1)).
function generateTurns(order: number): number[] {
  let turns: number[] = [];
  for (let i = 0; i < order; i++) {
    const reflected = turns
      .slice()
      .reverse()
      .map((turn) => -turn);
    turns = [...turns, 1, ...reflected];
  }
  return turns;
}

export function generateDragonPoints(order: number): Point[] {
  if (!Number.isInteger(order) || order < 0 || order > MAX_ITERATION) {
    throw new RangeError(`order must be an integer in [0, ${MAX_ITERATION}]`);
  }

  const turns = generateTurns(order);
  let heading = 0;
  let x = 0;
  let y = 0;
  const points: Point[] = [{ x, y }];

  const step = () => {
    const radians = (heading * Math.PI) / 180;
    x += Math.cos(radians);
    y += Math.sin(radians);
    points.push({ x, y });
  };

  step();
  for (const turn of turns) {
    heading += turn * 90;
    step();
  }

  return points;
}

export function dragonPathD(points: Point[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const move = `M ${first.x} ${first.y}`;
  const lines = rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
  return `${move} ${lines}`;
}

// Shared viewBox so multiple orders of the same curve line up in one frame
// instead of each being independently centred/scaled.
export function getDragonViewBox(points: Point[]): string {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const pad = Math.max(width, height) * 0.04;
  return `${minX - pad} ${minY - pad} ${width + 2 * pad} ${height + 2 * pad}`;
}
