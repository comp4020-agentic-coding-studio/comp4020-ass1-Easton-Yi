# Assignment and Design Q&A Notes

## Is the original six-page idea feasible?

Most individual effects are technically possible, but the combined proposal is too risky for this assignment and deadline. It contains two navigation systems (vertical zoom and horizontal paging), several separate fractal examples, a 3D scene, multiple transition metaphors, and two mathematical claims. That is no longer “one idea, one mechanic.” It also multiplies failure modes at 390x844, during resize, and under keyboard navigation.

The revised version keeps the strongest parts—Norway, the curved blue fields, red compass, Koch outline, scroll-driven scale, and tide imagery—but composes them into one vertical three-act experience.

## What is the one idea?

Hausdorff dimension is the critical exponent that makes scale-based measurement stable. The coastline is the everyday question; the Koch snowflake is the exact model; the return to Norway shows why the mathematics matters.

## What is the one mechanic?

Native vertical scrolling advances/reverses the Koch construction and camera scale. A compass button only moves to the start of that same journey; it is not a second experiment.

## Why remove horizontal swiping?

Horizontal swipe would introduce a second navigation grammar, conflict with mobile browser gestures, complicate keyboard use, and make resize-mid-interaction state harder to preserve. It would also encourage separate “slides” rather than one idea carried continuously.

## Why remove the fractal gallery and Menger sponge?

They answer a different question: “What other fractals exist?” The assignment question is: “Why does measured length depend on scale?” A 3D Menger sponge also introduces WebGL/rendering risk without strengthening that answer.

## Can the opening still look cinematic?

Yes, provided it is brief, skippable, and not essential to reaching the content. The two sentences may cross-fade at the same location. The compass appears after the question. Under reduced motion, show the final question immediately.

## Correct English copy

Avoid:

- `Before journey, think of a question...`
- `What would be the accurate length of the costline of Norway?`
- `Lets meat a mathmatical concept: fractal`
- `Meet the crew: these are all fractals`

Use:

- `Before we begin, consider one question...`
- `How long is Norway's coastline?`
- `Meet the Koch snowflake.`
- `Scroll to look closer.`

Corrections: `coastline`, `Let's`, `meet`, `mathematical`.

## Is Norway's coastline infinitely long?

Do not state that literally. A real coast has atomic/physical limits and its boundary depends on conventions such as tide, islands, and map generalisation. Its *measured* length changes with ruler scale over the range represented by the data. The Koch snowflake is the ideal mathematical object whose limiting perimeter is infinite.

## Is the Koch snowflake “higher-dimensional inside 2D”?

It is embedded in a 2D plane, but its boundary has dimension approximately 1.262: greater than an ordinary line's dimension 1 and less than a filled plane's dimension 2. The precise problem is not a “2D ruler.” Ordinary one-dimensional length is infinite, while ordinary two-dimensional area of the boundary is zero. Hausdorff dimension finds the fractional exponent between them.

## What does “length gives infinity, area gives zero” mean?

At construction scale `epsilon_n = 3^-n`, the snowflake boundary contains `N_n = 3 * 4^n` segments. Consider the scale-weighted covering sum:

```text
M_s(n) = N_n * epsilon_n^s
```

Then:

```text
s = 1:               M_1(n) = 3 * (4/3)^n -> infinity
s = 2:               M_2(n) = 3 * (4/9)^n -> 0
s = log(4)/log(3):   M_s(n) = 3            -> stable
```

This is the core interaction and the intuitive route into Hausdorff dimension.

## Is `M_s(n)` itself the complete formal Hausdorff measure?

No. It is the sum from the natural construction-aligned cover and provides the correct scaling intuition for Koch. Formal Hausdorff measure takes an infimum over all countable covers whose pieces are smaller than a chosen scale, then lets that scale approach zero. The site must distinguish the intuitive covering sum from the formal definition.

## What is the formal definition being introduced?

For a set `F`, cover it with sets `U_i` of diameter at most `delta` and compute:

```text
sum_i diam(U_i)^s
```

Take the infimum over all such covers to obtain `H^s_delta(F)`, then let `delta -> 0` to obtain `H^s(F)`. The Hausdorff dimension is the critical value:

```text
dim_H(F) = inf { s >= 0 : H^s(F) = 0 }
         = sup { s >= 0 : H^s(F) = infinity }
```

For the standard Koch curve, the self-similar calculation gives `D = log(4)/log(3)` and agrees with the Hausdorff dimension.

## Does every fractal have a Hausdorff dimension from `log(N)/log(s)`?

No. For standard self-similar sets satisfying the relevant separation conditions, the similarity dimension is calculated from `N` copies scaled by ratio `r`:

```text
D = log(N) / log(1/r)
```

