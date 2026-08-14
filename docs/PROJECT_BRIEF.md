# COMP4020 Assignment 1 Project Brief

## Working title

**The Closer You Measure, the Longer It Gets**

Alternative short title: **How Long Is Norway?**

## Product thesis

Build a static, client-side interactive explainer around one claim:

> Dimension is the exponent that makes measurement stable as the measuring scale shrinks.

The experience begins with the everyday question of Norway's coastline, uses the Koch snowflake as an exact mathematical model, introduces Hausdorff dimension as a critical measurement exponent, and then returns to the coastline question. The visitor should discover why ordinary length becomes infinite, ordinary area sees only zero, and a fractional exponent gives a stable scale-aware measure.

## Assignment fit

- **One strong idea:** Hausdorff dimension identifies the critical exponent at which scale-based measurement stops exploding or vanishing.
- **One mechanic:** vertical scrolling advances and reverses the Koch construction/zoom.
- **One mathematical dataset:** deterministic Koch iterations and the exact covering sum `M_s(n) = N_n * epsilon_n^s`.
- **Static/client-side:** all SVG generation and state changes occur in the browser; no API, backend, account, or secret.
- **Testable interaction:** scrolling forward decreases the measuring scale and increases the displayed Koch iteration; the one-dimensional measure grows, the two-dimensional measure shrinks, and the critical-dimensional measure remains stable.

## Important scientific correction

Do **not** say that a “two-dimensional ruler” cannot measure a higher-dimensional object. A ruler measures one-dimensional length. The accurate tension is between **integer-dimensional measures** applied to a fractal boundary embedded in the plane:

- one-dimensional length assigns the Koch boundary infinite measure;
- two-dimensional area assigns the boundary zero measure;
- the boundary's critical fractional exponent lies between 1 and 2.

The filled interior of the Koch snowflake is a different set from its boundary. The interior has finite positive area; the boundary itself has zero ordinary area.

Do **not** say that integration simply “cannot approach a number.” The accurate statement is:

- after iteration `n`, the Koch snowflake perimeter is finite;
- the perimeter is multiplied by `4/3` at every iteration;
- as `n -> infinity`, the ordinary arc length diverges to infinity;
- the limiting curve is non-rectifiable;
- its enclosed area remains finite;
- its similarity dimension, which agrees with its Hausdorff dimension here, is `log(4) / log(3) ~= 1.26186`.

For a construction-aligned cover at iteration `n`, define:

```text
epsilon_n = 3^-n
N_n       = 3 * 4^n
M_s(n)    = N_n * epsilon_n^s
```

Then:

```text
s = 1:                  M_1(n) -> infinity
s = log(4)/log(3):      M_s(n) = 3 (stable)
s = 2:                  M_2(n) -> 0
```

This covering sum gives the visual intuition. The formal Hausdorff measure goes further by taking the infimum over all sufficiently fine covers. Hausdorff dimension is the critical exponent where the measure changes from infinity to zero. For the standard Koch curve, the self-similar exponent agrees with its Hausdorff dimension.

For a real coastline, do not claim literal infinite length. Real coastlines are only fractal-like over finite ranges and have physical limits. The defensible conclusion is that a coastline length is meaningless without specifying the measurement scale and measurement convention.

## Audience and intended takeaway

Audience: a general visitor with no prior knowledge of fractals.

After approximately 60 seconds, the visitor should be able to say:

> The Koch boundary is too detailed to have finite ordinary length but too thin to have area. Hausdorff dimension finds the fractional power of scale that keeps its measurement stable. A coastline is not a perfect Koch curve, but its reported length likewise depends on measurement scale.

## Experience architecture: one page, three acts

This is one continuous page, not six routes and not a horizontal carousel. Native vertical scroll is the only primary navigation and explanatory mechanic. The red compass button and a final continue control are navigation affordances, not separate exploratory mechanics.

### Act 1 — The question

Full viewport composition:

- upper field: pale blue-grey with a voile-like translucent layer;
- lower field: deeper fjord blue;
- boundary: a smooth upward concave arc;
- behind the upper veil: an original SVG silhouette of Norway derived from public-domain vector data;
- lower field: two lines occupy the same coordinates and cross-fade sequentially;
- a small vivid red compass button appears after the question and moves focus/scroll to Act 2.

Final English copy:

1. `Before we begin, consider one question...`
2. `How long is Norway's coastline?`

The intro must last no more than about 3.5 seconds, be skippable by click/tap/keyboard, and resolve immediately under `prefers-reduced-motion`.

Transition to Act 2:

- the concave divider eases toward a straight horizontal boundary;
- upper field becomes a lighter blue-grey;
- lower field softens toward the original pale blue;
- the Norway silhouette fades into a white Koch snowflake outline;
- avoid a literal image crossfade if the silhouettes visually collide; use opacity staging with a short neutral gap.

### Act 2 — Experience the construction

This is the core and largest section. Use a sticky viewport driven by native page scroll.

Desktop composition:

