# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it.

## What I built

A single-page explainer that carries one claim: Hausdorff dimension is the
critical exponent that makes scale-based measurement stable as the measuring
scale shrinks. Norway's coastline is the hook, the Koch snowflake is the exact
model worked out in full, and the whole thing is driven by one mechanic ---
native vertical scroll through a reversible construction/zoom sequence, framed
by an intro (the Norway question), a resolution (the answer, worked out), and
a postscript coda. It was built in the increments `docs/PROJECT_BRIEF.md` lays
out: math vertical slice, core scroll interaction, narrative shell, postscript
coda, then visual refinement (colour system, Norway silhouette, staged
fields), each one checked with `pnpm check` and a real rendered screenshot
before moving on.

## The moments that mattered

1. **A green build hid an invisible drawing.** The first Koch renderer built
   cleanly and passed every check, but a screenshot at both marking viewports
   showed six empty boxes where the snowflake outlines should have been. The
   cause was `stroke-width: 0.003` written for the SVG's `viewBox` units,
   combined with `vector-effect="non-scaling-stroke"` on the path --- which
   makes stroke width a screen-pixel value, so the line was rendering at
   ~0.003px. Nothing in `tsc`, the build, lint, or the 27 passing vitest cases
   could have caught this, because none of them look at a pixel. What told me
   it was actually fixed was re-screenshotting at both viewports and seeing
   the triangle-to-snowflake progression appear; I then wrote the rule into
   `CLAUDE.md` rather than just fixing the one line, since Act 2's larger
   sticky renderer would hit the same trap
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

2. **A CSS "safety net" was quietly breaking the one thing the page does.**
   After fixing a nested-scroll bug in the Koch panel, the whole scene
   started screenshotting blank at both viewports. Comparing
   `getBoundingClientRect()` for the scene versus its sticky panel showed the
   sticky element had stopped pinning at all. The cause was
   `html, body { overflow-x: hidden; }`: per the CSS overflow spec, setting
   only one axis away from `visible` forces the other axis to compute as
   `auto`, which turned `body` into its own scroll container and broke
   `position: sticky`'s containing block. Instead of patching around it, I
   removed the rule entirely and re-verified "no horizontal overflow" the way
   the brief actually asks for it --- checking `scrollWidth` against
   `clientWidth` directly --- rather than leaning on a CSS property whose side
   effect had just broken the core interaction
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

