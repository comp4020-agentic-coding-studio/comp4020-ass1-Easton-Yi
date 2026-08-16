// Three tolerances of the same real Norway coastline (src/lib/norway.ts),
// simplified at build time with Douglas-Peucker (src/lib/simplify.ts) per
// subpath — one dataset viewed at three measuring resolutions, not three
// different coastlines, so "roughly", "more detailed" and "finer grained"
// read as choices about the ruler, not the coast.
import { NORWAY_COASTLINE_PATH } from "./norway.ts";
import { parseMultiPolyline, simplifyOpenPath, multiPolylineToPathD } from "./simplify.ts";

const subpaths = parseMultiPolyline(NORWAY_COASTLINE_PATH);

function simplifyAll(epsilon: number): string {
  return multiPolylineToPathD(subpaths.map((points) => simplifyOpenPath(points, epsilon)));
}

export const NORWAY_OUTLINE_ROUGH_PATH = simplifyAll(60);
export const NORWAY_OUTLINE_DETAILED_PATH = simplifyAll(25);
export const NORWAY_OUTLINE_FINE_PATH = NORWAY_COASTLINE_PATH;
