// A short standalone beat between the intro question and the Koch
// construction: the label "The Simple Idea" crossfades through the two
// halves of the primary idea once the section scrolls into view. One-shot,
// like resolution.ts — it never replays or ties to scroll position.
const scene = document.querySelector<HTMLElement>("#idea-scene");

if (scene) {
  const title = scene.querySelector<HTMLElement>('[data-idea="title"]');
  const line1 = scene.querySelector<HTMLElement>('[data-idea="1"]');
  const line2 = scene.querySelector<HTMLElement>('[data-idea="2"]');
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function play(): void {
    // Under reduced motion, CSS alone shows both idea-line paragraphs
    // stacked and static (title hidden) — no timers, no crossfade.
    if (reduceMotion.matches) return;

    title?.classList.add("shown");
    window.setTimeout(() => title?.classList.remove("shown"), 1400);
    window.setTimeout(() => line1?.classList.add("shown"), 1700);
    window.setTimeout(() => line1?.classList.remove("shown"), 3600);
    window.setTimeout(() => line2?.classList.add("shown"), 3900);
  }

  if (!("IntersectionObserver" in window)) {
    play();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(scene);
  }
}

export {};
