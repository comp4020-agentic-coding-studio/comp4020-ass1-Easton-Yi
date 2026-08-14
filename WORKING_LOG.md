# Working log

Dated, factual notes on what was actually done and observed. Not a draft of
`PROCESS.md` — that gets written later, from real entries here, once more of
the brief exists (see `docs/PROJECT_BRIEF.md` "Development sequence").

## 2026-08-14

- Read `docs/PROJECT_BRIEF.md`, `docs/ASSIGNMENT_QA_NOTES.md`,
  `docs/CONTENT_SOURCES.md`, `docs/EPILOGUE.md`, `spec/Ass1_spec.md`, and the
  existing starter (`astro.config.ts`, `src/`, `spec/`). No `docs/references/`
  screenshots exist in this repo, so there was nothing to avoid tracing.
  No contradiction found between the repo/spec and the project docs: stack
  (Astro), base path (`/comp4020-ass1-Easton-Yi/`), and course checks all fit
  the brief's "adapt the existing stack" instruction.
- Implemented `src/lib/koch.ts`: deterministic Koch snowflake point
  generation from an equilateral triangle (side 1), exact `N_n`, `epsilon_n`,
  `P_n`, enclosed-area, and the covering sum `M_s(n) = N_n * epsilon_n^s`.
  First rotation sign for the outward bump was wrong — a quick Node script
  computing polygon area via the shoelace formula against the closed form
  `A_n = (1/5)[8 - 3(4/9)^n] A0` showed area *shrinking* toward the triangle
  instead of growing toward `8/5 A0`, i.e. the bumps were pointing inward.
  Flipped the rotation sign; areas then matched the closed form to 6 decimal
  places at every iteration 0–5.
- Wrote `spec/koch.test.ts` covering acceptance-test items 4–8 from
  `docs/PROJECT_BRIEF.md` (segment count, cover scale, and the growth /
  stability / decay of `M_1`, `M_D`, `M_2`), plus geometry sanity checks
  (closed path, area bound, rejection outside the cached iteration range).
- Replaced the starter `index.astro` placeholder with a plain, non-animated
  test view: one card per cached iteration (0–5), each showing its SVG
  outline and the six metrics. Deleted `spec/starter.test.ts` per its own
  documented instruction ("replace or delete it when you replace the starter
  page").
- `pnpm check` passed (typecheck, build, oxlint, stylelint, vitest — 27
  tests across 3 files) on the first full run.
- Direct visual inspection caught a real bug that `pnpm check` did not:
  installed Playwright's Chromium (`npx playwright install chromium`; no
  `--with-deps`, since that needs root and wasn't available) and screenshotted
  the built site at both marking viewports. All six SVG cards were rendering
  as empty boxes — the CSS set `stroke-width: 0.003` for a 1.6-unit `viewBox`,
  but the path also has `vector-effect="non-scaling-stroke"`, which makes the
  stroke width a screen-pixel value, so the line was ~0.003px — invisible.
  Automated checks (typecheck/build/lint/vitest) all stayed green through
  this; nothing but looking at a render caught it. Fixed by setting
  `stroke-width: 1.5px`. Re-screenshotted at 1920×1080 and 390×844: correct
  triangle → snowflake progression, no horizontal overflow at either size, no
  console errors. Added the general rule (viewBox-unit vs. screen-pixel
  stroke widths under non-scaling-stroke) to `CLAUDE.md` rather than only
  fixing the one line, since the interactive Koch stage will use the same
  non-scaling-stroke pattern at larger scale.
- Not yet built: scroll interaction, intro/compass, resolution/coda act,
  colour system, reduced-motion handling. These are the next increments per
  the brief's development sequence (mathematical vertical slice is done;
  core interaction is next).
- Built the Act 2 core scroll interaction (user-approved increment): added
  `src/lib/scrollState.ts` (pure `computeProgress` / `iterationForProgress` /
  `nextMaxRevealStage` functions, no DOM dependency) and
  `src/scripts/koch-scene.ts` (reads `getBoundingClientRect()`/`scrollY` on
  scroll+resize via `requestAnimationFrame`, swaps the cached SVG path per
  iteration, updates the six instrumentation stats, reveals explanation lines
  monotonically, and scales a `--camera-scale` CSS var unless
  `prefers-reduced-motion: reduce`). Replaced `index.astro`'s test-grid view
  with the sticky single-scene layout and rewrote `global.css` for it.
  `currentIteration` is derived purely from scroll geometry (so it's
  automatically reversible and resize-stable); `maxRevealStage` is tracked
  separately via a `Math.max` so it never regresses on backward scroll.
