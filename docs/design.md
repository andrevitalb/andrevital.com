# Design foundation

The tokens in `app/globals.css` `@theme` are the contract for every unit after U3.
Settled in the U3 design pass on 2026-08-28 and approved by André against Home and
About comps in both themes.

## Register

Editorial and typographic. One left-aligned column, hairline rules, no cards, no
eyebrows, no icon font, no decorative gradients. The site is deliberately quiet
because the three things that carry it visually all land later: the logo
draw-and-dock (U4), Work entries with real screenshots (U6) and live Craft demos
(U7). Density arrives with content, not with chrome.

References for the register: rauno.me, paco.me, emilkowal.ski.

## Color

One accent, descended from the 2022 site's aqua (`#09FBCC`) but desaturated so it
passes WCAG AA as link, hover and focus color on both grounds. Neutrals carry a
slight cool bias toward the accent. No pure black, no pure white.

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--color-bg` | `#0f1214` | `#f5f7f6` |
| `--color-bg-2` | `#15191c` | `#eceeed` |
| `--color-fg` | `#e8ecec` | `#151a1a` |
| `--color-fg-2` | `#98a2a2` | `#5b6565` |
| `--color-line` | `#242b2d` | `#d8dedc` |
| `--color-accent` | `#63d4bf` | `#0e7c69` |
| `--code-bg` | `#15191c` (`--bg-2`) | `#f5f7f6` (`--bg`) |

The accent is reserved for links (underline on hover), focus rings and the current
nav item. It is never a fill.

`--code-bg` is the code-block surface, and the only token that is not part of the
palette proper. It exists because it carries text this site does not choose: shiki
paints post code with a theme's colors, so the surface has to satisfy that theme's
contrast assumptions rather than the site's. It is not mapped into `@theme`, because
nothing addresses it as a Tailwind class; only the `.prose` rules use it.

In dark it takes `--bg-2`'s value, a recessed surface. In light it takes `--bg`'s, so
a code block in light mode is the page color and is defined by its `--line` border
alone rather than by a fill. That asymmetry is forced, not stylistic. Every bundled
shiki light theme is authored against a white page: measured against the tokens this
site actually renders, **none of the 21** clears WCAG AA on `--bg-2` (`#eceeed`), and
`github-light-high-contrast` (the best of them, and the one paired with
`github-dark-default` here) needs `#f5f7f6` or lighter. So in light mode the code
surface cannot be darker than the page, and a fill is not available. Its worst
rendered token sits at 4.68:1 on `--bg`.

The two foregrounds in that theme that fail on any surface, `carriage-return` and
`markup.ignored`, are git-diff decorations the theme pairs with their own background
overrides, and they fail equally on pure white. So white would buy no real headroom
over `--bg`, which is why the palette keeps its no-pure-white rule.

The mark is painted from the palette rather than from a bespoke logo color. The cut
takes `--color-fg` and the two letterforms take `--color-fg-2`, so it inverts with the
theme without a second asset, and both values are already in the table above.

That ordering is the point. The cut ran at `#787878` until 2026-08-30, a value that
sits *between* the background and the letterforms in both themes, and on dark it read
as a band splitting strokes that are otherwise 15.79:1. The grey was not the problem:
`#787878` is very close to the maximin optimum for this palette, `#737373`, so no hex
value fixes it. The fix is the role order. The cut is now the brighter of the two
values and the letterforms sit under it, which is the relationship the 2022 splash
screen used (letterforms `#787878`, cut `#ffffff`) before it was inverted for the
rebuild. On dark the letterforms clear 7.18:1 and the cut 15.79:1; on light, 5.59:1
and 16.34:1.

Neither value may equal `--color-bg`: `LogoDraw` strokes each part with its own fill
while drawing it, so a cut painted the background color would trace invisibly.

Dark is the default: `:root` carries the dark palette and `.light` overrides it,
which makes dark the pre-hydration and no-JS fallback per R10. A
`prefers-color-scheme: light` media query on `:root:not(.dark)` covers no-JS light.

### The mark's box

`LOGO_VIEW_BOX` is cropped to the ink, `93 200 814 600`, not the source file's
`0 0 1000 1000`. The polygons occupy x 100 to 900 and y 207 to 793, so the old box
left the mark filling 80% of the width and 59% of the height: `size-7` rendered a
mark 22.4 by 16.4px, and every size class lied about what you would see. Cropped,
28px of box is 28px of mark.

The 7 units of padding per side are half of `LogoDraw`'s `STROKE_WIDTH`, which
strokes centred on the path. Any less and the stroke clips mid-draw.

Two consequences worth knowing before touching it:

- **The box is landscape, 814:600.** Pair it with a height and `aspect-logo`,
  never with `size-*`, which letterboxes the mark back down to the size it used to
  look. `aspect-logo` is a real `@theme` token rather than an arbitrary value
  because Tailwind only emits classes it finds as literal strings, so an
  interpolated `aspect-[...]` is never generated and the box collapses.
  `components/logo/LogoMark.test.tsx` ties the token, the viewBox and the polygon
  bounds together.
- **`LogoIntro`'s overlay and `NavLogo` share a `layoutId`.** They dock into each
  other, so their boxes have to change shape together or the dock animates into
  the wrong aspect.

`app/icon.svg` deliberately does not follow the crop. A favicon paints into square
browser chrome, so it keeps its own square `viewBox="100 100 800 800"`.
`app/icon.test.ts` asserts the polygon points and the four hex values, never the
viewBox, so the two can diverge on framing while staying locked on geometry.

## Type

Instrument Sans for display and body, Geist Mono for metadata. Both through
`next/font/google`.

`--font-display` and `--font-body` both resolve to Instrument Sans today. They stay
separate tokens so a later display face can be swapped in without touching call
sites.

Geist Mono is doing more work than it looks: it sets every date, label and metadata
cell, and it is what makes the CV and the future Work list read as a directory
rather than a blog.

