# Process overview

## The deployed URL:
https://comp4020-agentic-coding-studio.github.io/comp4020-ass1-Easton-Yi/

## What I built

A single-page explainer: Norway's coastline is the hook, the Koch snowflake is
the exact model worked out in full, and Hausdorff dimension explains why
measured length keeps growing as the ruler shrinks. One mechanic drives it ---
native vertical scroll through a reversible construction/zoom sequence. Built
in the increments `docs/PROJECT_BRIEF.md` lays out --- math slice, scroll
interaction, narrative shell, postscript, visual refinement --- each checked
with `pnpm check` and a real screenshot before moving on.

## The moments that mattered

1. **A green build hid an invisible drawing, so I fixed the class of bug, not
   the line.** `stroke-width: 0.003` was viewBox-scaled, but
   `vector-effect="non-scaling-stroke"` made it a screen-pixel value, so the
   snowflake rendered at ~0.003px while `tsc`, build, and 27 vitest cases
   stayed green. Fixed the rule in `CLAUDE.md`, not the one value, since Act
   2's renderer would hit the same trap
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

2. **A CSS "safety net," thrown away rather than patched, is now a standing
   check.** `html, body { overflow-x: hidden; }` forced the un-set axis to
   `auto`, turning `body` into its own scroll container and silently breaking
   `position: sticky` --- blank at both viewports, invisible to every check. I
   removed the rule and replaced it with `scrollWidth <= clientWidth`, now
   `CLAUDE.md`'s non-negotiable no-horizontal-overflow rule
   ([`e1718b3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e1718b38930cb7f7940aed1607ae9fa9753f04b3)).

3. **Re-verified my own fix and caught a second, real bug in it.**
   `world-geojson`'s GPL-3.0 licence conflicted with the brief's
   public-domain requirement, so I replaced it with a from-scratch Natural
   Earth extraction --- then didn't trust that replacement either: a later
   comparison against the source showed a clipping bug had pulled a strip of
   Sweden into Norway's shape. Both re-derived with a verified mapshaper
   pipeline, confirmed at both viewports
   ([`e8460ef`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/e8460ef429ab9536f0c9e5a35857240674ea3c58),
   [`9f8c841`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/9f8c8416b479334ed601320537ffbdab567431c2)).

4. **Sized the fix from a computed number, not a guess.** The Koch camera
   clipped the snowflake's tips at late iterations --- a purely geometric bug
   `pnpm check` couldn't see. I computed the shape's real bounding box
   (`w=1.0, h=1.1547`), found the old visible window (`0.923`) too small by
   construction, and derived the new zoom cap (`2.2/1.75=1.257`) from that
   margin. Re-screenshotting caught a second bug the plan hadn't predicted
   (`height: 100%` letterboxing) in the same pass
   ([`0de8955`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/0de89558786e58c4c676c89cfd1bb8828a27d99d)).

5. **Rewrote the Koch scene from formulas into felt experience, then
   loosened the wording rule fighting that goal.** Math notation and a
   `<details>` block of definitions were accurate but read as a lecture; I
   replaced them with observational copy ("Smaller details are ignored.")
   and a faint full-resolution reference outline, so "more detail kept" is
   seen, not told. That rewrite collided with a self-imposed ruler-phrasing
   rule, so I loosened it in the same sitting rather than keep the copy
   awkward to satisfy my own check
   ([`c2f4b25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/c2f4b2559e3191d40434b09f080d5c04ba0b9dab),
   [`8e951b6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/8e951b61aebe9901590162bfdcff460166b0a785)).

6. **Widened the resolution scene from "here's the dimension" to "here's the
   family it belongs to."** 1.26 was landing as an isolated fact, so I added
   fractal-family framing --- a Hilbert-curve aside as a plane-filling
   counter-example, the general D = log_s N relation --- so the number
   arrives as one instance of a visible pattern, and picked "ruler"
   terminology back up now it had somewhere to land
   ([`04e3bec`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/04e3bec86f5d482757f9975906c1695c7ed6449e)).

7. **Smoothed "coastline is a fractal" into "so the ruler changes the
   answer" with a concrete before/after.** The journal entry was one dense
   paragraph carrying a now-redundant inline ruler gloss, so I split it into
   three short beats and dropped the duplicate standing-gloss check. I then
   added the demonstration the argument had been asserting without showing:
   Norway's own coastline at three resolutions, with measured length
   actually changing (25,148 km &rarr; 28,953 km &rarr; finer) as the ruler
   shrinks
   ([`a8ad323`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/a8ad323252f03714b4a5b404ef53f9cf86824b21),
   [`0a65734`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Easton-Yi/commit/0a65734684aefd484c7c0d9ceb8f340976118a7b)).

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that
the current reflection entry is in `reflections/`, and that your `CLAUDE.md`
is there --- before a marker ever opens the file.
