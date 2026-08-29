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
| `--color-logo-cut` | `#787878` | `#787878` |

The accent is reserved for links (underline on hover), focus rings and the current
nav item. It is never a fill.

`--color-logo-cut` is locked to the logo's own diagonal in both themes; the two
letterforms take `currentColor` so the mark inverts with the theme without a second
asset.

Dark is the default: `:root` carries the dark palette and `.light` overrides it,
which makes dark the pre-hydration and no-JS fallback per R10. A
`prefers-color-scheme: light` media query on `:root:not(.dark)` covers no-JS light.

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
- Nav is a 4rem bar. The logo mark sits at 1.75rem, which is its docked size and
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

Easings: `--ease-out-expo` for entrances, `--ease-standard` for state changes,
`--ease-in-out-quart` for the dock.

The full intro budget is draw 600 + draw 600 + cut 300 + pop 200 + dock 500 with a
100ms hold, about 2.2s, which meets R7's "about 2 seconds". Under reduced motion
everything collapses to opacity only (R9).

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