| Token | Value | Used for |
| --- | --- | --- |
| `--text-hero` | `clamp(2.75rem, 1.9rem + 3.6vw, 5.25rem)` | reserved for the statement-led register, unused in v1 |
| `--text-display` | `clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)` | page `h1` |
| `--text-h2` | `clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)` | section headings, the Home positioning line |
| `--text-h3` | `1.1875rem` | CV entry titles, row titles |
| `--text-body` | `1.0625rem` | prose |
| `--text-small` | `0.875rem` | nav links, secondary copy, CV bullets |
| `--text-meta` | `0.8125rem` | mono metadata |

Display type is weight 500 with `-0.025em` tracking. Prose caps at 60 to 62
characters; the page shell is wider (`--container-wide`) than the reading measure
(`--container-measure`) so metadata can sit beside prose without narrowing it.

### The mobile navigation

Below `sm` the bar carries the mark and a text "Menu"; the links live in a
full-screen sheet behind it. From `sm` up it is the single text row it has always
been. Two navigations rather than one that wraps, because at 320px the bar has
280px and one line of five links plus the toggle needs 371px. Even with three it
wrapped, which orphaned the toggle onto a second line under the links and left the
mark misaligned beside them.

**The sheet is wiped open by the mark's own diagonal.** It used to appear: the
panel had no entrance at all, so its opaque `--color-bg` arrived in one frame and
the links then staggered up onto an already-painted surface. The largest visual
event on the site was a jump cut with decoration attached. The cut is now the
mechanism rather than a rule at the foot of the panel.

- **The angle is the logo's, not a choice.** Its cut runs (100,700) to (900,300)
  in the mark's viewBox. That is 400 down over 800 across, which is where the old
  0.5 and 26.57deg came from, and it is the wrong measurement: it runs corner to
  corner ACROSS the stroke's width instead of along its length. Corrected in U2b to
  0.45 and 24.23deg, taken off the slash's own long edges, (150,638) to (900,300)
  and (850,363) to (100,700). The panel is `inset: 0` and therefore `100vw` wide,
  so `--cut-drop` is that ratio at page scale.
- **It enters from the top right,** which is where the control that opened it is.
- **The summary carries no `aria-label`.** It had one reading "Site navigation"
  over visible text reading "Menu", which is WCAG 2.5.3 Label in Name and shows up
  as Lighthouse's `label-content-name-mismatch`: a voice-control user saying the
  word they can see does not hit the control. The two labels are toggled with
  `display`, which takes the hidden one out of the accessibility tree, so the
  accessible name is "Menu" closed and "Close" open, matching the screen in both
  states.
- **The stroke needs its own layer.** `clip-path` clips the *filtered* result, so
  a `drop-shadow` on the panel is cut off by the exact edge it was meant to draw,
  and a pseudo-element inside the panel is clipped along with it.
  `[data-nav-sheet-edge]` is the same line clipped to a 2px band, a sibling of the
  panel rather than a child. Without it the panel and the page share
  `--color-bg`, so the diagonal is only ever a boundary between two pieces of
  content: a wipe, not the cut.
- **`--ease-standard`, not the `--ease-out-expo` this doc gives entrances.** Expo
  covers half its distance in the first 7% of its time. That is right for an 8px
  translate and reads as a snap when the same curve carries an edge nine hundred
  pixels down the screen; measured at 63% of the sweep 60ms into a 400ms
  transition. A travelling object wants to pick up speed and settle.
- **The per-item stagger is gone,** and so is the cut's own `scaleX` draw. The
  passing edge uncovers the links in sequence on its own, so the geometry already
  staggers them; a second stagger on top of it was the same statement twice.
- **A transition, not keyframes, plus `content-visibility` with
  `allow-discrete`.** A `<details>` drops its content the frame it closes, so
  without holding it in the render tree the exit is a jump cut however well the
  entrance is timed. One declaration then carries both directions.
- **`@starting-style` is what makes the FIRST open animate.** A transition needs
  a before-change style, and until the sheet has been opened once its content has
  never been rendered, so there is none and the panel arrives already at its open
  value. Every subsequent open animated, which is exactly why this reads as a
  one-off glitch rather than a missing rule. The block has to restate the closed
  clip-paths rather than inherit them.
- **Anything that clicks into the sheet has to wait for the sweep.** A clip-path
  is a hit-testing boundary as much as a visual one, so a link is Playwright
  "visible" a long time before its own centre stops belonging to the page
  underneath. Two e2e tests poll `elementFromPoint` rather than reading it once;
  without that the no-JS navigation test fails only under parallel load.
- **The bar paints above the panel, not just the summary, and unconditionally.**
  With only the summary lifted the mark vanished under the sheet and had to be
  drawn a second time inside it at a different size, which read as a redraw.
  Keying the lift on `[open]` then fixed the open state and broke the close: a
  `<details>` loses `[open]` the frame it closes, but `allow-discrete` holds the
  panel in the render tree for the length of the sweep, so the bar dropped behind
  a panel that was still covering it and the mark blinked out until the edge
  passed. Nothing above it in the header needs the lift withheld, so there is no
  state to track. An e2e reads the mark's `z-index` after clicking Close.
- **The theme toggle moves into the sheet below `sm`.** A bordered icon chip sat
  immediately beside the bare word "Menu", putting two control languages in 280px
  of bar, and it already vanished the moment the sheet opened. It is the
  least-used control on the site, so it is the one that gives way. Both instances
  are in the DOM and only one is ever visible, so any selector for the toggle has
  to be scoped, exactly as for the two navigations.
- **The links are bottom-anchored.** Top-aligned they left about 200px of dead
  air under the last one, which reads as missing content rather than as space.

- **A `<details>` disclosure, not a `<dialog>`.** This was a dialog first, and
  that was wrong: a closed dialog is `display: none` that only `showModal()` can
  open, so with JavaScript off the whole mobile nav was unreachable. A disclosure
  opens on its own, which means the sheet ships no client JavaScript, has no
  control that can be dead, and needs no duplicate links in a `<noscript>`. An
  e2e test opens it and navigates with `javaScriptEnabled: false`.