3. **`astro check` caught a class of bug before it shipped.** Adding the
   postscript coda's script alongside the resolution's produced "Cannot
   redeclare block-scoped variable 'section'" even though the two files never
   import each other. A file with no `import`/`export` is treated as a global
   script rather than an ES module, so both files' top-level `const section`
   collided in one shared scope despite being separate `<script src>` tags.
   Adding `export {}` to both files fixed it by giving each its own module
   scope. This mattered beyond the one fix: I flagged it as a durable pattern
   in the working log so the same trap wouldn't reappear the next time a
   no-import script file got added --- which it didn't, in the visual
   refinement increment that followed
   ([`b8db6e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/b8db6e3ec160b3a2be4d6d958220587bc676cff8)).

4. **The easy data source was the wrong one.** For the Norway silhouette, the
   fastest path was a ready-made `world-geojson` package. Before using it, I
   checked its licence via the GitHub API and found it was GPL-3.0 ---
   incompatible with the brief's requirement that map data be public domain.
   Rather than use it and note the risk, I discarded it and fetched Natural
   Earth's own 1:10m country data from its official mirror instead, then
   wrote a Ramer-Douglas-Peucker simplification from scratch to bring
   Norway's 7911-point mainland ring down to a usable 317-point SVG path.
   Slower, but it's the only version of this asset I could ship without a
   licence problem
   ([`e8460ef`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e8460ef429ab9536f0c9e5a35857240674ea3c58)).

5. **Re-verified the Norway asset against the actual source data, and caught
   a real data-contamination bug in the process.** Entry 4 above describes
   fetching Natural Earth's country polygons and running a from-scratch RDP
   simplification; on review that asset's path did not actually trace the
   real Natural Earth geometry closely enough to justify calling it derived
   data, so it has now been replaced end to end with a verified pipeline: `npx
   mapshaper` (no gdal/ogr2ogr available) loading
   `ne_10m_admin_0_countries.shp` filtered to the single feature where
   `ADMIN=="Norway"` (120 rings), then a bounding-box split into 96
   mainland/coastal-island rings versus 24 distant-territory rings (1 Jan
   Mayen, 22 Svalbard, 1 Bouvet Island) dropped so mainland Norway isn't
   shrunk to fit them, reprojected with a custom Transverse Mercator
   (`+proj=tmerc +lat_0=64 +lon_0=17 +k=0.9996`) chosen to proportion the
   country's north-south extent correctly. Three simplification levels
   (unsimplified, 15% and 3% Visvalingam) were exported to SVG and compared
   both zoomed into the western fjords and at deployment scale/opacity, at
   both 1920x1080 and 390x844. **The 3% candidate was rejected**: at the
   fjord zoom it visibly flattens the western coast into a near-straight line
   with generic triangular notches and drops most offshore island fragments,
   which is exactly the "generic zigzag" failure mode the brief rules out.
   The 15% candidate was indistinguishable from the unsimplified export at
   both viewports while being roughly 1/6th the size, so it was selected for
   the land fill.
   For the brighter-western-coast / weaker-inland-border visual split, a
   second Natural Earth layer (`ne_10m_coastline`, 1:10m) was added as a
   separate stroke. The first attempt clipped it to Norway's plain lon/lat
   bounding box, which silently pulled in a strip of Sweden's own coastline
   that happens to fall inside the same rectangle — visible in a screenshot
   as a bare line unattached to Norway's landmass. It was replaced with a
   polygon clip against an 8km buffer around Norway's own simplified land
   polygon, which keeps only Norway's coast and drops the contamination; the
   fix was confirmed by re-screenshotting the full shape and the fjord zoom
   with no stray geometry on the ocean side. Because coastline data contains
   no inland borders by construction, Norway's land border with
   Sweden/Finland/Russia ends up with no stroke at all — the weakest possible
   treatment — while the fill alone still reads as the country's shape.
   ([`9f8c841`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/9f8c8416b479334ed601320537ffbdab567431c2)).

6. **A green build and a passing scroll test still let the snowflake "camera"
   clip itself.** After using the Koch scene, the reported problems were
   concrete: the seed triangle read too small, title/shape/measurements felt
   disconnected, and late iterations zoomed so far that only one clipped
   boundary fragment remained on screen. `pnpm check` had no way to see any
   of this --- `iterationForProgress`/`computeProgress` were (and still are)
   fully tested and correct; the bug was purely geometric. I computed the
   snowflake's actual bounding box per iteration (`generateKochPoints` in
   `src/lib/koch.ts`): stable at `w=1.0, h=1.1547` for every iteration past
   the first. The old camera scaled up to 2.6x inside a `viewBox` of size
   2.4, so the visible window (`2.4/2.6=0.923`) was smaller than the shape's
   own height --- it was clipping the pointed tips on every side by
   construction, not by accident. The fix was sized from that number, not
   guessed: a `2.2`-wide viewBox with zoom capped at 1.75x max
   (`2.2/1.75=1.257`, a real margin over `1.1547`), read from a
   `--camera-zoom-max` custom property so the cap can differ by breakpoint
   without touching the scroll math in `src/lib/scrollState.ts`, which
   stayed untouched throughout. Re-screenshotting at both marking viewports
   after the fix caught a second-order problem the plan hadn't predicted:
   `.koch-svg` had `height: 100%` inside a portrait-shaped flex box, which
   letterboxed the (square) snowflake into a small strip and left the
   "disconnected" feeling worse, not better; replacing it with
   `aspect-ratio: 1` plus `max-height: 100%` let the shape actually fill its
   pane
   ([`0de8955`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/0de89558786e58c4c676c89cfd1bb8828a27d99d)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that
the current reflection entry is in `reflections/`, and that your `CLAUDE.md`
is there --- before a marker ever opens the file.