For the Koch curve, this value agrees with its Hausdorff dimension. The simple formula is not a universal computation for every fractal.

## Does integration fail to measure it?

No. The usual arc-length limit does not converge to a finite value; it diverges. The limiting Koch curve is non-rectifiable and has infinite one-dimensional length. The page should say this precisely rather than suggesting that calculus is broken.

## Is the snowflake's diameter fixed?

Avoid promising an exactly fixed diameter at every construction stage. The robust statement is that the boundary remains bounded. Also distinguish the boundary from the filled interior: the boundary has zero ordinary 2D area, while the filled snowflake region has finite positive area. The display may keep the shape fitted to a stable frame, but that is a camera/layout choice.

## How is the Koch perimeter derived?

Start with an equilateral triangle of side length 1.

```text
segments at iteration n:       N_n = 3 * 4^n
length of each segment:        l_n = (1/3)^n
perimeter:                     P_n = N_n * l_n
                                      = 3 * (4/3)^n
```

Since `4/3 > 1`, `P_n -> infinity`.

## How is its dimension derived?

One Koch segment becomes four self-similar copies, each scaled to one third:

```text
4 * (1/3)^D = 1
D = log(4) / log(3)
D ~= 1.2618595
```

## Can the site render infinite detail?

No computer renders an actual infinite object. The correct and performant approach is to render a bounded number of exact iterations and show that the rule has no terminal iteration. Cache one SVG path per iteration, replace one path only at thresholds, and animate transforms rather than adding DOM nodes continuously.

An “endless close-up” can be attempted later by recycling a self-similar motif, but it is a stretch goal. It must never be allowed to jeopardise the finite, accurate core interaction.

## Why SVG instead of Canvas or WebGL?

SVG is deterministic, sharp at both marking viewports, easy to style, easy to inspect in tests, and sufficient for a single cached path. Canvas is acceptable only if profiling proves SVG cannot meet the performance target. WebGL/Three.js is unnecessary.

## Should wheel events be captured directly?

Prefer native document scrolling over `wheel` interception. Native scrolling works with mouse wheels, trackpads, touch, keyboard, scrollbars, and assistive technology. A finite sticky scroll section can create the zoom experience without trapping the visitor.

## What happens on mobile without a mouse wheel?

The user swipes vertically as normal. The same normalized document-scroll progress drives the interaction. There must be no hover-only instruction and no horizontal swipe dependency.

## What happens when the user scrolls backward?

Geometry and zoom reverse. Explanatory text already discovered remains. Implementation must maintain two values:

```text
currentIteration   // reversible with scroll
maxRevealStage     // monotonically increases within the session
```

## Can the tide and liquid-filled lettering be implemented?

Yes, with SVG masks or CSS `clip-path`, but it is decorative. Implement it only after the core interaction, accessibility mode, and viewport tests pass. The reduced-motion version should use an immediate opacity transition.

## How should the Norway illustration be produced?

Derive and simplify an original SVG path from public-domain Natural Earth vector data. Do not trace the supplied video/image screenshot and do not embed that screenshot. Optimise the final SVG path and treat it as atmospheric illustration, not as the precise coastline used for numerical measurement.

## What would cause this response to drift into Credit range?

- turning it into a catalogue of fractals;
- adding a separate coastline ruler simulator after the Koch interaction;
- using several navigation directions;
- making the intro longer than the explanation;
- displaying equations before the visitor observes the phenomenon;
- claiming “infinity” through spectacle without showing the `s=1`, `s=D`, and `s=2` measurement contrast;
- presenting `N(epsilon) * epsilon^s` as the full Hausdorff definition without mentioning the infimum over covers;
- overclaiming that real coastlines or all fractals behave exactly like Koch;
- accepting animation based only on the agent's claim without testing resize, keyboard, and reduced motion.

## What should the user test with another person?

After one minute, ask without prompting:

1. What did you change or reveal?
2. What quantity changed?
3. Why did it change?
4. What does this say about the Norway question?

Desired answer: smaller-scale detail creates a longer measured/perimeter result; measurement scale is part of the answer.

Stronger desired answer: ordinary length explodes and ordinary area vanishes for the Koch boundary; Hausdorff dimension is the fractional exponent that produces stable scaling, which explains why a coastline length requires a stated measurement scale.

## What must be true before accepting the deployed artefact?

- public GitHub Pages URL loads directly;
- CI is green;
- no console error;
- both marking viewports work;
- keyboard and touch can progress;
- resize at a later Koch iteration preserves state;
- intro can be skipped;
- reduced-motion mode contains the complete explanation;
- no secret, API key, external runtime dependency, or custom domain;
- `PROCESS.md`, `CLAUDE.md`, reflection, and real incremental commits agree.
