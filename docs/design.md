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

## Layout

- Page shell `--container-wide` (62rem), prose `--container-measure` (44rem).
- Horizontal padding `--spacing-gutter`, section rhythm `--spacing-section`.
- Nav is a 4rem bar. The logo mark sits at 1.75rem tall, which is its docked size and
  therefore the target U4's choreography animates into.
- Directory rows are a `11rem 1fr` grid (mono metadata, then content) that collapses
  to a single column under 640px.
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

Easings: `--ease-out-expo` for entrances, `--ease-standard` for state changes,
`--ease-in-out-quart` for the dock.

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

**Home is a calling card, not an index.** Name, positioning, a mono fact column, one
paragraph of bio pointing at About, then a contact strip. Writing does not appear on
Home; it lives at `/writing` and is reachable from the nav. This amends plan
requirement R5, which originally called for directory-style lists of the visible
sections on Home. When Work becomes visible it gains a rows list above the contact
strip using the same grid; nothing else on the page moves.

**Open follow-ups from the design review, not blockers for U3:**

- Copy throughout is placeholder and needs its own pass. The Home bio paragraph and
  the CV bullets are the weakest.
- The Home contact strip is approved as-is but André wants it reworked later.
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
