// Small triangle next to "Britain's island" / "Norway" toggles that country's
// coastline dimension on click — a discrete, keyboard-operable disclosure
// (native <button>), not a hover tooltip, so it works at both marking
// viewports and under keyboard-only navigation. The reveal toggles via
// visibility, not hidden/display, so its line is always reserved — toggling
// one country's dimension must never reflow the other figure's position
// (they share a flex row aligned to the bottom).
const triggers = document.querySelectorAll<HTMLButtonElement>(".dimension-trigger");

for (const trigger of triggers) {
  const reveal = trigger.closest(".country-label")?.querySelector<HTMLElement>(".dimension-reveal");
  if (!reveal) continue;

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    reveal.classList.toggle("is-visible", !expanded);
  });
}

export {};