- **The trade is focus.** A disclosure does not trap focus the way a modal dialog
  does, so a keyboard user can tab past the last link into the page behind the
  sheet. For a three to five item navigation that is the cheaper problem, and it
  is the one that does not break with scripting off.
- **The summary carries both labels** and CSS picks one, so a single control opens
  and closes the sheet. It is painted above the panel rather than placed inside
  it, which is why it can stay put in the bar while the panel covers the page.
- **The header needs an explicit `position` and `z-index`.** Not cosmetic. On a
  return visit `intro-content` animates opacity on header, main and footer with
  `fill-mode: both`, so the animation stays in effect for the life of the page and
  the header is permanently a stacking context. Left at `z-index: auto` it lands
  on the same stacking level as main, DOM order puts main second, and every page
  paints on top of the whole header including anything fixed inside it. That is
  what made the sheet panel invisible while its background was measurably opaque.
  The z-index scale is documented at the top of that block in `app/globals.css`.
- **Known wart:** resizing past `sm` with the sheet open leaves it open, so
  rotating a phone to landscape and back reveals it again. Closing on resize needs
  JavaScript, which is the thing this component deliberately does without.
- **Both navigations are in the DOM,** so any selector for a nav link has to be
  scoped. Only one is ever in the accessibility tree, since the other is
  `display: none`, but tests and e2e locators see both.

## Layout

- Page shell `--container-wide` (62rem), prose `--container-measure` (44rem).
- Horizontal padding `--spacing-gutter`, section rhythm `--spacing-section`.
- Nav is a 4rem bar. The logo mark sits at 1.75rem tall, which is its docked size and
  therefore the target U4's choreography animates into.
- Directory rows are a `11rem 1fr` grid (mono metadata, then content) that collapses
  to a single column under **760px**, and that number is the same in all three
  places that use the grid: About's bands, the CV rows and the Writing index. It was
  640 until U3 and drifted to two values in the same layout, which put About in one
  column while the Writing index was still in two. The spine's own indent follows
  the same breakpoint, so the rail cannot move before the columns do.
- They carry a **spine**, not per-row hairlines (U3): one `data-spine` hairline down
  the left of the whole list, with the rows simply spaced. Six rows each closed by a
  full-width rule is a table, and it gave the rules more weight than the content.
  The spine belongs to the PAGE, not to a list: About hangs its masthead, its facts
  and its career off one, so a list that draws its own would put a second rail
  inside the first.
- Home hero is `minmax(0, 1fr) 14rem`: content plus a mono fact column, collapsing to
  a two-up grid under 760px.

## Radius

`--radius-sm` (4px) on interactive elements, `--radius-md` (8px) on media, code
blocks and framed content. Nothing else is rounded.

## Motion

Durations are plain custom properties on `:root`, not `@theme` entries, because
Tailwind 4 has no `--duration-*` namespace. Read them in motion components or use
`duration-[var(--duration-base)]`.

| Token | Value | Used for |
| --- | --- | --- |
| `--duration-fast` | 150ms | color and underline transitions |
| `--duration-base` | 240ms | hover and state changes |
| `--duration-slow` | 400ms | content fade-in |
| `--duration-draw` | 600ms | one logo letterform (U4) |
| `--duration-cut` | 300ms | the logo's diagonal cut (U4) |
| `--duration-pop` | 200ms | logo color pop (U4) |
| `--duration-dock` | 500ms | logo dock into the nav (U4) |
| `--duration-draw-inline` | 700ms | inline draw on return visits (U4, R8) |
| `--duration-stagger` | 60ms | per-item content stagger |
| `--duration-route` | 240ms | route enter |
| `--duration-sweep` | 500ms | a diagonal cut travelling the page (nav sheet, theme swap) |

Easings: `--ease-out-expo` for entrances, `--ease-standard` for state changes,
`--ease-in-out-quart` for the dock.

`--nav-height` (4.0625rem) is not a motion token but lives beside them as a plain
custom property, because Tailwind has no namespace for it either. It is the header's
rendered height, and Home's hero subtracts it from `100svh` so its facts band lands
on the fold. It is asserted rather than trusted: see "The Home hero".

The full intro budget is draw 600 + draw 600 + cut 300 + pop 200 + dock 500 with a
100ms hold, about 2.2s, which meets R7's "about 2 seconds". Under reduced motion
everything collapses to opacity only (R9).

### The motion vocabulary

Settled in the redesign foundation on 2026-08-31. The site's motion language is
the logo's own: stroke-drawing, the diagonal cut, and the woven over and under.
Before this it was spent entirely on a 2.2s intro and never referenced again,
which is the main reason the site read as a static document. Anything new should
extend this vocabulary rather than introduce a second one. `DrawRule` is that
language at rule scale, and it is the pattern to copy.

- **Token reading lives in `lib/motion.ts`.** Components call `duration()` and
  `easing()`; none of them calls `getComputedStyle` itself. The fallback tables
  there are what the server and jsdom render with, so a wrong entry is a real
  bug and is unit tested.
- **Route transitions are `app/template.tsx` plus CSS, not `AnimatePresence`.**
  Next remounts a template on every navigation, which is exactly the primitive
  needed, so this costs no client JavaScript. Enter only; exit animations would
  need a client boundary and are not worth one.
- **The route rule is not keyed on `data-intro`, and must not be.** A CSS
  animation starts whenever an element begins matching its selector, not only
  when it mounts. Guarding the rule on the intro therefore made LogoIntro's
  `full` to `done` flip restart it on content that was already painted: measured
  at opacity 0.35 the frame after the mark docked, a full-page flash for every
  first-time visitor. Unconditional, the only thing that starts it is the
  template mounting. During a first visit it runs behind the opaque veil.
  Measured after the change: mobile Lighthouse 98 to 99, LCP 2.0s to 2.5s, CLS 0,
  against a 98 and 2.5s baseline.
