import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Concept-contract guard (CLAUDE.md "Concept contract"). Runs against the
// BUILT site, so it checks what actually ships. This is a guardrail against
// regression, not a claim that the copy is finished: the primary-conclusion
// check below can pass on a paraphrase of the target sentence, because
// aligning the exact deployed wording to the corrected hierarchy is content
// work for a later increment, not this one.

const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;
const h1 = doc.querySelector("h1");
const pageText = doc.body.textContent ?? "";

// Fingerprint of the superseded thesis: "Hausdorff dimension is the
// critical exponent that makes [scale-based] measurement stable [...]".
// Hausdorff dimension may still appear as a secondary explanation — it must
// never again be staged as the page's opening/primary claim.
const SUPERSEDED_THESIS = /makes\s+(?:scale-based\s+)?measurement\s+stable/i;

// The primary conclusion: a coastline has no single length until the
// measuring scale and convention are specified. Matched loosely (concept,
// not exact wording) so it survives future copy edits that keep the idea.
const PRIMARY_CONCLUSION = /(no single|not a single|incomplete without).{0,80}scale.{0,40}convention/is;

describe("concept contract", () => {
  it("does not stage the superseded thesis as the page's top-level heading", () => {
    expect(h1).toBeTruthy();
    expect(h1!.textContent ?? "").not.toMatch(SUPERSEDED_THESIS);
  });

  it("states the primary conclusion somewhere on the page: a coastline has no single length without a stated scale and convention", () => {
    expect(pageText).toMatch(PRIMARY_CONCLUSION);
  });
});
