Simplify the deployed explainer by removing the mathematical lecture section and making the conclusion emerge directly from the visual interaction.

The current resolution scene is too dense and disconnected. It contains multiple equations, explanatory paragraphs, a collapsed “Formal definition” control, a Norway disclaimer, and then a large concluding slogan. Although mathematically accurate, this structure feels like a textbook and interrupts the visual narrative.

The visitor should not need to study several formulas to understand the one idea.

## 1. Update CLAUDE.md before implementation

Add these durable scope and communication rules:

- The deployed experience is an interactive explainer, not a mathematical lecture.
- If a concept requires a paragraph to understand, first improve the visual explanation.
- No visitor-facing paragraph in the main interaction may exceed approximately 12 words.
- Do not show formal mathematical definitions in the deployed primary path.
- Do not add collapsed “extra theory” panels merely to preserve mathematical completeness.
- Mathematical proofs and formal definitions belong in CONTENT_SOURCES.md, tests, code comments, and crit preparation.
- The deployed page may show at most one mathematical result after the interaction.
- Hausdorff dimension must emerge from the observed scaling behaviour; it must not interrupt the experience as a separate lesson.
- The visual transition must carry the visitor from Koch back to Norway without an unrelated text-only lecture scene.
- Accept the change only after direct inspection at 1920x1080 and 390x844.

Do not fabricate PROCESS.md or reflection content. A factual working-log entry may record that the multi-formula resolution was rejected because it required several unexplained mode changes and obscured the primary idea.

## Global correction of the “ruler” misunderstanding

Perform a complete audit of all visitor-facing text, accessible labels, headings, readouts, and explanatory copy.

Search for every occurrence of:

- `ruler`
- `ruler size`
- `smaller ruler`
- `shrinking the ruler`
- `ruler shrinks`
- `steps of length ε`
- `The ruler is part of the answer`

Do not leave any unexplained visitor-facing use of the ruler metaphor.

The deployed experience must use this definition instead:

“Measurement resolution determines the smallest detail represented in the current outline.”

Use this plain-English version in the interaction:

“Details below this size are ignored.”

Define ε internally as:

`ε = the detail threshold of the current approximation`

Visitor-facing terminology:

- replace `RULER (ε)` with `SMALLEST DETAIL COUNTED`;
- replace `smaller ruler` with `finer resolution`;
- replace `ruler shrinks` with `the detail threshold becomes smaller`;
- replace `more steps are needed` with `more boundary segments are retained`;
- replace `The ruler is part of the answer` with `What we choose to ignore is part of the answer`;
- replace `every ruler leaves something out` with `every measurement leaves something out`.

At the first Koch state, before the visitor scrolls, show:

`SMALLEST DETAIL COUNTED`

and immediately beneath it:

`Details below this size are ignored.`

The visitor must not need to infer this definition from later formulas or paragraphs.

Visually prove the definition:

- faint line = finer boundary detail that exists in the reference;
- bright line = the detail retained by the current measurement;
- at coarse resolution, the bright line cuts across faint smaller bends;
- as resolution becomes finer, more of the faint geometry becomes part of the bright measured outline;
- measured length increases at the same time.

Do not draw a physical ruler icon or map-scale bar. That would reinforce the incorrect interpretation.

Add an automated rendered-content check that fails if the deployed main experience still contains the word `ruler`, unless a future approved sentence explicitly defines the metaphor before using it.

Add acceptance checks confirming:

1. `SMALLEST DETAIL COUNTED` is visible.
2. `Details below this size are ignored.` appears before the first scroll.
3. Fine omitted detail and bright retained detail are simultaneously visible.
4. The measured length increases as the detail threshold decreases.
5. No visitor-facing text asks the visitor to understand an undefined ruler metaphor.

## 2. Remove the mathematical lecture stack

Remove all of the following from the deployed visitor path:

- `L(ε) = N(ε)ε`
- `N(ε) ∝ ε^(-D)`
- `L(ε) ∝ ε^(1-D)`
- `ε ↓ ⇒ L(ε) ↑`
- `M_s(ε) = N(ε)ε^s`
- the covering-sum explanation paragraph;
- the “Below D / Above D” paragraph;
- the `Formal definition` disclosure;
- the full formal Hausdorff definition;
- disclaimers explaining that the covering sum is not the formal definition.

Do not delete the underlying mathematics from tests or source documentation. The implementation must remain mathematically correct even though the proof is not deployed.

Remove any unused KaTeX code or assets only if no deployed mathematical notation still requires them and doing so does not affect existing checks.

## 3. Keep the Koch interaction visual

