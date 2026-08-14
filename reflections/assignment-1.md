# Assignment 1 reflection

**The breakthrough that moved the work forward** was realising that the
green checks and the rendered page were telling me two different things, and
that I had to trust the render over the checks. Twice --- the invisible
stroke-width bug and the `overflow-x: hidden` sticky breakage --- `pnpm check`
stayed fully green while the actual page was broken at both marking
viewports: empty boxes where a snowflake should be, then a scene that
wouldn't scroll at all. Neither bug was a logic error a type checker or a
unit test could see; both were about what a real browser does with real CSS.
Once I stopped treating a green `pnpm check` as "done" and started
screenshotting every visual increment before accepting it, I started finding
bugs before they shipped instead of after. That habit is what let the later
increments (narrative shell, postscript, visual refinement) go in cleanly:
each one got the same real-viewport check as a matter of course, not as a
recovery step after something broke.

**What this changed about the developer I want to be** is a sharper sense of
which failures automation can and can't see, and enough patience to check the
kind it can't. It's tempting to treat a passing test suite as the finish
line, especially under time pressure, but this project made concrete how much
of a rendered, interactive page --- stroke rendering, sticky positioning,
scroll-driven state --- lives entirely outside what `tsc`, a linter, or a
mocked test can observe. I want to keep building the habit of asking "what
would this check actually catch" before trusting it, and reaching for a real
render, a real browser, a real click, whenever the honest answer is "not
this."
