import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Ruler-metaphor audit (docs/Refine_Explanations.md "Global correction of
// the ruler misunderstanding"). Runs against the BUILT site, so it checks
// what actually ships. The metaphor may be used — the original correction
// was against an *unexplained* "ruler", not the word itself — but only if a
// plain-language definition of it is also shipped somewhere on the page.

const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;
const pageText = doc.body.textContent ?? "";

const RULER_DEFINITION = /ruler,?[^.]{0,20}we mean the smallest length you measure with/is;

describe("ruler audit", () => {
  it("only uses 'ruler' when the metaphor is explicitly defined in plain language", () => {
    if (/\bruler\b/i.test(pageText)) {
      expect(pageText).toMatch(RULER_DEFINITION);
    }
  });

  it("shows the smallest-detail-counted readout and its plain-English definition", () => {
    const dt = Array.from(doc.querySelectorAll(".koch-readout dt")).find((el) =>
      /smallest detail counted/i.test(el.textContent ?? ""),
    );
    expect(dt, "expected a 'Smallest detail counted' readout label").toBeTruthy();

    const caption = doc.querySelector(".koch-readout-caption");
    expect(caption?.textContent ?? "").toMatch(/details below this size are ignored/i);
  });

  it("renders the definition statically, reachable before any scroll or JS reveal", () => {
    const caption = doc.querySelector(".koch-readout-caption");
    expect(caption).toBeTruthy();
    expect(caption?.closest("[data-stage]")).toBeNull();

    const readoutScale = doc.querySelector(".koch-readout-scale");
    expect(readoutScale?.closest("[data-stage]")).toBeNull();
  });

  it("draws a faint reference outline and a bright measured outline simultaneously", () => {
    expect(doc.querySelector("#koch-path-reference")).toBeTruthy();
    expect(doc.querySelector("#koch-path")).toBeTruthy();
  });
});
