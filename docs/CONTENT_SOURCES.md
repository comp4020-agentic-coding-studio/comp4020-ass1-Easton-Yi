# Content, Mathematics, and Sources

## Site copy deck

All deployed text must be English. This section is kept in sync with the
**shipped** copy in `src/pages/index.astro` — it is a record of what is live,
not a spec to write toward. The resolution scene's design history (including
why it carries three worked numbers rather than the single-Hausdorff-result
guideline in `CLAUDE.md`'s "Explainer scope discipline") is in
`docs/Refine_Explanations.md`; read that file, not this one, for the
reasoning behind the current shape.

### Intro

```text
Before we begin, consider one question...

How long is Norway's coastline?
```

Compass accessible name:

```text
Begin the journey
```

### Idea

```text
The Simple Idea

The closer you measure, the longer it gets.

The ruler is part of the answer.
```

### Koch stage

```text
Meet the Koch snowflake.
It looks like a simple six-pointed star, however...
It is actually an infinitely iterating shape!

Zoomed detail
Scroll to look closer.

Smaller details are ignored.
Keep more detail.
The measured boundary gets longer.
For this curve, new detail never ends.
So its ordinary length never settles.
```

Live readout/instrumentation labels:

```text
Smallest detail counted
Measured length
Details below this size are ignored.
Iteration
Segments
```

("Cover scale", "Critical measure", and "2D measure of the boundary" were an
earlier instrumentation set and are not on the deployed dashboard; those
quantities still exist in `src/lib/koch.ts` and its tests.)

### Resolution

```text
Exactly the point and the rare thing!

Fractal family.
It turns out that the coastline and this curve are all fractal patterns.
When zooming in, details on the edges emerge infinitely...

Even can fill in a plane ?!
In extreme senarios, a fractal curve can be infinitely zigzaged and almost
filling in the entire 2D area it occupies...

The tortuosity of fractals!
How tortuous it is?
Actually, the "Hausdorff dimension" D tells how tortuous these fractal
patterns are!

If we zoomed in, each curve/unit is shrunk to 1/s, and is replaced with
N shrunk results, the Hausdorff dimension would be D = log_s N.

It measures how 'big' the pattern is in terms of complexity and
space-filling ability. For the snowflake, this value is D_Koch =
log_3 4 ~= 1.261. Closer to 2 meaning that a pattern is almost filling in
the whole 2D plane!

[dimension scale: 1 line -- 1.26 Koch snowflake -- 2 plane]

For the famous Sierpinski triangle, this is log_2 3 ~= 1.585, and for
those coastlines...

[crossfade: Koch outline -> Britain D~=1.21 / Norway D~=1.52]

Coastlines aren't exact fractals--but they behave like them.

[dimension scale: 1 line -- 1.21 Britain -- 1.52 Norway! -- 2 plane]

Coastline tortuosity.
But there is a way to estimate coastline dimensions based on the formula
D = 1 - log_G(L/M). For the Norway coastline, this is a whopping 1.52
dimensions! (World's highest-dimensional coastline~)

When measuring a coastline, you must decide which details count. A coarse
measurement skips small bays and bends; a finer measurement follows them
and produces a longer result.

For an ideal fractal boundary, this increase never settles--so a coastline
has no single length until its scale and convention are fixed.

Here, the "ruler" means the smallest detail your measurement keeps, not the
scale of the map. The granularity we choose is part of the answer.

You can measure finer, but there is no single "true length".
You can make your ruler smaller, and the measured result will be more
detailed, but also bigger. Look closer, and there is always more detail to
measure.
The result depends on your ruler, not the coastline. (true but seems
unbelievable)

[Norway at three measuring resolutions, each with a "Ruler:" mark]
Roughly       length = 25,148 km
More detailed length = 28,953 km
Finer grained length = 100,915 km
Measured Coastline Length for Norway
Measured length correlates with your ruler scale.

Details we choose to ignore is determined by the ruler.
This is part of the answer.
```

### Postscript

```text
A postscript

We use simple measures
to make a complex world legible.

But every measurement leaves something out.

The world does not run out of detail
where our measurement stops.

Measure again

Made with Natural Earth.
```

(The earlier-planned "Concept sources: Mandelbrot (1967) and Wolfram
MathWorld" footer line was not carried into the shipped postscript; only the
Natural Earth attribution appears on the page. The Mandelbrot/MathWorld
sources below remain the project's actual conceptual sources — cited here
and in `PROCESS.md`/`reflections/`, not on the page itself.)

## Verified mathematical facts

For a Koch snowflake beginning with an equilateral triangle of side length 1:

