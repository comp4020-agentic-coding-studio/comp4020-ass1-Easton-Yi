# 后记 — Implementation Prompt

Status: historical implementation prompt, kept for record. It was executed,
then revised twice after shipping — the exact copy below ("every ruler
leaves something out" / "when our ruler does") was worded to "every
measurement leaves something out" / "where our measurement stops" during the
ruler-terminology correction, and the plain Norway-coastline background was
later replaced with a scroll-revealed dragon curve motif
(`src/lib/dragon.ts`, see `PROCESS.md`). Read the current source
(`#postscript-scene` in `src/pages/index.astro`) for what is actually
deployed; this file records the brief that started it.

Use this prompt only after the Norway question, Koch interaction, measurement readouts, and mathematical resolution are working and verified. This is a short final coda within the same continuous page, not a fourth explanatory topic.

## Purpose

Add one final full-viewport section after the explainer returns from the Koch snowflake to Norway. It should lift the existing idea into a restrained point of view:

> Measurement helps us make a complex world legible, but every measurement depends on what detail we choose to leave out.

Do not imply that science or measurement is futile. Do not claim that the physical world, Norway's coastline, or its beauty is literally infinite. The ending should feel reflective, not mystical, anti-scientific, or disconnected from the interaction the visitor just completed.

Hausdorff dimension must not be presented as Norway's "true length." It explains why ordinary length does not settle as measuring scale changes; it does not produce one final scale-independent coastline length.

## Placement and narrative transition

Place this section immediately after the existing resolution:

```text
Norway does not have one exact coastline length.
Every answer begins with a choice of scale.
```

As the visitor scrolls into the coda:

1. Keep the Norway coastline visible so the argument remains anchored to the opening question.
2. Let the final numerical length/readout and ruler marks fade away first.
3. Leave the coastline alone for a short visual pause.
4. Reveal the coda in three restrained text beats.

This transition must be driven by native vertical scroll. Do not add a new control, slider, carousel, formula, example, dataset, or interaction mechanic.

## Exact visitor-facing copy

All visible copy must remain English. Use:

```text
We use simple measures
to make a complex world legible.

But every ruler leaves something out.

The world does not run out of detail
when our ruler does.
```

Optional small section label:

```text
A postscript
```

Do not add another concluding paragraph. The final sentence must be the last substantial text on the page. Its reference to continuing detail carries the user's intended sense of complexity and beauty without making a literal claim of infinity.

## Visual direction

- Preserve the established mist, sky, fjord, foam, compass, and ink palette; do not introduce a new colour system.
- Use a quiet, nearly full-viewport composition with generous negative space.
- Keep one original Norway SVG coastline or a cropped portion of it as a fine background line. Do not introduce photography or a new illustration.
- The disappearing ruler/readout should communicate that the instrument has reached its limit while the coastline remains.
- Reveal the three text beats with opacity and a small vertical shift only. Avoid typewriter effects, liquid particles, parallax layers, or another cinematic sequence.
- Give the final two lines the strongest typographic emphasis, but keep the hierarchy consistent with the rest of the site.
- Do not add a mandatory end button. A quiet `Measure again` link may return to the opening only if the existing navigation pattern already supports it; it must not become a second call to action.

## Behaviour and implementation

- Implement the coda as a semantic `<section>` in the existing one-page document.
- Use `IntersectionObserver` or the project's existing scroll-state system to add three reveal classes once. Do not attach another expensive continuous scroll handler.
- Reveals are monotonic: once a line has appeared, scrolling slightly backward must not repeatedly hide and replay it.
- No essential meaning may depend on animation. With `prefers-reduced-motion: reduce`, show the complete coda immediately and remove the ruler/readout with a simple state change.
- Use relative sizing and a readable line length. Avoid fixed heights that clip when browser chrome changes on mobile.
- Preserve native scrolling, keyboard navigation, touch scrolling, and resize-mid-interaction behaviour.
- Do not load fonts, scripts, images, or data from an external runtime service.

## Acceptance checks

Do not call this section complete until all of the following are true:

- It appears after the mathematical resolution and still reads as the answer to the Norway question.
- The deployed copy exactly matches the approved English text above.
- It introduces no new mathematical concept, factual claim, example, or mechanic.
- It never says that measurement is futile, that Norway's coastline is literally infinite, or that Hausdorff dimension supplies a true coastline length.
- At `1920x1080` and `390x844`, all text is visible without horizontal overflow, collision, or clipping.
- Native wheel, trackpad, touch, `PageDown`, arrow-key, and space-bar scrolling can reach it.
- Resizing the browser while the coda is partly revealed leaves it in a coherent state.
- Reduced-motion mode presents the full meaning without delayed or large movement.
- Direct inspection confirms that the coastline remains visible after the numerical measurement disappears.

## Scope rule

If this coda weakens the clarity of the coastline conclusion, remove decorative motion before changing the copy or adding explanation. It should take roughly one calm viewport and a few seconds to read. Its job is to deepen the existing idea, not compete with it.
