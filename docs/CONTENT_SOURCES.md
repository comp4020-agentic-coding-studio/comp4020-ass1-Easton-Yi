# Content, Mathematics, and Sources

## Site copy deck

All deployed text must be English. Internal comments and evidence files may follow course requirements, but the visitor-facing experience uses only the copy below unless a revision is explicitly approved against the concept contract.

### Intro

```text
Before we begin, consider one question...

How long is Norway's coastline?
```

Compass accessible name:

```text
Begin the journey
```

### Koch stage

```text
Meet the Koch snowflake.

Scroll to look closer.

Every segment becomes four. Each new segment is one third as long.

Measure it as a line: the total grows by 4/3 at every step.

Measure the boundary as area: the total shrinks toward zero.

Between length and area is one exponent that stays stable.

That exponent is the curve's Hausdorff dimension.
```

Instrumentation labels:

```text
Iteration
Segments
Cover scale
1D measure
Critical measure
2D measure of the boundary
```

### Resolution

```text
Length says infinity. Area says zero. Dimension tells us which measure fits.

M_s(epsilon) = N(epsilon) * epsilon^s

Four copies, each scaled to one third.

D = log(4) / log(3) ~= 1.262

Below D, the scale-weighted measure explodes. Above D, it vanishes. D is the critical exponent between a line (1) and a plane (2).

Cover the set with pieces no larger than delta, choose the cheapest such cover, then let delta shrink. The critical exponent is its Hausdorff dimension.

Norway is not a perfect mathematical fractal. But the same measurement problem returns: a smaller step follows more detail, so a coastline length is incomplete without its scale and convention.

The ruler is part of the answer.
```

### Optional source footer

```text
Concept sources: Mandelbrot (1967) and Wolfram MathWorld. Map silhouette derived from Natural Earth public-domain vector data.
```

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