| Quantity | Iteration `n` | Limit |
| --- | --- | --- |
| Segments | `N_n = 3 * 4^n` | infinite |
| Segment length | `l_n = 3^-n` | 0 |
| Perimeter | `P_n = 3 * (4/3)^n` | infinite |
| Enclosed area | `A_n = (1/5)[8 - 3(4/9)^n] A_0` | `(8/5) A_0` |
| Dimension | `D = log(4)/log(3)` | `1.2618595...` |

For the boundary's natural construction-aligned cover:

```text
epsilon_n = 3^-n
N_n       = 3 * 4^n
M_s(n)    = N_n * epsilon_n^s
```

| Exponent | Covering sum | Behaviour |
| --- | --- | --- |
| `s = 1` | `3 * (4/3)^n` | tends to infinity |
| `s = D = log(4)/log(3)` | `3` | remains stable |
| `s = 2` | `3 * (4/9)^n` | tends to zero |

`M_s(n)` is an intuitive sum for the canonical Koch cover, not the entire formal Hausdorff-measure definition. Formally:

```text
H^s_delta(F) = inf { sum_i diam(U_i)^s : F is covered by U_i,
                     diam(U_i) <= delta }

H^s(F) = lim_(delta -> 0) H^s_delta(F)

dim_H(F) = inf { s >= 0 : H^s(F) = 0 }
         = sup { s >= 0 : H^s(F) = infinity }
```

The most important juxtaposition is not “2D ruler versus high-dimensional object.” It is:

```text
1D measure is too small an exponent: the result explodes
2D measure is too large an exponent: the result vanishes
the fractional Hausdorff dimension is the critical exponent
```

## Primary conceptual source

### Benoit B. Mandelbrot, 1967

**How Long Is the Coast of Britain? Statistical Self-Similarity and Fractional Dimension**  
Science, Vol. 156, Issue 3775, pp. 636–638.  
DOI: https://doi.org/10.1126/science.156.3775.636

Use for:

- the dependence of measured coastline length on measurement scale;
- the idea that geographic curves show statistical self-similarity;
- fractional dimension between the ordinary dimensions of a line and plane;
- the distinction between smooth rectifiable curves and complex geographic curves.

Do not copy passages or diagrams. Paraphrase the mechanism and cite the paper.

## Mathematical reference sources

### Wolfram MathWorld — Koch Snowflake

https://mathworld.wolfram.com/KochSnowflake.html

Use for:

- standard iterative construction;
- `N_n = 3 * 4^n`;
- `l_n = 3 * (4/3)^n` for initial side length 1;
- finite area limit `(8/5)A_0`;
- dimension `log(4)/log(3)`.

Correction: MathWorld denotes the snowflake perimeter by `l_n`; this project's code should use `P_n` to avoid confusing perimeter with a single segment length.

### Wolfram MathWorld — Hausdorff Dimension

https://mathworld.wolfram.com/HausdorffDimension.html

Use for:

- the formal description of Hausdorff dimension via `s`-dimensional Hausdorff measure;
- the definition as the infimum of exponents for which the measure is zero;
- the self-similar scaling law `N = scale^D`.

### MIT PRIMES notes — Hausdorff measure and dimension

https://math.mit.edu/research/highschool/primes/materials/2019/Lei.pdf

Use as a readable mathematical reference for:

- covers by sets of bounded diameter;
- the transition from infinite measure below the critical exponent to zero above it;
- distinguishing Hausdorff measure from simpler box-counting intuition.

### Optional references if a small postscript survives scope review

- Sierpinski triangle: https://mathworld.wolfram.com/SierpinskiSieve.html
  - dimension `log(3)/log(2) ~= 1.58496`.
- Sierpinski carpet: https://mathworld.wolfram.com/SierpinskiCarpet.html
  - dimension `log(8)/log(3) ~= 1.89279`.
- Menger sponge: https://mathworld.wolfram.com/MengerSponge.html
  - dimension `log(20)/log(3) ~= 2.72683`.

These are source notes, not permission to add three new scenes. Their use is deferred unless the one-idea experience is already complete and the tutor-facing scope remains clear.

## Map data

### Natural Earth

Homepage: https://www.naturalearthdata.com/  
1:10m coastline: https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-coastline/  
1:10m country polygons: https://www.naturalearthdata.com/downloads/10m-cultural-vectors/  
Terms: https://www.naturalearthdata.com/about/terms-of-use/

Natural Earth vector and raster data are public domain. Recommended attribution even though not required:

```text
Made with Natural Earth.
```

