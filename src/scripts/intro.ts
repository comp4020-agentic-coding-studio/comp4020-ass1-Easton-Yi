// Act 1 (docs/PROJECT_BRIEF.md): the intro is a normal, non-sticky section —
// scrolling past it always works, so this script only handles the optional
// staged reveal and the compass shortcut, never scroll-jacking.
const scene = document.querySelector<HTMLElement>("#intro-scene");
const ideaScene = document.querySelector<HTMLElement>("#idea-scene");
const compass = document.querySelector<HTMLButtonElement>("#compass-button");

if (scene && ideaScene && compass) {
  const lines = Array.from(scene.querySelectorAll<HTMLElement>(".intro-line"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let completed = false;
  const timers: number[] = [];

  function reveal(): void {
    for (const line of lines) line.classList.add("shown");
    compass!.classList.add("ready");
  }

  function complete(): void {
    if (completed) return;
    completed = true;
    for (const timer of timers) window.clearTimeout(timer);
    reveal();
  }

  if (reduceMotion.matches) {
    complete();
  } else {
    timers.push(window.setTimeout(() => lines[0]?.classList.add("shown"), 0));
    timers.push(window.setTimeout(() => lines[1]?.classList.add("shown"), 1200));
    timers.push(window.setTimeout(complete, 3200));
  }

  // Click/tap anywhere in the intro skips straight to the revealed state.
  scene.addEventListener("click", (event) => {
    if (event.target === compass) return;
    complete();
  });

  function goToIdea(): void {
    ideaScene!.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    const title = ideaScene!.querySelector<HTMLElement>(".idea-title");
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus();
    }
  }

  // A native <button> already activates on both Enter and Space.
  compass.addEventListener("click", goToIdea);
}
