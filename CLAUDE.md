# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

What you're building this week — the spec — is published on the course website,
and this repo's name tells you which deliverable it is. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the spec before you build,
and see `spec/README.md` for how the checks in this repo relate to it.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  own spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **accessibility** or **performance** --- wiring those
sensors (`axe-core`, Lighthouse, or whatever you choose) is your work, and later
in the course the spec will ask you to show how you tested both. When you do,
read a green performance result honestly: it's a lab estimate from one run on a
CI machine, not proof the site is fast for real users.

## The stack is swappable

Out of the box this is plain HTML/CSS/TypeScript on Vite, and every `.html` file
in the repo is a page: add pages, link them, and the build picks them up with no
config. That's a default, not a rule (unless the week's spec says otherwise).
You can swap in Astro or any other static generator, because nothing in CI names
a tool --- the whole contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.

## Assignment 1 project references

**Note:** Brain_storming.md(if exists) is just for me to open mind, and is not(should not) be referenced during project implementation anymore further. Ignore it.

Before planning or implementing the site, read:

- `docs/PROJECT_BRIEF.md` — authoritative redesign, content and implementation brief
- `docs/CONTENT_SOURCES.md` — verified facts, URLs, image licences and check dates

Use `docs/ASS_QA_NOTES.md` only when working on `PROCESS.md`,
`reflections/ass-1.md`, design rationale or assignment preparation.

Final check for the repo according this project text requirments/specification, in `spec/Ass1_spec.md`.

Do not invent facts, events, user experiences or agent corrections.
The repository starter contract and course checks take precedence.

## Assignment 1 prototype: operational rules

### Direct orders 
Direct orders in the prompt should be exacuted/achieved without further changes or redesign. 
Direct orders include "change ... to ..." liked short imperatives.

### Concept contract (do not drift from this)

The site's concept has three tiers, in a strict priority order — never let a
lower tier read as the page's opening thesis:

1. **Primary idea (what the page opens with):** the smaller the ruler, the
   longer the measured coastline becomes.
2. **Primary conclusion (what the page must leave the visitor with):** a
   coastline has no single length until the measuring scale and convention
   are specified.
3. **Secondary mathematical explanation (support, never the opening
   claim):** Hausdorff dimension does not give Norway one true length; for
   an exact fractal such as the Koch curve, it describes how measurement
   scales as the ruler shrinks.

Norway's coastline is the everyday question, the Koch snowflake is the exact
model, and Hausdorff dimension explains *why* the model behaves as it does —
it is the explanation, never the thesis. One mechanic: native vertical
scroll through reversible Koch construction/zoom states.

Operational rules that follow from this hierarchy:

- the visible interaction must demonstrate the ruler scale decreasing and
  the measured length increasing — that pairing is the primary idea, and
  it must read clearly before Hausdorff dimension is introduced;
- Hausdorff dimension is explanatory support and must never be staged as
  the page's opening thesis or its first claim;
- never state or imply that Norway's coastline is literally infinite;
- raw ASCII/code-style mathematics (bare `<pre>`-style text such as
  `H^s_delta(F) = inf sum_i diam(U_i)^s`) is not acceptable in the deployed
  UI — render mathematics as legible typography, not source-code-shaped
  text;
- every acceptance claim requires inspection at both marking viewports,
  **1920×1080** and **390×844** (see "Marking viewports" below);
- a claim of success requires `pnpm check` passing *and* direct visual
  inspection — a green check alone is never sufficient (see "Verifying
  claims" below);
- the word "ruler" is fine to use freely in deployed text now — the page
  carries a standing plain-language definition (the closing gloss: "By
  'ruler,' we mean the smallest length you measure with."), and
  `spec/ruler-audit.test.ts` only checks that this definition exists
  somewhere on the page, not that each individual use is annotated. The
  original problem was an *unexplained* ruler; that's already fixed and
  durable, so don't re-litigate this on every edit.

Explicitly excluded — never add these regardless of how the page looks once
built: a fractal gallery, a horizontal carousel, a second
coastline-measurement simulator, a 3D Menger sponge, a Mandelbrot explorer,
extra user-facing parameter controls, or a claim that Norway's coastline is
literally infinite. `M_s(n) = N_n * epsilon_n^s` is the construction-aligned
covering sum, not the full formal Hausdorff measure — always say so when it
appears. All visitor-facing text is English.

### Marking viewports

Every visual check happens at both **1920×1080** (desktop) and **390×844**
(phone). Both count in full — a broken phone layout is not a partial pass.

### Explainer scope discipline

- The deployed experience is an interactive explainer, not a mathematical
  lecture.
- If a concept requires a paragraph to understand, first improve the visual
  explanation.
- No visitor-facing paragraph in the main interaction may exceed
  approximately 12 words.
- Do not show formal mathematical definitions in the deployed primary path.
- Do not add collapsed "extra theory" panels merely to preserve mathematical
  completeness.
- Mathematical proofs and formal definitions belong in CONTENT_SOURCES.md,
  tests, code comments, and crit preparation.
- The deployed page may show at most one mathematical result after the
  interaction: Hausdorff dimension ≈ 1.26.
- Hausdorff dimension must emerge from the observed scaling behaviour; it
  must not interrupt the experience as a separate lesson.
- The visual transition must carry the visitor from Koch back to Norway
  without an unrelated text-only lecture scene.

### Command required before accepting any change

Run `pnpm check` (typecheck → build → oxlint → stylelint → vitest, including
`spec/koch.test.ts` and `spec/concept-contract.test.ts`) and treat a non-zero
exit as blocking. Never tell the
user something works because the code "should" work — an agent's claim of
success is not accepted without this command actually passing, and for
anything visual, without a real rendered screenshot or `agent-browser`
inspection at both marking viewports (see below).

### Non-negotiable behavioural requirements

- Keyboard-only scrolling (PageDown, Space, arrow keys) must reach and drive
  every state; there is no mouse-only path.
- Resizing mid-interaction must preserve the logical `currentIteration`, not
  just the visual camera position.
- `prefers-reduced-motion: reduce` must remove camera/divider/tide motion but
  keep every discrete state and all explanatory copy reachable.
- No horizontal overflow at either marking viewport, ever — check
  `document.documentElement.scrollWidth <= clientWidth` doesn't regress.
- The production build must work from the GitHub Pages base path
  (`/comp4020-ass1-Easton-Yi/`, set in `astro.config.ts`); never hardcode an
  absolute `/`-rooted asset path.

### Verifying claims

Playwright's Chromium (`npx playwright install chromium`, no `--with-deps`
needed here) is available for direct visual inspection when `agent-browser`
isn't reachable: launch it, set the viewport, screenshot, and actually look at
the image before saying a visual change works. A CSS value that looks
plausible (e.g. a stroke-width meant for viewBox units alongside
`vector-effect="non-scaling-stroke"`) can silently render invisible geometry
that every automated check still passes — automated checks and visual
inspection are complementary, not substitutes for each other.