**Applied.** The Norway silhouette (`src/lib/norway.ts`) is derived from
`ne_10m_admin_0_countries` (land fill, Norway selected by its `ADMIN`
attribute) and `ne_10m_coastline` (coastline stroke), both 1:10m, reprojected
and simplified with mapshaper. The attribution text above appears verbatim on
the deployed page in the postscript scene (`.map-credit`). See `PROCESS.md`
for the extraction/simplification working log.

**Applied.** The Great Britain comparison silhouette (`src/lib/britain.ts`) is
derived from `ne_10m_admin_0_countries`, filtered to the United Kingdom
feature by its `ADMIN` attribute and reduced to the single largest ring by
area (the Great Britain mainland outline; Northern Ireland and outlying
islands are separate, smaller rings and are excluded — this is a comparison
silhouette next to Norway's, not a full UK atlas). Reprojected with a
Britain-centred Transverse Mercator and simplified with mapshaper's
Visvalingam algorithm at 15%, chosen the same way as Norway's own land layer:
compared against an unsimplified export before selection. Shown alongside
Norway's coastline in the resolution scene (`data-stage="10"`).

Do not use the reference screenshot as an asset or trace its exact pixels. It may guide colour balance and silhouette placement only.

## Fractal dimension figures shown in the resolution scene

Two specific coastline dimension figures appear on the deployed page
(`data-stage="10"`/`"12"` in `src/pages/index.astro`, crossfade/dimension-scale
figures): **Britain D ≈ 1.21** and **Norway D ≈ 1.52**. These are real,
published estimates, not invented:

- **Norway D ≈ 1.52** — J. Feder, *Fractals* (Plenum Press, 1988), applying
  Mandelbrot's divider (yardstick) method to the southern coast of Norway;
  widely cited as one of the highest measured coastline dimensions, which is
  the basis for the page's "world's highest-dimensional coastline" aside.
- **Britain D ≈ 1.21–1.25** — Mandelbrot's own 1967 estimate for the west
  coast of Great Britain is usually quoted as **1.25**; the page's 1.21
  figure is a commonly repeated variant (measured over the whole coastline
  rather than the west coast segment) and should be treated as an
  approximate, illustrative figure rather than a single authoritative
  number — consistent with the page's own point that a coastline's measured
  properties depend on which stretch and which convention are used.

Both act as a second, independent illustration of the same D-between-1-and-2
idea already established by the Koch snowflake and Sierpinski triangle — not
as a claim that Britain or Norway are exact fractals (the page says so
explicitly: "Coastlines aren't exact fractals — but they behave like them.").

## Published coastline length figures

Three real, differently-sourced measured lengths for Norway's coastline,
shown next to the three simplification tiers in the resolution scene
(`data-stage="18"`, `src/pages/index.astro`) as evidence that measured
length depends on convention, not as one "official" number:

- **25,148 km** — CIA World Factbook figure (mainland coastline 2,650 km
  plus fjords/islands/minor indentations 22,498 km).
  https://theodora.com/world_fact_book_2024/norway/norway_geography.html
- **28,953 km** — Statistics Norway's 2011 recalculation, mainland and
  fjords only, excluding islands.
- **100,915 km** — the same 2011 Statistics Norway recalculation,
  including all islands and fjords (the figure commonly cited as
  "enough to circle the Earth two and a half times").
  https://www.lifeinnorway.net/norway-coast/

Per the "Claims that must not appear" rule above, none of these three is
presented as the single correct figure — they are shown together,
increasing with granularity, to make the same point the interaction does.

## Interaction and accessibility sources

### W3C — Animation from Interactions

https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

Use for the requirement that non-essential interaction-triggered motion can be disabled.

### W3C — `prefers-reduced-motion` technique

https://www.w3.org/WAI/WCAG22/Techniques/css/C39

Use for the CSS reduced-motion implementation.

### MDN — Document scroll event

https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event

Use for scroll-event behaviour and the warning that high-frequency handlers must not perform expensive DOM work.

## Claims that must not appear

- `Norway's coastline is literally infinite.`
- `Every fractal has the same Hausdorff-dimension formula.`
- `A two-dimensional ruler cannot measure a higher-dimensional object in a plane.`
- `Integration cannot measure fractals.`
- `The Koch snowflake has a fixed diameter at every iteration.`
- `N(epsilon) * epsilon^s is, by itself, the complete definition of Hausdorff measure.`
- `The Koch boundary's zero 2D area is the same thing as the filled snowflake's enclosed area.`
- any numerical “official Norway coastline” value presented as uniquely correct.
