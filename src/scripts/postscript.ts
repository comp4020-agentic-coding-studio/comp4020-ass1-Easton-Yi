// Postscript coda (docs/EPILOGUE.md): reveals its three text beats once,
// monotonically, the same way the resolution does — no new scroll handler.
const section = document.querySelector<HTMLElement>("#postscript-scene");

if (section) {
  const items = Array.from(section.querySelectorAll<HTMLElement>("[data-stage]"));
  const readout = section.querySelector<HTMLElement>("#postscript-readout");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    readout?.classList.add("faded");
    for (const item of items) item.classList.add("revealed");
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // docs/EPILOGUE.md: the readout fades first, then the text beats
          // reveal in sequence (see the transition-delay steps in global.css).
          readout?.classList.add("faded");
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.35 },
    );
    for (const item of items) observer.observe(item);
  }

  const again = section.querySelector<HTMLAnchorElement>("#measure-again");
  const introScene = document.querySelector<HTMLElement>("#intro-scene");
  again?.addEventListener("click", (event) => {
    if (!introScene) return;
    event.preventDefault();
    introScene.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
  });
}

export {};