- **Scroll reveals are CSS scroll timelines, not motion.** `Reveal` and
  `DrawRule` are server components carrying `data-reveal` and `data-draw-rule`;
  the animation lives in `app/globals.css` behind
  `@supports (animation-timeline: view())`. This is not a performance choice, it
  is the only version that can be correct: motion's `initial` serialises into the
  server HTML as `style="opacity:0"`, so a visitor whose bundle never arrived got
  content that was invisible forever, which breaks the no-JS contract. Both
  components have a unit test asserting their server HTML carries no inline
  opacity or transform. The trade is that a scroll timeline scrubs rather than
  firing once, so both ranges end well before the element leaves the viewport to
  keep the reversal off screen in normal reading.
- **The hero cut is the same gesture at type scale** (U2, rescoped in U2b). It is
  laid over the full-width band that holds the headline rather than over the
  headline itself, so the diagonal runs the whole viewport and crosses all three
  lines. In U2 it was scoped to a `w-fit` box around the name, which is what made it
  read as an underline with ambitions. It runs at `--duration-sweep` now rather than
  `--duration-cut`, for the reason the nav sheet records: 300ms is right for the
  mark's own cut and reads as a flick when the same stroke has to carry a line
  across the whole fold. A gradient band at `--cut-angle` (see "The slash's real
  angle"), drawn with `clip-path: inset()` so the line is
  uncovered from its own start point. A gradient rather than a rotated 1px span,
  which was the first attempt: a rotated line is only as long inside its box as
  twice the box height, so it showed as a 40px tick above the name and its length
  changed with the type's line-height. Two pieces of geometry are load-bearing and
  read as styling: `w-fit` on the wrapper, because the band passes through the box
  centre and at container width it crossed only the right half of the name, and
  the wrapper's vertical padding, because at this angle the band spans twice the
  box height and a box tight to the type gives it nowhere to travel.
- **The hero cut IS gated on `data-intro`, and the route rule is not.** Two rules
  with opposite treatment, so both reasons have to stay written down. An animation
  starts when an element begins matching its selector: for the route rule that was
  a bug, because the `full` to `done` flip restarted it on painted content; for the
  cut it is the mechanism, because `data-intro` is `full` for the 2.2s the veil is
  up and an ungated cut would draw itself behind an opaque sheet. It lists `done`
  and `inline`, since a return visit never becomes `done`. Its resting state is the
  finished line, so no JavaScript, no CSS animation support and reduced motion all
  land on a static accent diagonal rather than on nothing.
- **`Reveal` moves, it does not fade** (amended in U2, the first unit to put it on
  a page). axe blends an element's text colour by its own opacity before measuring
  contrast, and a scroll timeline sits at its `from` keyframe for everything below
  the fold, so a faded reveal reports 1:1 on every paragraph it wraps: measured as
  Lighthouse accessibility 96 with `color-contrast` at 0. No floor rescues it
  either, since at opacity 0.6 `--fg` scrapes 4.55:1 in the light theme and
  `--fg-2` lands at 2.51:1. A 12px rise reads as an entrance on its own.
- **A shared primitive that takes a handler declares its own `"use client"`.**
  `IconButton` does. Without it a server component importing it fails with an
  opaque "functions cannot be passed to client components" error far from the
  cause.
- **Links have three variants and the hierarchy is meaningful.** `primary` for a
  destination the page wants taken, `secondary` for supporting destinations,
  `quiet` for navigation and tertiary links. Before `components/ui/Link.tsx` one
  class string was pasted eleven times across eight files, so a primary path and
  a social handle rendered identically.
- **Icons are `@phosphor-icons/react` at `weight="light"`, `size={18}`.** One
  family for the project. The root barrel import tree-shakes correctly, verified
  against the production bundle: only the two icons in use appear in it.
- **Interactive cursors come from the base layer** in `app/globals.css`, not from
  each component. Buttons default to `cursor: default`, which is why every
  control on the site read as inert.

### The slash's real angle

Corrected in U2b, on 2026-08-31. Every layer that claimed to quote the mark's own
cut was two degrees off it.

The `CUT` polygon is a parallelogram. Its long edges, which are the stroke's own
direction, run (150,638) to (900,300) and (850,363) to (100,700): 750 across for
337.5 down. **Rise 0.45, angle 24.23deg**, confirmed as 24.26deg measured off the
rendered SVG with `getScreenCTM`.

Every layer that quoted "the mark's own cut" had instead used the diagonal from
(100,700) to (900,300), which is corner to corner across the stroke's WIDTH: rise
0.5, 26.57deg. The nav sheet wipe, the theme swap and the hero accent were all
built on it, so all three were two degrees off the shape they claim to quote. Two
degrees is the worst possible size of error here, near enough to read as a mistake
rather than as a deliberate second angle.

- **The geometry is now three tokens, not four copies of a number.** `--cut-rise`
  (0.45), `--cut-drop` (`100vw * --cut-rise`) and `--cut-angle` (-24.23deg). The
  number was restated in four places, which is why nobody caught it; the fix is
  that there is now one place to be wrong.
- **It is asserted, not trusted.** `tests/e2e/home.spec.ts` measures the rendered
  slash off the SVG with `getScreenCTM` and compares it with the angle the accent's
  gradient actually uses, to within half a degree. Confirmed to fail on the old
  value, by exactly 2.31 degrees.

### The mark assembles itself

Added in U2b. What the mark is, which the motion respects: it is `</>` rotated
90 degrees. The opening caret becomes an apex pointing up, which reads as an A, and
the closing caret becomes an apex pointing down, which reads as a V, so the
initials fall out of an HTML tag. That provenance was not written down anywhere
before this.

The hero mark therefore assembles the tag rather than merely appearing: the two
carets arrive from the directions they point away from, and the slash travels the
line it is drawn on.

- **The polygon names are inverted from the letters they draw.** `letter-a` is the
  V: its lone apex is at the BOTTOM, (561.94, 793). `letter-b` is the A: its lone
  apex is at the TOP, (438, 207). The constants predate the crop and are
  load-bearing for `LogoDraw`'s `DRAW_ORDER`, so they keep their names, and
  `HeroMark.test.tsx` derives the apex from the points and pins which is which. Get
  this backwards and the assembly plays inside out.
- **Three beats, on existing tokens, with the delays expressed as the beats before
  them** so the order survives a retune: the carets close together over
  `--duration-draw`, then the slash travels over `--duration-cut`, then the accent
  draws at page scale over `--duration-sweep`. About 1.4s in total.
- **The slash travels its own axis,** `translate(-750px, 337.5px)`, which is its
  own long edge. Any other pair of numbers slides it across itself.
- **Both copies of the slash move together.** The weave is one shape drawn twice
  with the headline between the copies, so animating only the back one would leave
  the front one sitting over the type for the whole beat and break the weave while
  it played.
- **`--ease-standard`, not the `--ease-out-expo` this doc gives entrances,** for the
  reason the nav sheet records: expo covers half its distance in the first 7% of its
  time, which reads as a snap when the moving thing is nine hundred pixels of
  ghosted mark rather than an 8px nudge.
- **The resting state is the assembled mark**, so no JavaScript, no CSS animation
  support and reduced motion all get the mark where it belongs with no motion. An
  e2e test asserts every piece is at `transform: none` with no animation under
  reduced motion, because a piece left parked off screen is content loss rather than
  a motion preference.
- **It costs nothing measurable.** 97-99 performance, LCP 2.0-2.5s, CLS 0, the same
  bimodal spread as the build without it.

### The theme swap

The same stroke as the sheet, at page scale: the new theme is wiped in over the
old along the mark's diagonal instead of the whole page changing value in a frame.
Same geometry, same `--duration-sweep`, same `--ease-standard`.

- **A view transition, not a CSS transition.** There is no single element to
  animate; the change is thousands of computed values at once. `::view-transition-
  new(root)` is the only handle on "the page, after".
- **It needs no accent line of its own.** The sheet's edge had to be painted
  because the panel and the page share `--color-bg`. Here the two sides of the
  line are the two themes, so the edge is the contrast between them.
- **`flushSync` is not optional.** `startViewTransition` snapshots the page, runs
  the callback, snapshots again and animates between the two. A React state update
  scheduled inside that callback lands after the second snapshot, so the transition
  runs between two identical frames: no error, no diagonal, an instant swap that
  looks exactly like the bug it replaced. A unit test pins the swap inside the
  callback.
- **`mix-blend-mode: normal` on both snapshots.** The default is `plus-lighter`,
  which blows out the wiped region where the two overlap.
- **Two fallbacks, both landing on the plain swap:** a browser with no
  `startViewTransition`, and a visitor who asked for less motion. A full-page value
  change is exactly the large-scale motion that preference exists for.
- **The swap is now a frame later than it was,** because the callback runs on the
  next animation frame. Any test that clicks the toggle and reads a colour has to
  poll rather than read once.

### How the intro hides the page

`data-intro` on `<html>` is written before first paint by the inline script in the
root layout: `full` on the first visit of a tab, `inline` on a return visit or under
reduced motion, `done` once the mark has docked. `full` covers the page with an
opaque veil (`body::before`), which is hit-testable only while it is up. The content
underneath is not marked `inert` and keeps its place in the accessibility tree, so a
screen reader has the page from the start; any key or pointer press ends the intro,
which is what stops anything being interacted with unseen.

The veil carries a 5s failsafe animation and the pre-hydration nav mark a 3s one.
Only JavaScript lifts either, so without them a visitor whose bundle never arrives
would be left on a blank sheet.

It must not hide the content with `opacity: 0` instead. A transparent element is not
a Largest Contentful Paint candidate, so the route reports no LCP at all and scores
0 for performance (measured with Lighthouse before the veil replaced it, which is
what R33 turns on). Content painted behind an opaque veil still counts, and fading
the veil out is what R7 calls the content fading in.

Durations reach the motion components through `getComputedStyle`, and the build's
CSS minifier rewrites `600ms` to `.6s`, so both units have to be parsed.

## Metadata

Every route builds its metadata through `pageMetadata(path, { siteName, description, title? })`
in `lib/site.ts`, never by exporting a partial `metadata` object and relying on inheriting
the rest from the root layout. Next replaces `alternates`, `openGraph` and `twitter` wholesale
per route segment rather than deep-merging them, so a page that only overrides `title` silently
keeps the root layout's canonical URL and description. `pageMetadata` always returns the full
set (canonical, description, OpenGraph, Twitter) for the given path so this can't happen by
omission. The one exception is `app/not-found.tsx`, which has no single canonical path to claim
and sets `robots: { index: false }` instead.

## Page decisions

**Home is four movements** (rewritten in U2 and U2b, 2026-08-31): a full-fold hero
carrying a claim cut by the mark's own diagonal, a split of the bio against Selected
writing, and a contact close. The facts are the hero's own furniture rather than a
separate band. Before this it was the same template as the
other six pages, at 992px of a 1440px viewport, with a three-fact right rail leaving
about 250px of dead space under it, no accent anywhere and a total scroll height of
exactly one screen.

This supersedes the previous decision, which read "Home is a calling card, not an
index. Writing does not appear on Home." Writing does appear, as a **curated slot of
three entries at most, not an index**: the distinction R5 was originally reaching
for was directory-style lists of every visible section, and one hand-picked column
is not that. The slot renders only when `writing` is in `NEXT_PUBLIC_SECTIONS` and
only when the list is non-empty, because with the flag off `/writing` 404s by
design and an ungated column would ship dead links. When it does not render the bio
takes the full container rather than leaving the column empty, which would recreate
the dead rail the split exists to fix.

When Work becomes visible it gains a rows list between the split and the contact
close; nothing else on the page moves.

**The footer is a closing line, not a band** (U2, site-wide). It was a full-bleed
`border-t` strip aligned to the viewport rather than to the page, which is what
audit finding 8 actually objected to: not that the copyright sits in a footer, but
that one line occupied a band and did not line up with anything above it. It is now
container-aligned with no top rule. Home closes with its own `DrawRule`, and the
pages that need a separator already end in one of their own (`/about`'s CV list
ends on a hairline above "Download CV"), so no page runs its content into the
copyright. Verified on `/about`, which is the longest.

**The three facts live in `content/site.yaml`** and are required by `siteSchema`.
They were hardcoded in `app/page.tsx` while they were a side rail; the band makes
them a page section, so a `site.yaml` without them is a broken Home and fails the
build.

**Every page has a composition of its own** (U3, 2026-08-31). Audit finding 1 was
that all seven pages were one template with different strings, headed by the same
`text-display` `h1` over a grey subtitle. Home left the template in U2; About,
Writing, Contact and the 404 leave it here. Each was comped in Stitch against this
document first, because U2 proved that a page composed from a sentence of plan prose
arrives as a bigger version of what it replaced.

**The `h1` is the document heading, not always the visual one** (site rule, promoted
from the U2b Home decision below). Visual hierarchy and document hierarchy answer
different questions. Home, Writing and Contact set the `h1` at `--text-meta` while
the claim, the post titles and the address run far larger; About and the 404 do not,
because on those two the document heading and the visual headline are the same
element. A small `h1` on those three pages is deliberate, and
`tests/e2e/pages.spec.ts` asserts Writing's titles are more than twice its heading
so that "fixing" it back fails rather than quietly restoring the template.

### About

**One rail for the whole page.** Every band uses the directory grid: the mono
column carries `ABOUT`, `LANGUAGES`, `STUDIED`, `WHERE I HAVE WORKED` and every
period, the wide column carries the name, the bio and every role, and a single
`data-spine` hairline runs down the left of all of it. The name is the `h1`, at
`clamp(2.75rem, 7vw, 6rem)` with the cut across it, which is the page's scale and
its only accent besides `Download CV`.

That is deliberately not Home's fold, and Home's fold was built here first and
discarded. `HeroMark` weaves the mark's cut over the headline through a band at
`inset(44% 0 42% 0)`, and on a two-line name that band lands across the second line
and eats the letters: "Vital" rendered with its last glyphs sliced. The mark is
Home's signature; About borrows the site's grid instead, which it shares with the
Writing index and the career list.

`CvTimeline` therefore owns no spine of its own. Its rows sit at the page's top
level rather than nested in a content column, because nesting them puts their mono
column inside the wide one and draws a second rail offset from the first.

**The cut needs vertical room to read, and that is arithmetic.** The diagonal drops
`--cut-rise` for every unit it travels, so the width it can cross is the box's
height over 0.45. Wrapped tight around the type it crosses a corner and looks like a
scratch; the `py-10` around the name is what lets it run the width of the block.
The same padding exists on Contact's address for the same reason.

**The spine does not draw itself, and that was measured rather than assumed.** A
scroll timeline scrubs against the element's own progress, so on a list taller than
the viewport the draw lags the reader: with the career list at about 1400px, the
first 300px of scroll drew roughly 180px of spine beside 900px of visible rows.
Every range that fixes the lag finishes the draw off screen instead. `DrawRule` and
the mark already carry the stroke-drawing language on that page, so the spine is a
hairline that is simply there.

### Writing

The list is the composition, because the content forces it: there is one published
post, and a display-scale `Writing` over a small list leaves that entry floating,
which is the template problem at one page's scale. So the titles run at
`--text-display` and the heading at `--text-meta`, with the ordinal and date in the
directory grid's mono column against the spine. The ordinal is positional and
computed at render, never stored: drafts are dropped in production and kept in
development, so a number in front matter would leave gaps in the published list.

### Contact

Home already closes with the email set large and the socials beneath it, so this
page is not that at a bigger size. The fold carries the address on one line at
`clamp(2rem, 5.5vw, 5rem)`, then **LinkedIn and GitHub as the page's second event**:
each set at `--text-display` with its handle in mono beneath, as a two-up split by a
hairline. The location and timezone are mono furniture pinned to the fold's bottom
edge.

**Twitter and Instagram were removed from the site** (André, 2026-08-31): the first
is unused and the second is not professional. `site.socials` is now exactly the two
accounts worth linking, so Contact's two-up needs no special casing and Home's close
follows automatically. The `twitter:` block in `lib/site.ts` stays: that is the
link-preview card spec, which several platforms read, not a profile reference.

**The handles are derived from the URLs**, not carried in `site.yaml`, so the label
beside a link cannot drift from the link.

**They are blocks, not cards.** The register bans cards, and a rule between two
blocks separates them as well as a border around each. `gap-px` over a
`--color-line` background draws the divider without giving either cell a border, so
the vertical rule becomes a horizontal one under 640px on its own.

**The address carries a `<wbr>` after the `@`.** An email address is one unbreakable
word to a line breaker, so at 320px it ran 352px wide inside a 280px column and the
fold's `overflow-hidden` clipped it silently rather than letting the site-wide
no-horizontal-scroll check catch it. `<wbr>` puts the break exactly where an address
should break, unlike `break-words`, which would split `andrevi / tal.com`. It adds
no whitespace, so the accessible name stays the address in one piece.

- **The cut passes UNDER the type here**, which is why `CutLine` has a variant at
  all. An accent rule drawn through an email address is a strikethrough, and a
  struck-through mailbox reads as a dead one. `relative z-[1]` on the link is
  load-bearing: the cut is positioned at z-index 0 and a positioned element paints
  after the static content beside it, so without it the "under" variant lands on
  top. `tests/e2e/pages.spec.ts` asserts the stacking rather than trusting it.
- **The cut is scoped to the address, not to the fold.** Across the whole section it
  ran corner to corner through mostly empty ground and read as a stray hairline.
- **The address is sized to the container, not to `--text-hero`.** That token is
  tuned for a three-word claim and puts the address nine hundred pixels past the
  page.
- **`site.timezone` is required** by `siteSchema`, like the facts: a contact page for
  a remote engineer that omits the timezone is missing the fact the reader came for.

### The 404

The one page allowed to be playful, and the only one whose idea comes from the mark
itself. The mark is `</>` rotated 90 degrees, drawn stroke by stroke and then cut by
a diagonal; here the assembly fails and the glyph has come apart along its own cut.
Two copies of `404` in mono at hero scale, each masked to one side of the line and
pushed along it in opposite directions, with the accent cut over the seam.

- **The seam is the same construction as the cut**, a `linear-gradient` at
  `--cut-angle` with its stop at 50%, which is exactly what `[data-cut]` paints. The
  two coincide by construction rather than by arithmetic, so there is no second place
  holding a number that has to agree with the first. That is the U2b lesson applied
  before it could bite again.
- **An earlier version used a `clip-path` polygon in `cqi` units** derived from
  `--cut-rise`. `cqi` needs `container-type: inline-size`, which contains the box's
  inline size and collapsed it to zero width inside a centred column: the figures
  fell out of centre and the accent line, being `inset: 0` of a zero-width box, did
  not render at all.
- **The figures are `aria-hidden` and are not the heading.** `Whoops,` stays the
  `h1`; `smoke.spec.ts` and `hidden.spec.ts` both assert its text and that its
  computed size exceeds 24px.
- **Nothing on this page may vary per render.** `hidden.spec.ts` compares every
  hidden route's 404 body to an unknown route's byte for byte, so the slip offset is
  a constant. A random offset would fail there.

**One link style is gone** (audit finding 2). The eleven pasted class strings across
eight files are replaced by `TextLink`, and `tests/link-usage.test.ts` fails if the
string reappears anywhere outside `components/ui/Link.tsx`. It is a test rather than
a lint rule because the rule is about one literal in one file, which biome cannot
express.

### Route transitions

**The page is wiped in on the mark's diagonal** (U3), the same stroke the nav sheet
opens with and the theme swaps on. It replaced a 6px rise over 240ms on
`--ease-out-expo`, which is why route changes read as nothing happening: that easing
puts 63% of the distance into the first 60ms, so six pixels of travel were over in
eighty. Route changes were the one large-scale event on the site not speaking the
site's language. `--duration-route` is now 420ms on `--ease-standard`.

Still a CSS animation on `app/template.tsx` rather than a view transition. A
template remounts per navigation, which is the only event this needs, so it costs no
client JavaScript and cannot strand a visitor whose bundle never arrived.
React's `<ViewTransition>` is genuinely available here, contrary to the KTD7 note in
`app/layout.tsx`: the installed `react` package has no such export, but the App
Router compiles against Next's vendored canary, which does. It was still not used,
because it animates through the root snapshot that `ThemeToggle` already drives, and
separating the two needs transition types that not every target browser has.

The final polygon covers the whole box plus a triangle below it, so nothing stays
clipped once the wipe lands; it is the nav sheet's open state at page scale.

**Every diagonal on the site is now verified against the mark**, in
`tests/e2e/geometry.spec.ts`: the accent cut on three routes, the 404's slip seam and
the nav sheet's wipe are each measured and compared to the slash's rendered angle via
`getScreenCTM`. Reading the tokens back would only prove the CSS quotes itself.
Reverting `--cut-rise` to the old 0.5 fails all four. Two traps are recorded there:
a closed `<details>` collapses its box, so measuring the panel shut puts the wipe 53
degrees out on correct CSS, and a `clip-path` caught mid-transition is an
interpolated polygon whose coordinates are all resolved px and none of them the
declared drop.

**Measured after U3.** Mobile Lighthouse: About 99, Writing 99, Contact 98, all with
accessibility 100, best practices 100, SEO 100 and CLS 0. Desktop is 100 in all four
on all three. LCP 2.0s to 2.5s, unchanged and bimodal for the same reason Home's is:
on a first visit it is the moment the intro veil lifts.

### The Home hero

Rebuilt in U2b after U2's version landed as a large heading rather than a hero. It
was measured against four references (two Dribbble developer portfolios, Davide
Perozzi's Awwwards SOTD, and a slider concept) plus two Stitch comps generated from
this document. Every reference agreed on the same four things, and U2 had none of
them: the positioning is the headline and the name is a mark, the type runs at
200px and past its own column, the hero owns the whole fold, and the facts are
corner furniture rather than a stripe.

- **The claim is the headline, the name is the label.** `Finished. Polished.
  Shipped.` replaced `site.positioning` read at hero scale, which is a third-person
  relative clause ("Senior front-end engineer who ships...") and read as a caption
  blown up. Three lines, because the cut crosses them; one line gives the diagonal
  a single edge to touch.
- **The name is still the `h1`, at `--text-meta`, while the claim is a `<p>` at
  forty times the size.** Visual hierarchy and document hierarchy answer different
  questions: the page is about a person, so the heading a screen reader or a crawler
  lands on has to be the person. Inverting them is not a style choice that happens
  to work either way: it broke the heading-name assertions in `smoke.spec.ts` and
  `intro.spec.ts`, which is exactly the contract those tests exist to hold.
- **`--text-hero` was retuned from a 5.25rem ceiling to `clamp(3rem, 0.5rem + 16vw,
  18rem)`.** The old ceiling put the headline at 84px, ending at 45% of the
  container. Its only consumer is this headline.
- **The fold is exact, and `--nav-height` is what makes it exact.** The hero's
  min-height is `100svh` less that token, so the facts band lands on the fold rather
  than just under it. The token is a hardcoded 4.0625rem, so
  `tests/e2e/home.spec.ts` asserts the band's position at three viewports: change
  the bar's padding without changing the token and that fails by the height of the
  bar.
- **The three lines cannot bleed off screen and keep the facts on the fold.** That
  is arithmetic, not a preference. At 1440x900 the fold gives about 735px; three
  lines plus the overline plus the band consume it at roughly 240px of type, and
  cropping a word off the right edge needs about 290px. The type therefore fills its
  column and runs slightly past it, which is r1's register rather than r3's. The
  lines are `whitespace-nowrap` and the section clips, so the overhang never reaches
  the page's scroll width.
- **The mark is woven with the headline, not placed behind it.** Two layers of the
  same shape with the type between them: the back layer is the whole mark, the front
  layer redraws its cut alone clipped to one horizontal band, so the diagonal passes
  over the type there and under it everywhere else. That is `LOGO_WEAVES`' own trick
  (a sliver of each letterform redrawn over the other) with the headline as the
  second strand. The band is set in percentages because the headline is vertically
  centred at every viewport.
- **The ghost is `--color-line`, not `--color-bg-2`.** bg-2 was too close to the
  page to read at all. It may never be `--color-bg`: that is the mark's one standing
  colour invariant, and `HeroMark.test.tsx` pins it.
- **Measured after.** Mobile Lighthouse 97-99 with accessibility 100 and CLS 0,
  which is where it already was. An earlier note here claimed the bigger type took
  LCP from 2.5s to 2.0s; that was one run. Repeated three times, both the U2b build
  and the one before it return 2.0s or 2.5s with no pattern, because on a first
  visit LCP is the moment the intro veil lifts rather than the moment the type
  paints. The honest number for this page is 2.0 to 2.5s, bimodal, unchanged by the
  hero rebuild.

**Open follow-ups from the design review, not blockers for U3:**

- Copy throughout is placeholder and needs its own pass. The Home bio paragraph and
  the CV bullets are the weakest.
- The Home contact strip was the one André wanted reworked later. U2 did it: the
  email at display scale with the socials as `quiet` links beneath it.
- A third Home register anchored by an oversized cropped logo mark was offered and
  not taken. It would have to reconcile with the U4 dock, so it is a decision rather
  than a tweak if it comes back.

**Writing prose.** Compiled MDX is plain HTML with no element to hang a className on,
so its typography lives in `app/globals.css` under `.prose` rather than as arbitrary
variants on a component. Code blocks keep the old site's line numbers, as a CSS
counter on rehype-pretty-code's `[data-line]` wrappers rather than as markup, so a
copied snippet is the code alone. `defaultLang: "plaintext"` in `components/mdx/Mdx.tsx`
is what makes an unlabelled fence get the same treatment as a labelled one; without it
rehype-pretty-code skips the block entirely and it renders with no per-line wrapper and
no number beside blocks that have both.

**Work.** The list is a two-up card grid above 760px and a single column below it,
each card a 16:9 hero over the title, the summary and a mono `KIND · PERIOD` line.
Only the first card's image is `priority`; it is the page's Largest Contentful Paint
and lazy-loading it cost about half a second. That index is into the unfiltered list,
so a filtered deep link can preload a row the filter then hides, which is one small
image and cheaper than re-rendering the list to find out. The kind filter appears only when there
is more than one kind to choose between, and an unknown `?tag=` shows everything
rather than nothing. The detail page opens with the title, the summary, the tags and a
mono definition list of role, period, team and, only where permission is recorded, the
client, then the hero and the MDX body.

The filter is a nav and a CSS rule, not a rendered list. `useSearchParams` opts
everything up to the nearest Suspense boundary out of the static HTML, so only the nav
sits inside that boundary; the list is server-rendered outside it and the
`.work-filter:has(> nav[data-active-kind=...])` rules in `app/globals.css` hide the
rows that do not match. Rendering the list inside the boundary instead put the
fallback in the page: no cards in the HTML at all, no image preload, and nothing for a
client without JavaScript. Entries must not cross the client boundary either, since
every prop a client component takes is serialized into the page, which is how an
unpublished client name and every entry's full MDX body ended up in `/work`'s HTML.
The nav takes a list of kinds and nothing else.

Client entries name no client unless `permission.clientName` says so. The matching
`permission.screenshots` flag records the same for imagery but gates nothing in code:
nothing here can tell a real client screen from an abstract one, so which file `hero`
points at is the author's call. `content/work/example-client.mdx` is where that rule
lives, and it stays a draft.

**Craft.** The list is a plain index -- title, one-line summary, tags -- because a
piece is worth nothing at thumbnail size and mounting every demo on one page is the
opposite of what the section is for. The piece page is where a demo runs: header,
demo frame, MDX body, and a source link when there is one.

A piece's `demo` names either a registry key or a video file. The registry in
`components/craft/demos/index.ts` maps a key to a `next/dynamic` import, so each demo
is its own chunk and Craft never grows the shared bundle; a key that names no demo
throws while `DemoFrame` prerenders, which fails the build rather than shipping an
empty frame. `DemoFrame` itself is a server component, so a piece page still
prerenders its demo's first frame into the HTML.

Controls belong to the demo, not the frame: only the demo knows what there is to
replay or to slow down. `LogoDrawDemo` reuses U4's `LogoDraw` with a replay button and
a 0.5x/1x/2x speed, and replay is a remount, since nothing in motion restarts a
finished sequence. What it renders before it has run is `LogoMark`, the static mark,
for two reasons: `pathLength` leaves a dash pattern on the shapes even when nothing
animates, and an undrawn `LogoDraw` renders as nothing, so serving one would give a
visitor without JavaScript an empty frame and disagree with the first client render
for a visitor with it. Reduced motion holds that static mark until the visitor presses
replay themselves (R9).

Craft ships built and off, and stays off on every published environment until the page
is reworked with real motion and polished UI, three published pieces being the floor
rather than the trigger. Work stands the same way. `NEXT_PUBLIC_SECTIONS` takes one
value across production and preview; `.env.development` is the only place all three
sections are on, which is where both reworks happen.

**Hidden sections.** A section flagged off in `NEXT_PUBLIC_SECTIONS` must be
indistinguishable from a route that was never built. That is enforced in
`lib/rewrites.ts`, which rewrites the section's URLs (and `/feed.xml`, which belongs
to Writing but carries no `/writing` prefix) to a path that does not exist, in
`beforeFiles` so it beats the filesystem route. The pages still call `notFound()` and
still return no static params, but that is the second lock, not the mechanism: a
page's `metadata` export is evaluated whatever the page then does, and a `notFound()`
thrown during prerender renders an empty shell rather than `app/not-found.tsx`.
