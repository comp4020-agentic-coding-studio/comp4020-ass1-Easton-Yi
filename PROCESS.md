# Process overview

## The deployed URL:
https://comp4020-agentic-coding-studio.github.io/comp4020-ass1-Easton-Yi/

## What I built

A single-page explainer that carries one claim: Hausdorff dimension is the
critical exponent that makes scale-based measurement stable as the measuring
scale shrinks. Norway's coastline is the hook, the Koch snowflake is the exact
model worked out in full, and the whole thing is driven by one mechanic ---
native vertical scroll through a reversible construction/zoom sequence. It was
built in the increments `docs/PROJECT_BRIEF.md` lays out --- math vertical
slice, core scroll interaction, narrative shell, postscript coda, then visual
refinement --- each checked with `pnpm check` and a real rendered screenshot
before moving on.

## The moments that mattered

1. **A green build hid an invisible drawing, so I fixed the class of bug, not
   the line.** The first Koch renderer built cleanly and passed all 27 vitest
   cases, but a screenshot at both marking viewports showed six empty boxes
   where the snowflake should have been: `stroke-width: 0.003` was written for
   the SVG's `viewBox` units, but `vector-effect="non-scaling-stroke"` makes
   stroke width a screen-pixel value, so the line rendered at ~0.003px.
   Nothing in `tsc`, the build, or the test suite could see this --- none of
   them look at a pixel. Re-screenshotting confirmed the fix; I then wrote the
   rule into `CLAUDE.md` itself rather than patching the one value, since Act
   2's larger sticky renderer would hit the identical trap
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

2. **A CSS "safety net," thrown away rather than patched, is now a standing
   `CLAUDE.md` check.** Fixing a nested-scroll bug made the whole page
   screenshot blank at both viewports: `html, body { overflow-x: hidden; }`
   forces the un-set axis to compute as `auto` per the CSS overflow spec,
   which turns `body` into its own scroll container and silently breaks
   `position: sticky`. I removed the rule outright instead of finding a
   workaround, and replaced "trust the CSS" with the check the brief actually
   asks for --- `scrollWidth <= clientWidth` --- which is now the
   no-horizontal-overflow rule `CLAUDE.md` states as non-negotiable
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

3. **Re-verified my own fix and caught a second, real bug in it.** The Norway
   silhouette first used the `world-geojson` package; its licence turned out
   to be GPL-3.0, incompatible with the brief's public-domain requirement, so
   I discarded it for a from-scratch Natural Earth extraction instead of
   noting the risk and shipping anyway. On a later pass I didn't take that
   replacement on faith either: comparing it against the actual Natural Earth
   source showed it didn't trace the real geometry closely enough to count as
   derived data, and a clipping bug had pulled a strip of Sweden's coastline
   into Norway's shape. Both were re-derived with a verified mapshaper
   pipeline and confirmed against the source data at both viewports before
   acceptance
   ([`e8460ef`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e8460ef429ab9536f0c9e5a35857240674ea3c58),
   [`9f8c841`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/9f8c8416b479334ed601320537ffbdab567431c2)).

4. **Sized the fix from a computed number, not a guess.** Users reported the
   Koch "camera" clipping the snowflake's tips at late iterations; `pnpm
   check` had no way to see this since `iterationForProgress`/`computeProgress`
   were already correct --- the bug was purely geometric. I computed the
   shape's actual bounding box (`w=1.0, h=1.1547`) and found the old camera's
   visible window (`0.923`) was smaller than the shape by construction. The
   new `viewBox`/zoom cap was derived from that number
   (`2.2/1.75=1.257`, a real margin over `1.1547`), not tuned by eye, and
   re-screenshotting surfaced a second-order bug the plan hadn't predicted
   (`height: 100%` letterboxing the square shape), fixed in the same pass
   ([`0de8955`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/0de89558786e58c4c676c89cfd1bb8828a27d99d)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that
the current reflection entry is in `reflections/`, and that your `CLAUDE.md`
is there --- before a marker ever opens the file.
