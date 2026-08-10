## ASSIGNMENT 1 — FULL SPECIFICATION & REQUIREMENTS

  Source: /assessments/assignment-1/  (+ /topics/assessment/, /topics/ai-use-and-integrity/)
  Fetched: 2026-08-10

==================================================================

  --- KEY FACTS ---
  Weight:         20% of course grade
  Week:           4
  Due:            noon, Monday 17 August 2026
                  Exact timestamp: 2026-08-17T12:00:00+10:00 (Australia/Canberra)
                  15-minute grace period. NO LATE SUBMISSIONS — a missed deadline
                  scores zero.
  Marks returned: 28 August 2026 (before the 31 Aug census/drop date)
  Individual:     Yes — this is an individual assessment
  Repo prefix:    comp4020-ass1

  --- THE BRIEF ---
  "Build an interactive explainer of something you think more people should
  know or understand."

  - Topic is yours: a phenomenon, a system, a piece of maths, how something
    you care about actually works.
  - Genre discipline: ONE strong idea, ONE dataset or mechanic, and nothing else.
  - "Interactive" must do real work — the visitor has to DO something, not
    only read.
  - Any register works (earnest, playful, polemical); marks go to strength of
    idea + judgement in scoping it.
  - Must be static, client-side, deployed to GitHub Pages.
  - Marks lean toward process/response over polish this early — a
    rough-but-legible prototype with a point of view scores well.
  - Keep the week-4 retro in mind: you'll give a short demo + describe the
    breakthrough that made it click.

  Exemplars cited (one idea, one mechanic, nothing else):
    The Deep Sea · Spend Bill Gates' Money · Absurd Trolley Problems ·
    Film Dialogue · Human Terrain · Elevators · Mechanical Watch (Bartosz
    Ciechanowski)

  --- CHECKABLE SPEC LINES (from the assignment node's `spec` array) ---
  1. Deployed and live at its public GitHub Pages URL by the deadline.
  2. Static and client-side throughout; the starter's invariant checks pass.
  3. Works at BOTH marking viewports (desktop 1920x1080 and phone 390x844).
  4. The visitor does something that changes what they see — the core
     interaction must be stated plainly enough to write a test for it.
  5. One strong idea with a point of view, and nothing else.
  6. Evidence of process is in the repo: PROCESS.md, CLAUDE.md,
     reflections/assignment-1.md, and a commit history that grew with the work.

  --- WHAT YOU SUBMIT ---
  1. The DEPLOYED PROTOTYPE (GitHub Pages URL) — this is what actually gets
     marked, live in Chrome.
  2. The SOURCE REPOSITORY — how markers read your code.
  3. EVIDENCE OF PROCESS:
     - PROCESS.md — 400–600 words, EXACTLY three or four cited moments
       (not more). Each moment must say what you did *instead of* the
       obvious thing, and how you knew the result was right.
       * Strongest moments: a correction that landed in the HARNESS
         (a CLAUDE.md rule, a wired-up check, a thrown-away attempt) rather
         than just a retry. Retrying-until-pass is routine; changing what
         the work runs against is the skilled move.
     - CLAUDE.md — your evolving harness.
     - reflections/assignment-1.md — 150–300 words. This IS the material
       you'll present at the week-4 retro; nothing to write twice.
     - Commit history — incremental, not a last-minute dump. Citations in
       PROCESS.md must resolve to real commits (`pnpm check:evidence`
       verifies this).

  --- MARKING (100 pts per criterion, weighted) ---
  | Criterion               | Weight |
  |--------------------------|-------|
  | Legibility of process    | 45%   |
  | Working deployed artefact| 20%   |
  | Response to the brief    | 35%   |

  Bands: HD 80–100 · D–Cr 60–79 · P 50–59 · N <50

  Legibility of process:
    HD  — corroborated & skilled: failures diagnosed/fixed at harness level
          (not just retried), output verified before acceptance, judgement
          visible in what was thrown away.
    D–Cr— corroborated & competent: real process shown, but routine
          (attempt/accept/repeat), or evidence has thin spots.
    P   — process asserted, not shown; claims uncited or weak.
    N   — no real evidence, or record contradicts the account.

  Working deployed artefact:
    HD  — holds up under unplanned use (keyboard, resize mid-interaction,
          slow connection).
    D–Cr— deployed, live, does what the brief asks at both viewports.
    P   — notable gaps: core interaction unreliable, or one viewport broken.
    N   — doesn't deploy, or doesn't work.
    (Marker opens the live URL at both viewports, uses the core interaction
     for a minute, resizes mid-use, tabs through it.)

  Response to the brief:
    HD  — pointed, surprising answer; one idea, carried all the way.
    D–Cr— well-scoped, real idea, minor drift.
    P   — meets brief loosely; over/under-scoped, or no point of view.
    N   — off-brief.

  --- HARD RESTRICTIONS / NON-NEGOTIABLES ---
  - No late submissions of any kind (only 15-min grace period).
  - Extensions must be requested via the ANU extension app BEFORE the
    deadline (longer cases → formal ECA process). None after the fact.
  - Repos start PRIVATE; must be flipped public (via /ship) before the
    cutoff — CI checks are skipped while private.
  - Custom domains are NOT allowed for the submission URL.
  --- MARKING (100 pts per criterion, weighted) ---
  | Criterion               | Weight |
  |--------------------------|-------|
  | Legibility of process    | 45%   |
  | Working deployed artefact| 20%   |
  | Response to the brief    | 35%   |

  Bands: HD 80–100 · D–Cr 60–79 · P 50–59 · N <50

  Legibility of process:
    HD  — corroborated & skilled: failures diagnosed/fixed at harness level
          (not just retried), output verified before acceptance, judgement
          visible in what was thrown away.
    D–Cr— corroborated & competent: real process shown, but routine
          (attempt/accept/repeat), or evidence has thin spots.
    P   — process asserted, not shown; claims uncited or weak.
    N   — no real evidence, or record contradicts the account.

  Working deployed artefact:
    HD  — holds up under unplanned use (keyboard, resize mid-interaction,
          slow connection).
    D–Cr— deployed, live, does what the brief asks at both viewports.
    P   — notable gaps: core interaction unreliable, or one viewport broken.
    N   — doesn't deploy, or doesn't work.
    (Marker opens the live URL at both viewports, uses the core interaction
     for a minute, resizes mid-use, tabs through it.)

  Response to the brief:
    HD  — pointed, surprising answer; one idea, carried all the way.
    D–Cr— well-scoped, real idea, minor drift.
    P   — meets brief loosely; over/under-scoped, or no point of view.
    N   — off-brief.

  --- HARD RESTRICTIONS / NON-NEGOTIABLES ---
  - No late submissions of any kind (only 15-min grace period).
  - Extensions must be requested via the ANU extension app BEFORE the
    deadline (longer cases → formal ECA process). None after the fact.
  - Repos start PRIVATE; must be flipped public (via /ship) before the
    cutoff — CI checks are skipped while private.
  - Custom domains are NOT allowed for the submission URL.
  - Deployed site (not local/repo state) is what's marked — "works on my
    machine" doesn't count.
  - CI must be green at the sweep, 15 minutes after cutoff — still running
    counts as not green. Green checks there are worth half the shipped mark.
  - Appeals cover marker error only, not dissatisfaction with a fairly
    applied mark — a re-mark can go up, stay same, or go DOWN.
  - Never commit secrets/credentials (pre-commit hook + CI secrets scan
    enforce this).

  --- AI USE & ACADEMIC INTEGRITY (course-wide policy, applies to A1) ---
  - Using LLM/agentic coding tools is the point of the course — no need to
    cite models/prompts; every submission is presumed human-AI collaboration.
  - BUT you must be able to explain/justify/modify any part of your work on
    request in a crit or by a marker.
  - Integrity rests on your PROCESS.md/reflection being a TRUTHFUL account —
    a false account (repo history vs. your stated process disagreeing) is
    the actual breach, not "using AI."
  - Building on a PEER's PUBLIC work is allowed only if (a) it was public
    when you took it (repos are private during the assignment, so nothing
    of peers' is takeable mid-assignment) and (b) PROCESS.md names what was
    taken and why.
  - No text-matching/AI-detection tools are used; don't rely on being
    "undetected" — integrity is checked via your process account vs. the
    actual repo/API log trail.
  - Suspected breaches go to the College academic integrity committee.