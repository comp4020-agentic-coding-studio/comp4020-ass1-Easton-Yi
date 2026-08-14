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

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that
the current reflection entry is in `reflections/`, and that your `CLAUDE.md`
is there --- before a marker ever opens the file.