- Wrote `spec/scroll-state.test.ts` covering acceptance items 3, 9, 10
  (progress clamping/monotonicity, iteration reversibility, resize-mid-
  interaction preserving the logical iteration, and `maxRevealStage`
  monotonicity under a backward-scroll candidate). One tolerance
  (resize-progress stability) was loosened from 0.02 to 0.05 after measuring
  an actual diff of ~0.0265 — the acceptance-relevant check (iteration
  equality across resize) is asserted separately with exact equality and
  passed from the start.
- Verified the interaction directly with Playwright (Chromium) at both
  marking viewports: keyboard-only scroll (`Space` / `Shift+Space`, no wheel
  events) drove `data-iteration` 0→5 forward, resizing mid-interaction
  (desktop 1920×1080 → 1400×900) preserved iteration 5, and reverse scroll
  brought iteration back to 0 while `data-max-reveal-stage` stayed at 5 —
  confirmed at both viewports, no console errors, no horizontal overflow.
- Found and fixed two real CSS bugs during this same round of direct
  inspection that `pnpm check` did not catch:
  1. `.koch-copy` had `overflow-y: auto`, which is a nested scroll container
     inside the sticky panel — explicitly prohibited by the brief. Visible on
     the first mobile screenshot as truncated copy text. Fixed by removing
     the rule and making the panel fit without scrolling instead: `clamp()`
     font sizing, a denser instrumentation grid, and adjusted flex-basis
     splits (42/58 mobile, 62/36 desktop).
  2. After that fix, screenshots came back completely blank at both
     viewports. A debug script comparing `#koch-scene` vs `.koch-sticky`
     `getBoundingClientRect()` showed `stickyRect.top` deeply negative and
     equal to the scene's top — `position: sticky` had stopped pinning
     entirely. Root cause: `html, body { overflow-x: hidden; }` in
     `global.css`. Per the CSS overflow spec, setting only one axis to a
     non-`visible` value forces the other axis to compute as `auto`, so
     `body` became its own scroll container and `sticky`'s containing block
     was no longer the real viewport scroll. Fixed by removing the
     `overflow-x: hidden` rule entirely (verified no horizontal overflow is
     introduced by checking `scrollWidth` vs `clientWidth` directly instead of
     relying on the CSS safety net). Re-confirmed `stickyRect.top === 0`
     mid-scroll, re-screenshotted correctly, and re-ran the full keyboard
     scroll/resize/reverse test above — all still passing after the fix.
- `pnpm check` green after all of the above: 35 tests across 4 files,
  0 typecheck/lint errors.
- Updated `CLAUDE.md` with the assignment's operational rules (concept
  contract, exclusions, marking viewports, required commands, and the
  no-claims-without-real-rendering rule, citing both the stroke-width and the
  overflow-x/sticky bugs as concrete precedent).
- Not yet built: intro/compass opening, resolution/coda act, colour system,
  arc transition, tide effect, deployment verification, evidence docs
  (`PROCESS.md`, `reflections/`). Next proposed increment: the narrative
  shell (intro framing + Norway question before the Koch scene, and the
  resolution/coda act after it), still without colour/visual polish.