The Koch scene should teach the idea through changing geometry, not paragraphs.

Use the current bright approximation over a faint fine-detail reference.

Use no more than these staged lines:

Stage 0:

“Smaller details are ignored.”

Stage 1:

“Keep more detail.”

Stage 2:

“The measured boundary gets longer.”

Stage 3:

“For this curve, new detail never ends.”

Stage 4:

“So its ordinary length never settles.”

Each line should be short, visually connected to the current geometry, and revealed by the existing native scroll interaction.

Do not display all five lines as a paragraph stack. Retain at most the current statement and one immediately previous statement, or otherwise use a clear progressive hierarchy.

The two primary readouts are:

`SMALLEST DETAIL COUNTED`

and

`MEASURED LENGTH`

Keep iteration and segment count as quiet secondary information.

Move critical measure and 2D measure out of the main visible dashboard. They may remain in tests and internal calculations.

## 4. Replace formulas with one visual dimension reveal

At the end of the Koch interaction, do not enter a text-heavy formula section.

Keep the Koch geometry visible and reveal:

“This growth of detail is described by dimension.”

Then show a simple visual scale:

`1 — line`

`1.26 — Koch boundary`

`2 — plane`

The scale should be graphical: a horizontal line with a marker at 1.26, not a paragraph and not a formula card.

Label the marker:

`Hausdorff dimension: 1.26`

Do not show `D = log(4) / log(3)` in the deployed main path.

The visitor needs to understand what 1.26 means — between a line and a plane — not reproduce the logarithmic calculation.

## 5. Make the return to Norway a visual transition

Do not finish the mathematics and then abruptly insert a Norway paragraph.

From the dimension reveal:

1. keep the Koch boundary visible;
2. fade the 1–2 dimension scale;
3. crossfade or morph the Koch outline into the Norway coastline;
4. keep the same visual anchor and camera position where practical;
5. reveal the real-world qualification only as the Norway geometry appears.

Use:

“Norway is not a perfect fractal.”

Then:

“But every coastline length depends on which details count.”

Do not place these sentences in a conventional paragraph block. Associate them directly with the returning Norway coastline.

The transition should make the visitor feel that the mathematical model is being carried back to the opening question.

## 6. Replace the current conclusion

Remove:

“The ruler is part of the answer.”

Replace it with:

“What we choose to ignore
is part of the answer.”

This statement should be visually earned by the preceding transition:

- fine details were visible;
- coarse measurement ignored them;
- retaining them increased the measured length;
- the same idea returned to Norway.

Do not place a paragraph immediately above this statement. Give it one quiet viewport or a strong region of negative space.

## 7. Simplify the postscript

Keep:

“We use simple measures
to make a complex world legible.”

Replace:

“But every ruler leaves something out.”

with:

“But every measurement leaves something out.”

Replace the final line with:

“The world does not run out of detail
where our measurement stops.”

Do not add any further explanation.

## 8. Maintain one continuous visual argument

The final page should feel like this single continuous sequence:

1. Norway question.
2. Which details count?
3. Koch approximation retains progressively finer detail.
4. Measured length grows.
5. For Koch, detail never ends.
6. Dimension 1.26 names that scaling behaviour.
7. Koch visually returns to Norway.
8. Every coastline length depends on which details count.
9. What we ignore is part of the answer.
10. Short postscript.

Do not add new routes, sliders, examples, definitions, formula cards, accordions, or galleries.

## 9. Acceptance criteria

The change is not complete until:

- there is no `Formal definition` control in the deployed page;
- no formula lecture stack remains;
- the main concept can be understood without reading a paragraph;
- the Koch interaction visibly demonstrates ignored versus retained detail;
- the visitor sees measured length grow;
- only one mathematical result remains: Hausdorff dimension 1.26;
- 1.26 is shown visually between line dimension 1 and plane dimension 2;
- the Koch-to-Norway transition is visual rather than a sudden paragraph change;
- the conclusion is `What we choose to ignore is part of the answer.`;
- no main-path paragraph exceeds approximately 12 words;
- the page works at 1920x1080 and 390x844;
- backward scroll, keyboard scroll, touch scroll, resize mid-interaction, and reduced motion still work;
- all course, build, evidence, and link checks pass.

Stop and report:

- deployed content removed;
- visitor-facing word count before and after;
- visual replacement for the formulas;
- how Koch transitions back to Norway;
- CLAUDE.md changes;
- checks and exact outcomes;
- viewports inspected;
- remaining uncertainty;
- proposed commit message.

Do not commit automatically unless the established repository workflow explicitly permits it.