- Koch snowflake: left 60–65%, large white outline;
- title/copy: right 35–40%;
- current iteration, cover scale, segment count, and three scale-measure traces appear as quiet instrumentation, not a dashboard;
- a short `Scroll to look closer` cue sits near the lower boundary.

Mobile composition:

- Koch snowflake occupies the upper 55–60%;
- copy and values stack below;
- no nested scrolling and no horizontal swipe requirement;
- the same page scroll must drive the same logical state.

Title:

`Meet the Koch snowflake.`

As the visitor scrolls forward:

- construction advances from iteration 0 through at least iteration 5;
- the camera gently zooms toward a stable anchor so smaller motifs remain visible;
- new detail is generated only at discrete iteration thresholds;
- the path does not gain DOM nodes on every scroll event;
- the explanation reveals in stages and remains visible even if the visitor scrolls backward.

Reveal copy:

1. `Every segment becomes four. Each new segment is one third as long.`
2. `Measure it as a line: the total grows by 4/3 at every step.`
3. `Measure the boundary as area: the total shrinks toward zero.`
4. `Between length and area is one exponent that stays stable.`
5. `That exponent is the curve's Hausdorff dimension.`

Scrolling backward reverses the visible geometric iteration and zoom, but does not hide copy already revealed. Store `maxRevealStage` separately from `currentIteration`.

The three readouts are simultaneous consequences of the same scroll state, not three user-selectable experiments:

```text
Length, s = 1                     3 * (4/3)^n       -> infinity
Critical measure, s = log4/log3  3                 -> stable
Area-scale, s = 2                3 * (4/9)^n       -> 0
```

Label the third trace `2D measure of the boundary`, not `snowflake area`, because the filled interior is not the set being measured.

### Act 3 — Resolve the question

The page simplifies to one pale blue-grey field. A restrained tide/mask transition may reveal the conclusion, but it is secondary to clarity and must be disabled under reduced motion.

Primary statement:

> `Length says infinity. Area says zero. Dimension tells us which measure fits.`

First show the intuitive covering expression:

```text
M_s(epsilon) = N(epsilon) * epsilon^s
```

Then show the Koch calculation:

```text
4 copies, each scaled to 1/3
D = log(4) / log(3) ~= 1.262
```

Explanation:

`Below D, the scale-weighted measure explodes. Above D, it vanishes. D is the critical exponent between a line (1) and a plane (2).`

Only after that intuition, reveal the formal definition in an optional detail block or compact final panel:

```text
H^s_delta(F) = inf sum_i diam(U_i)^s
dim_H(F) = inf { s : H^s(F) = 0 }
```

Explain in plain English: `Cover the set with pieces no larger than delta, choose the cheapest such cover, then let delta shrink. The critical exponent is its Hausdorff dimension.`

Return to the opening:

`Norway is not a perfect mathematical fractal. But the same measurement problem returns: a smaller step follows more detail, so a coastline length is incomplete without its scale and convention.`

Final line:

> `The ruler is part of the answer.`

### Optional visual transition after the core is verified

The user's original liquid/tide idea may be retained inside Act 3 without creating another page:

1. render the primary white statement once;
2. move a flat background-colour mask upward through the letterforms so they appear to fill and dissolve into the field;
3. recede that mask like a tide to reveal a restrained rocky silhouette in the upper-left corner and the dimension equation beneath;
4. keep the whole sequence under about 1.2 seconds, make it skippable, and replace it with an immediate state change under reduced motion.

Implement this with one SVG mask or CSS `clip-path`; do not simulate fluid particles. It is a stretch refinement, not a prerequisite for accepting the explainer.

## What is intentionally removed

The following ideas are related but must not appear in the MVP:

- a separate “Meet the crew” page;
- Sierpinski triangle and carpet calculations;
- a 3D Menger sponge or Three.js scene;
- horizontal page swiping;
- a second coastline-measurement slider;
- a general history of fractals;
- a Mandelbrot set gallery;
- claims that natural coastlines are literally infinite;
- claims that every fractal uses the same logarithmic formula;
- claims that calculus or integration “fails.”

These removals keep one idea carried all the way. If the core is complete, tested, deployed, and still visually sparse, at most three small non-interactive silhouettes may appear in a postscript labelled `Other rules create other fractals`. They must not become a new scene or task.

## Visual system

Suggested variables (adjust after contrast testing):

```css
--mist: #b9cbd0;
--sky: #99bdca;
--fjord: #317ea2;
--fjord-deep: #245f80;
--foam: #f7fbfc;
--compass: #ef4b43;
--ink: #143342;
```

Principles:

- modern cartographic/Nordic atmosphere, not a chalkboard or generic neon maths site;
- fine white SVG strokes with `vector-effect="non-scaling-stroke"`;
- colour fields and line geometry provide depth; avoid stock photography;
- use one display typeface and one highly legible text face, both bundled locally or system fonts;
- all visible site copy is English only;
- the supplied screenshots are references only and must not be embedded in the deployed site.

The veil effect should be built from semi-transparent gradients and subtle CSS/SVG texture. Avoid expensive full-screen blur filters and continuous noise animation.

## Technical architecture

