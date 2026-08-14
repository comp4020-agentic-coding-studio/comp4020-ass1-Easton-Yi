import katex from "katex";

// Rendered server-side at build time (Astro frontmatter), so the deployed
// page needs only the bundled katex.min.css, never a client-side KaTeX
// runtime. output: "htmlAndMathml" gives a visual render plus an embedded
// MathML tree, which is what makes the formula legible to screen readers.
export function renderMath(tex: string, displayMode = true): string {
  return katex.renderToString(tex, {
    throwOnError: false,
    displayMode,
    output: "htmlAndMathml",
  });
}
