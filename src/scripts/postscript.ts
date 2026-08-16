// Postscript coda (docs/EPILOGUE.md): the three text beats and the
// dragon-curve background all reveal once, monotonically, the same way
// the resolution does.
const section = document.querySelector<HTMLElement>("#postscript-scene");

if (section) {
  const items = Array.from(
    section.querySelectorAll<HTMLElement>(
      ".postscript-line[data-stage], .postscript-final[data-stage], .postscript-dragon-path[data-stage]",
    ),
  );
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