Adapt to the existing course starter. Do not change stack merely for this design. If the repository already uses Astro, keep static output and place interactivity in a small client script. If it is bare HTML/CSS/JS, keep it bare.

Recommended separation:

```text
page shell
  intro scene
  sticky Koch scene
  conclusion scene

math module
  generateKochPoints(iteration)
  getKochMetrics(iteration)
  getCoveringMeasure(iteration, exponent)

interaction controller
  map native scroll progress -> current iteration + camera progress
  track maxRevealStage independently

visual layer
  one SVG path for Norway
  one SVG path for Koch geometry
  CSS/SVG transitions only
```

### Koch renderer

- Generate deterministic point arrays from the standard replacement rule.
- Convert the points into a single SVG path string; do not create one DOM element per segment.
- Precompute/cache iterations 0–5 once. Iteration 5 has 3,072 segments and is sufficient to communicate detail without unbounded DOM growth.
- Update the path only when crossing an iteration threshold.
- Between thresholds, animate only a wrapper transform/opacity using CSS custom properties.
- Never append geometry indefinitely in response to wheel events.

The website should create the *experience* of unbounded detail but must not pretend to render infinity. After the last rendered level, the copy explains that the mathematical rule continues without end. A seamless recycled close-up is a stretch goal only after all tests pass.

### Scroll implementation

- Prefer a finite `300–450vh` sticky section and derive normalized progress from its bounding rectangle.
- Do not hijack the wheel or create a scroll jail.
- Do not use nested vertical and horizontal scroll containers.
- Throttle expensive state changes; geometry changes occur only at thresholds.
- Touch, trackpad, mouse wheel, PageDown, Space, and browser scrollbars must all work through native page scrolling.
- Preserve logical state when resizing mid-interaction.

## Accessibility and resilience

- Compass is a real `<button>` with an accessible name and at least a 44x44 CSS-pixel target.
- All interaction remains understandable with keyboard-only navigation.
- Visible focus states use the red accent plus a high-contrast outline.
- `prefers-reduced-motion: reduce` removes camera movement, divider morphs, and tide effects; discrete iteration changes and full content remain available.
- Do not rely on colour alone to communicate iteration or growth.
- SVG has appropriate accessible labelling or is hidden when equivalent text is present.
- No autoplay audio, video, external runtime fonts, API calls, or essential third-party requests.
- Direct navigation, refresh, slow connection, and GitHub Pages base paths must work.

## Acceptance tests

Core behavioural statement:

> Scrolling forward through the Koch stage decreases the cover scale and increases the iteration; the `s=1` measure grows, the `s=2` measure shrinks, and the `s=D` measure remains stable. Scrolling backward reverses the geometry without removing explanations already revealed.

Automated or wired checks should cover:

1. intro can be skipped and compass activates by Enter/Space;
2. entering Act 2 sets a valid initial Koch path;
3. forward scroll changes `data-iteration` from 0 to a higher value;
4. segment count equals `3 * 4^n`;
5. cover scale equals `3^-n`;
6. `M_1(n) = 3 * (4/3)^n` grows across iterations;
7. `M_2(n) = 3 * (4/9)^n` shrinks across iterations;
8. `M_D(n)`, with `D = log(4)/log(3)`, remains approximately 3 within numeric tolerance;
9. reverse scroll reduces `data-iteration` but keeps `data-max-reveal-stage`;
10. resize at iteration >= 3 preserves the logical iteration;
11. no horizontal overflow at 1920x1080 or 390x844;
12. keyboard scrolling reaches and changes the interaction;
13. reduced-motion mode exposes the same explanation without large motion;
14. no uncaught console errors;
15. production build works from the GitHub Pages base path.

Manual checks:

- all visible text is English;
- the coastline remains a background hook, not an unlabelled measurement result;
- the Koch line remains legible on phone;
- text never overlaps the snowflake at either marking viewport;
- the opening sequence never blocks the user;
- a first-time visitor can explain why length gives infinity, area gives zero, and the fractional exponent is the stable one.

## Development sequence

Do not ask the agent to generate the polished site in one pass.

1. **Repository audit and harness:** inspect starter, checks, deployment base path, and existing `CLAUDE.md`; record the concept contract and acceptance commands.
2. **Mathematical vertical slice:** render iterations 0–5, compute exact metrics, and test them without animation.
3. **Core interaction:** wire native scroll to iteration and persistent reveals; test both viewports and keyboard.
4. **Narrative shell:** add the intro question, compass, and conclusion.
5. **Visual refinement:** add colour fields, arc transition, veil, and restrained tide effect.
6. **Deployment verification:** test the public GitHub Pages URL, resize mid-interaction, slow-load behaviour, and console.
7. **Evidence writing:** only after real work exists, select three or four corroborated moments for `PROCESS.md` and one truthful breakthrough for the reflection.

## Process integrity

Do not manufacture failures for evidence. Keep a dated working log containing actual observations, decisions, commands, and commit IDs. When a real failure reveals a missing rule or check, encode the correction in `CLAUDE.md` or the automated harness before retrying. Do not draft a fictional final `PROCESS.md` or reflection at project start.