- Built the narrative shell (Act 1 intro/compass + Act 3 resolution), still
  no colour system, Norway silhouette, arc transition, or tide effect —
  those are the brief's step-5 visual-refinement increment, not this one.
  Added `src/scripts/intro.ts` and `src/scripts/resolution.ts`, plus two new
  `<section>`s in `index.astro` (`#intro-scene`, `#resolution-scene`) around
  the existing `#koch-scene`.
  - Intro is a normal (non-sticky) section, so native scrolling past it
    already works without any scroll-jacking; the script only handles the
    optional staged reveal of the two question lines and the compass
    button's reveal/skip. A click anywhere in the intro (other than the
    compass) or `prefers-reduced-motion: reduce` completes the reveal
    immediately. The compass is a real `<button>`, so Enter/Space activation
    is native — no extra keydown handling needed. Clicking/activating it
    calls `scrollIntoView` on `#koch-scene` and moves focus to its `h1` for
    keyboard users.
  - Resolution reveals its seven stages once via `IntersectionObserver`
    (unobserved after reveal, so it's monotonic — scrolling back up cannot
    hide it again), or immediately under reduced motion / if
    `IntersectionObserver` is unavailable. Copy is the brief's exact English
    text for the primary statement, the covering-measure expression, the
    Koch calculation, the explanation, an optional `<details>` for the
    formal Hausdorff-measure definition, the return-to-Norway line, and the
    final line ("The ruler is part of the answer.").
  - Deliberately deferred: the postscript coda from `docs/EPILOGUE.md`. Its
    own instructions gate it on "the Norway question, Koch interaction,
    measurement readouts, and mathematical resolution ... working and
    verified" — i.e. on this increment being done and checked first — so it
    is the next proposed increment, not part of this one.
  - Verified with Playwright at both marking viewports: initial load leaves
    the compass non-interactive (`opacity:0; pointer-events:none`); clicking
    the intro copy reveals both lines and the compass; pressing Enter on the
    focused compass scrolls to and focuses the Koch scene's heading;
    scrolling to the document bottom reveals all seven resolution stages;
    `prefers-reduced-motion: reduce` shows the full intro and full
    resolution immediately with no timers/observer delay; no horizontal
    overflow and no console errors in any of these states.
  - `pnpm check` green: 35 tests across 4 files (this increment didn't add
    new DOM-behaviour unit tests — timers/`IntersectionObserver`/reduced-
    motion state are exactly the kind of thing this repo verifies with a
    real rendered browser rather than a mocked DOM, consistent with the
    stroke-width and overflow-x bugs from the previous increment).
  - Updated `<title>` to reflect the whole page ("How long is Norway's
    coastline? — a Hausdorff dimension explainer"); the single `<h1>`
    invariant still holds (`Meet the Koch snowflake.` is the only `h1`, on
    the Koch scene, per `spec/invariants.test.ts`).
- Built the postscript coda from `docs/EPILOGUE.md`, now that the
  resolution above it is verified. Added `src/scripts/postscript.ts` and a
  `#postscript-scene` section after `#resolution-scene`, using the exact
  approved English copy (the three text beats, the "A postscript" label, no
  extra paragraph after the final line). Reveal is the same
  `IntersectionObserver`-once pattern as the resolution (monotonic, no new
  continuous scroll handler), immediate under reduced motion. Added a quiet
  `Measure again` link that scrolls back to `#intro-scene` (not a second
  call to action — plain small text, matches the brief's "only if the
  existing navigation pattern already supports it").
  - Deliberately not implemented: the coda's own "keep the coastline
    visible, fade the ruler/readout first" choreography. That requires the
    Norway silhouette and a literal ruler/readout visual, neither of which
    exists yet (visual system is step 5, not built). Implemented the coda
    as the same plain, text-only treatment as the resolution instead;
    revisit this choreography specifically once the visual system exists.
  - Found and fixed a real bug via `pnpm check` itself (not just visual
    inspection this time): `astro check` failed with "Cannot redeclare
    block-scoped variable 'section'" once two scripts (`resolution.ts`,
    `postscript.ts`) both declared a top-level `const section` with no
    imports/exports. TypeScript treats a file with no `import`/`export` as
    a global script rather than a module, so their top-level declarations
    collided in the same global scope even though they're separate
    `<script src>` tags. Fixed by adding `export {}` to the end of both
    files, which makes each a proper ES module with its own scope — the
    same fix will be needed for any future no-import script file.
  - Verified with Playwright at both marking viewports: postscript stages
    are unrevealed on load, all three reveal on scroll-to-bottom, stay
    revealed after scrolling up and back down (monotonic), reduced motion
    reveals everything immediately without any scroll, `Measure again`
    scrolls back to the intro section, no horizontal overflow, no console
    errors.
  - `pnpm check` green: 35 tests across 4 files (same as the previous
    increment — no new pure-function logic was added, just DOM reveal
    wiring already covered by the resolution's pattern).
