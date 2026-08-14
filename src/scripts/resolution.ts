// Act 3 (docs/PROJECT_BRIEF.md): the resolution reveals once, monotonically,
// as the visitor scrolls into it — no continuous scroll handler, matching the
// guidance in docs/EPILOGUE.md for the same kind of static reveal.
const section = document.querySelector<HTMLElement>("#resolution-scene");

if (section) {
  const items = Array.from(section.querySelectorAll<HTMLElement>("[data-stage]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    for (const item of items) item.classList.add("revealed");
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );
    for (const item of items) observer.observe(item);
  }
}
