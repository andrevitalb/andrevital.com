# andrevital.com Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site an identity by promoting the logo's existing draw-and-cut choreography into a site-wide motion vocabulary, and by giving every page real structure instead of one shared template.

**Architecture:** Evolve, do not replace. The palette, type scale, spacing scale, hairlines, container widths, IA, slugs, the LCP veil mechanism and the no-JS contract all stay exactly as they are. Three new layers go on top: a motion module extracted from `LogoDraw`, a set of interaction primitives that replace eleven copies of one link style, and a per-page composition that stops all seven pages being the same component. The hero gains the logo's diagonal cut drawn across the name, then later a real extruded 3D mark behind a flag.

**Tech Stack:** Next 16 (App Router), React 19.2.8, Tailwind 4, motion v13 (`motion/react`), next-themes, `@phosphor-icons/react`, three.js via `@react-three/fiber` (Unit 5 only), biome, vitest + Testing Library, Playwright.

**Spec:** This document. Sections "Audit" and "Direction" below are the spec; "Units" are the plan.

## Global Constraints

- No em dashes anywhere. Not in code, comments, copy, commit messages, PR titles or PR bodies. Use a comma, colon, parentheses or two sentences.
- Conventional commits, single line, no body unless a one-liner genuinely cannot carry the intent. No AI or agent attribution anywhere in version control.
- Never commit to `main`. Branch and open a PR for every unit, including docs-only changes.
- The palette is fixed: `#0f1214` / `#15191c` / `#e8ecec` / `#98a2a2` / `#242b2d`, accent `#63d4bf` dark and `#0e7c69` light. No new colour values.
- Dark is the default. `:root` carries dark, `.light` overrides, and the `prefers-color-scheme: light` media block covers no-JS. Any new token must be declared in all three places or in none.
- The site must render fully and legibly with JavaScript disabled. No content may exist only behind hydration.
- Everything above `MOTION_INTENSITY` 3 honours `prefers-reduced-motion`, collapsing to opacity or to nothing.
- Animate `transform` and `opacity` only. Never `top`, `left`, `width` or `height`.
- No `window.addEventListener("scroll")`. Use `useScroll`, `whileInView`, IntersectionObserver or CSS scroll-driven animations.
- No fill in the logo mark may equal `--color-bg` (existing invariant, `docs/design.md`).
- Design dials for this work: `DESIGN_VARIANCE 6`, `MOTION_INTENSITY 7`, `VISUAL_DENSITY 4`.

---

## Audit

Every finding below was measured against the live site at `main@6e70eeb` or read from source. None are impressions.

| # | Finding | Evidence |
| --- | --- | --- |
| 1 | All 7 pages are one template with different strings | `grep -rln 'text-display tracking-\[-0.025em\]' app` returns `page`, `about`, `writing`, `contact`, `work`, `craft`, `not-found` |
| 2 | One link style, no hierarchy | `underline decoration-1 decoration-line underline-offset-4` appears 11 times across 8 files |
| 3 | The accent renders on zero elements on Home | Measured in the browser. It is bound to the active nav link, and Home is not in the nav |
| 4 | The whole site is one screen | `document.body.scrollHeight === innerHeight === 900` at 1440x900 |
| 5 | The theme toggle has the wrong cursor and an ambiguous label | `getComputedStyle(button).cursor === "default"`; a 64x32 text button reading "Dark", which parses as either the current state or the action |
| 6 | The motion system serves one component | 9 duration tokens and 3 easings in `@theme`; 6 are logo-specific, the other 3 drive only `transition-colors` and one fade |
| 7 | Home wastes the container | 992px of a 1440px viewport, text column about 38% of viewport, a 3-fact right rail leaving roughly 250px of dead space below it |
| 8 | The footer is a lone copyright line occupying a full band | `app/layout.tsx` |

### Why the site reads as plain HTML

`docs/design.md` states the register deliberately: the site is quiet because "the three things that carry it visually all land later", namely the logo choreography, Work entries with screenshots, and live Craft demos. Two of those three are flagged off on every published environment. What is live is the quiet register carrying none of its intended payload.

### The thesis

`LogoDraw` is the site's one piece of real identity: the mark draws itself stroke by stroke, a diagonal cut passes through it, and the letterforms are woven over and under where they cross. It runs for 2.2 seconds on a first visit and the language is never referenced again anywhere. This plan promotes stroke-drawing, the diagonal cut and the weave into the site's motion vocabulary.

---

## Direction

**Hero, both moments in sequence.** On load, the logo's diagonal cut draws across the name in the accent, reusing `--duration-cut` and the same stroke-draw technique as `LogoDraw`. Later, and behind a flag, the mark resolves into a real extruded object beside it. The cut ships first because it costs nothing and works without JavaScript as a static line.

**Where three.js earns its place.** The mark's letterforms are woven where they cross, currently faked with two `clipPath` rects in `LogoMark.tsx`. A weave is a depth relationship being simulated in 2D. Extruding the three existing polygons (`LETTER_A`, `LETTER_B`, `CUT`, all on a 1000x1000 viewBox) makes the over and under literal. No model file, no textures, no loader. This is the only placement where 3D does something the SVG cannot, and it is the only placement in this plan.

**Home below the fold**, validated against generated comps: a full-bleed mono facts band with no boxes, then a split of a two-paragraph bio at 44rem measure against a Selected writing list, then a large contact block with the email set big and the four socials under it, replacing the bare footer. The Work rows slot stays empty because Work stays hidden.

**Both flagged sections stay off.** Work and Craft get reworked onto the new system but `NEXT_PUBLIC_SECTIONS` is not changed on any published environment.

### File structure

| File | Responsibility |
| --- | --- |
| `lib/motion.ts` (new) | Reads duration and easing tokens from CSS. Owns `parseDuration`, `parseCubicBezier`, `seconds`, `bezier`, extracted from `LogoDraw` so both the logo and the rest of the site read one source |
| `components/ui/Link.tsx` (new) | The link primitive. Three variants carrying real hierarchy, replacing 11 pasted class strings |
| `components/ui/IconButton.tsx` (new) | Square icon button with a correct cursor, hit area and accessible name |
| `components/motion/Reveal.tsx` (new) | Client leaf. Enter-on-scroll with stagger, reduced-motion aware |
| `components/motion/DrawRule.tsx` (new) | A hairline that draws itself in. The cut motif at rule scale |
| `components/motion/CutLine.tsx` (new) | The accent diagonal that draws across display type. The hero's first moment |
| `app/template.tsx` (new) | Route transitions. Next remounts a template on navigation by design, so this is enter-only motion with zero client JavaScript |
| `app/globals.css` (modify) | Cursor and interaction base rules, the route-enter keyframes, one new duration token |
| `components/nav/ThemeToggle.tsx` (modify) | Becomes an icon button |
| `components/logo/LogoDraw.tsx` (modify) | Imports token reading from `lib/motion` instead of owning it |

---

## Units

| Unit | Deliverable | Branch |
| --- | --- | --- |
| 1 | Foundation: motion module, primitives, icon button, cursors, route transitions | `feat/redesign-foundation` |
| 2 | Home rebuilt on the foundation, including the hero cut | `feat/redesign-home` |
| 3 | About, Writing, Contact, 404 composed individually | `feat/redesign-pages` |
| 4 | Work and Craft reworked, still flagged off | `feat/redesign-hidden-sections` |
| 5 | The extruded 3D mark, behind a flag | `feat/redesign-3d-mark` |

Units 2 to 5 are defined by deliverable and interface below. They get stepped out once Unit 1 lands, because they consume Unit 1's primitives and the exact shape of those primitives is what Unit 1 settles. Writing their steps now would be guessing at signatures.

Three units were added after this table and carry a `b`, because each is shell or
refinement work with no route of its own rather than a sixth deliverable: **1b**
(the mobile nav and the mark's scale, `feat/redesign-nav-and-mark`), **2b** (the
hero) and **4b** (the sidebar navigation, `feat/redesign-sidebar-nav`). A `b`
unit ships immediately before the numbered unit it is attached to, so the running
order is 1, 1b, 2, 2b, 3, 4b, 4, 5. Unit 4b takes its number from Unit 4 because
Unit 4 is what forced it: four routes composed against a shell that was about to
change underneath them.

---

# Unit 1: Foundation

Branch: `feat/redesign-foundation`. Nothing in this unit changes what a visitor sees on Home except the theme toggle and cursors; it is the layer everything else is built on.

## Task 1: Extract the motion module

`LogoDraw` already reads duration and easing tokens from CSS at runtime and has correct parsers for both. The rest of the site needs the same readings, so this moves them out rather than writing a second copy.

**Files:**
- Create: `lib/motion.ts`
- Create: `lib/motion.test.ts`
- Modify: `components/logo/LogoDraw.tsx` (delete the parsers and token readers, import them instead)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `parseDuration(raw: string, fallbackMs: number): number` returning seconds
  - `parseCubicBezier(raw: string, fallback: Bezier): Bezier`
  - `type Bezier = [number, number, number, number]`
  - `duration(token: DurationToken): number` returning seconds
  - `easing(token: EasingToken): Bezier`
  - `type DurationToken = "--duration-fast" | "--duration-base" | "--duration-slow" | "--duration-draw" | "--duration-cut" | "--duration-pop" | "--duration-dock" | "--duration-draw-inline" | "--duration-stagger" | "--duration-route"`
  - `type EasingToken = "--ease-out-expo" | "--ease-standard" | "--ease-in-out-quart"`

- [ ] **Step 1: Write the failing test**

Create `lib/motion.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { parseCubicBezier, parseDuration } from "@/lib/motion"

describe("parseDuration", () => {
	it("reads a millisecond token as seconds", () => {
		expect(parseDuration("600ms", 250)).toBe(0.6)
	})

	it("reads a minified second token as seconds", () => {
		expect(parseDuration(".6s", 250)).toBe(0.6)
	})

	it("falls back when the property does not resolve", () => {
		expect(parseDuration("", 250)).toBe(0.25)
	})

	it("falls back on a non-positive value", () => {
		expect(parseDuration("0ms", 250)).toBe(0.25)
	})
})

describe("parseCubicBezier", () => {
	const fallback: [number, number, number, number] = [0.65, 0, 0.35, 1]

	it("pulls four control points out of a token", () => {
		expect(parseCubicBezier("cubic-bezier(0.16, 1, 0.3, 1)", fallback)).toEqual([
			0.16, 1, 0.3, 1,
		])
	})

	it("keeps negative control points", () => {
		expect(parseCubicBezier("cubic-bezier(-0.2, 0, 0.4, 1)", fallback)).toEqual([
			-0.2, 0, 0.4, 1,
		])
	})

	it("falls back when the token is not four numbers", () => {
		expect(parseCubicBezier("ease-in-out", fallback)).toEqual(fallback)
	})
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run lib/motion.test.ts`
Expected: FAIL, cannot resolve `@/lib/motion`.

- [ ] **Step 3: Write the module**

Create `lib/motion.ts`. The two parsers move verbatim from `components/logo/LogoDraw.tsx` (they are already correct and already tested through the logo tests); the token tables gain the non-logo durations.

```ts
export type Bezier = [number, number, number, number]

// Authored in ms in app/globals.css. The build's CSS minifier rewrites them to
// seconds (600ms becomes .6s), so both units have to be handled.
const FALLBACK_MS = {
	"--duration-fast": 150,
	"--duration-base": 240,
	"--duration-slow": 400,
	"--duration-draw": 600,
	"--duration-cut": 300,
	"--duration-pop": 200,
	"--duration-dock": 500,
	"--duration-draw-inline": 700,
	"--duration-stagger": 60,
	"--duration-route": 240,
} as const

export type DurationToken = keyof typeof FALLBACK_MS

// Not `as const`: a readonly tuple is not assignable to Bezier, and easing()
// hands these to parseCubicBezier as a mutable fallback.
const FALLBACK_EASE = {
	"--ease-out-expo": [0.16, 1, 0.3, 1],
	"--ease-standard": [0.2, 0, 0, 1],
	"--ease-in-out-quart": [0.65, 0, 0.35, 1],
} satisfies Record<string, Bezier>

export type EasingToken = keyof typeof FALLBACK_EASE

/** Reads a duration token as seconds, which is what motion wants. */
export function parseDuration(raw: string, fallbackMs: number) {
	const parsed = Number.parseFloat(raw)
	if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs / 1000
	return raw.trim().endsWith("ms") ? parsed / 1000 : parsed
}

/** Pulls the four control points out of a cubic-bezier(...) token. */
export function parseCubicBezier(raw: string, fallback: Bezier): Bezier {
	const points = raw.match(/-?[\d.]+/g)?.map(Number)
	if (points?.length !== 4 || !points.every(Number.isFinite)) return fallback
	return points as Bezier
}

function readProperty(token: string) {
	if (typeof window === "undefined") return ""
	return getComputedStyle(document.documentElement).getPropertyValue(token)
}

/**
 * Seconds for a duration token. The fallbacks are for jsdom and for the server,
 * where custom properties do not resolve; in a browser these always come from
 * app/globals.css.
 */
export function duration(token: DurationToken) {
	return parseDuration(readProperty(token), FALLBACK_MS[token])
}

/** Control points for an easing token, with the same fallback rationale. */
export function easing(token: EasingToken): Bezier {
	// Copied per call rather than shared: motion is free to keep the array, and a
	// shared fallback would then be mutable across every consumer.
	const fallback = FALLBACK_EASE[token]
	return parseCubicBezier(readProperty(token), [...fallback] as Bezier)
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run lib/motion.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Point LogoDraw at the module**

In `components/logo/LogoDraw.tsx`, delete `FALLBACK_MS`, `FALLBACK_EASE`, `parseDuration`, `parseCubicBezier`, `seconds`, `bezier` and the `Bezier` type. Import instead:

```ts
import { type Bezier, duration, easing } from "@/lib/motion"
```

Replace each `seconds("--duration-x")` call with `duration("--duration-x")`, and each `bezier("--ease-in-out-quart")` call with `easing("--ease-in-out-quart")`.

If any existing test imports `parseDuration` or `parseCubicBezier` from `LogoDraw`, re-point that import at `@/lib/motion`. Check with:

```bash
grep -rn "parseDuration\|parseCubicBezier" --include="*.ts" --include="*.tsx" .
```

- [ ] **Step 6: Run the full unit suite**

Run: `pnpm test`
Expected: PASS. The count rises from 141 to 148, and no existing logo test regresses.

- [ ] **Step 7: Add the route duration token**

In `app/globals.css`, add `--duration-route: 240ms;` to the motion block on `:root`, directly after `--duration-stagger`. It goes on `:root` only, alongside the other durations, because durations do not vary by theme.

- [ ] **Step 8: Typecheck and commit**

```bash
pnpm typecheck
git add lib/motion.ts lib/motion.test.ts components/logo/LogoDraw.tsx app/globals.css
git commit -m "refactor: extract motion token reading into lib/motion"
```

## Task 2: Cursors and interaction base rules

Fixes audit finding 5's cursor half. Browser buttons default to `cursor: default`, which is why every button on the site currently feels dead.

**Files:**
- Modify: `app/globals.css` (the `@layer base` block)
- Test: `tests/e2e/interaction.spec.ts` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: a guarantee that every interactive element has a pointer cursor. Later units rely on this rather than setting `cursor-pointer` per component.

- [ ] **Step 1: Write the failing e2e test**

Create `tests/e2e/interaction.spec.ts`:

```ts
import { expect, test } from "@playwright/test"

test("interactive controls carry a pointer cursor", async ({ page }) => {
	await page.goto("/")

	const toggle = page.getByRole("button", { name: /theme/i })
	await expect(toggle).toHaveCSS("cursor", "pointer")
})

test("a disabled control does not offer a pointer", async ({ page }) => {
	await page.goto("/")
	await page.evaluate(() => {
		const probe = document.createElement("button")
		probe.id = "cursor-probe"
		probe.disabled = true
		document.body.append(probe)
	})

	await expect(page.locator("#cursor-probe")).toHaveCSS(
		"cursor",
		"not-allowed",
	)
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm e2e tests/e2e/interaction.spec.ts`
Expected: FAIL. The first test reports `default` where `pointer` was expected. The second fails too, since no rule exists yet.

The accessible name matcher `/theme/i` is deliberate: it matches the current `Switch to dark theme` label and will still match after Task 4 changes the button.

- [ ] **Step 3: Add the base rules**

In `app/globals.css`, inside the existing `@layer base` block, after the `:focus-visible` rule:

```css
	/*
	 * Buttons default to cursor: default in every browser, which is why the
	 * controls on this site read as inert. Anchors already get a pointer from
	 * the UA stylesheet when they carry an href, so they are not listed here.
	 */
	:is(button, [role="button"], summary, label[for], select):not(:disabled) {
		cursor: pointer;
	}

	:disabled {
		cursor: not-allowed;
	}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm e2e tests/e2e/interaction.spec.ts`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css tests/e2e/interaction.spec.ts
git commit -m "fix: give interactive controls a pointer cursor"
```

## Task 3: The link primitive

Fixes audit findings 1 and 2. Eleven copies of one class string become one component with three variants that carry actual hierarchy.

**Files:**
- Create: `components/ui/Link.tsx`
- Create: `components/ui/Link.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `<TextLink href variant? external? className? children />`
  - `type TextLinkVariant = "primary" | "secondary" | "quiet"`
  - `LINK_CLASS: Record<TextLinkVariant, string>` exported so tests and later units can assert against it rather than duplicating strings

Variant meanings, which are the hierarchy the site currently lacks:
- `primary`: a real destination the page wants you to take. Foreground text, underline in the accent, thickens on hover.
- `secondary`: a supporting destination. Foreground text, hairline underline, underline goes accent on hover. This is the current site's only style, kept as the middle rung.
- `quiet`: navigation and tertiary links such as socials. Secondary text, no underline, goes foreground on hover.

- [ ] **Step 1: Write the failing test**

Create `components/ui/Link.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LINK_CLASS, TextLink } from "@/components/ui/Link"

describe("TextLink", () => {
	it("defaults to the secondary variant", () => {
		render(<TextLink href="/about">More about me</TextLink>)
		expect(screen.getByRole("link")).toHaveClass(
			...LINK_CLASS.secondary.split(" "),
		)
	})

	it("applies the requested variant", () => {
		render(
			<TextLink href="/about" variant="primary">
				More about me
			</TextLink>,
		)
		expect(screen.getByRole("link")).toHaveClass(
			...LINK_CLASS.primary.split(" "),
		)
	})

	it("gives every variant a distinct class string", () => {
		const values = Object.values(LINK_CLASS)
		expect(new Set(values).size).toBe(values.length)
	})

	it("adds rel and target for an external link", () => {
		render(
			<TextLink href="https://github.com/andrevitalb" external>
				GitHub
			</TextLink>,
		)
		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", "noreferrer noopener")
	})

	it("does not set target on an internal link", () => {
		render(<TextLink href="/about">About</TextLink>)
		expect(screen.getByRole("link")).not.toHaveAttribute("target")
	})

	it("merges a caller className", () => {
		render(
			<TextLink href="/about" className="text-hero">
				About
			</TextLink>,
		)
		expect(screen.getByRole("link")).toHaveClass("text-hero")
	})
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm vitest run components/ui/Link.test.tsx`
Expected: FAIL, cannot resolve `@/components/ui/Link`.

- [ ] **Step 3: Write the primitive**

Create `components/ui/Link.tsx`:

```tsx
import NextLink from "next/link"
import type { ReactNode } from "react"

export type TextLinkVariant = "primary" | "secondary" | "quiet"

/*
 * The hierarchy the site did not have. Before this, one class string was pasted
 * eleven times, so a primary path and a social handle rendered identically.
 *
 * Exported so tests and callers assert against these values rather than keeping
 * a second copy of them.
 */
export const LINK_CLASS: Record<TextLinkVariant, string> = {
	primary:
		"text-fg underline decoration-2 decoration-accent underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-[var(--duration-fast)] hover:underline-offset-[6px]",
	secondary:
		"text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent",
	quiet:
		"text-fg-2 no-underline transition-colors duration-[var(--duration-fast)] hover:text-fg",
}

type TextLinkProps = {
	href: string
	variant?: TextLinkVariant
	/** Opens in a new tab with the safe rel. Use for anything off this origin. */
	external?: boolean
	className?: string
	children: ReactNode
}

/**
 * Every text link on the site. `mailto:` and `https:` hrefs render a plain
 * anchor: next/link would prefetch them as route payloads.
 */
export function TextLink({
	href,
	variant = "secondary",
	external = false,
	className,
	children,
}: TextLinkProps) {
	const classes = [LINK_CLASS[variant], className].filter(Boolean).join(" ")
	const isRoute = href.startsWith("/") && !external

	if (isRoute) {
		return (
			<NextLink href={href} className={classes}>
				{children}
			</NextLink>
		)
	}

	return (
		<a
			href={href}
			className={classes}
			target={external ? "_blank" : undefined}
			rel={external ? "noreferrer noopener" : undefined}
		>
			{children}
		</a>
	)
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm vitest run components/ui/Link.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Link.tsx components/ui/Link.test.tsx
git commit -m "feat: add a text link primitive with three variants"
```

## Task 4: The icon button and the theme toggle

Fixes the rest of audit finding 5. The toggle stops being a text button labelled with its target theme, which parses ambiguously as either the current state or the action.

**Files:**
- Create: `components/ui/IconButton.tsx`
- Create: `components/ui/IconButton.test.tsx`
- Modify: `components/nav/ThemeToggle.tsx`
- Modify: `package.json` (add `@phosphor-icons/react`)

**Interfaces:**
- Consumes: the cursor rules from Task 2.
- Produces: `<IconButton label onClick? type? className? children />` where `label` becomes both `aria-label` and a `title`, and `children` is the glyph.

Icon library: `@phosphor-icons/react`, standardised at `weight="light"` and `size={18}`. One family for the whole project. Import per-icon from the package root so Next tree-shakes it; do not import the barrel as a namespace. This is the only icon dependency the project gets.

- [ ] **Step 1: Install the icon library**

```bash
pnpm add @phosphor-icons/react
```

- [ ] **Step 2: Write the failing IconButton test**

Create `components/ui/IconButton.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { IconButton } from "@/components/ui/IconButton"

describe("IconButton", () => {
	it("names itself from the label", () => {
		render(
			<IconButton label="Switch to light theme">
				<svg />
			</IconButton>,
		)
		expect(
			screen.getByRole("button", { name: "Switch to light theme" }),
		).toBeInTheDocument()
	})

	it("defaults to type button so it never submits a form", () => {
		render(
			<IconButton label="Close">
				<svg />
			</IconButton>,
		)
		expect(screen.getByRole("button")).toHaveAttribute("type", "button")
	})

	it("fires onClick", async () => {
		const onClick = vi.fn()
		render(
			<IconButton label="Close" onClick={onClick}>
				<svg />
			</IconButton>,
		)
		await userEvent.click(screen.getByRole("button"))
		expect(onClick).toHaveBeenCalledOnce()
	})

	it("hides the glyph from assistive technology", () => {
		render(
			<IconButton label="Close">
				<svg data-testid="glyph" />
			</IconButton>,
		)
		expect(screen.getByTestId("glyph").parentElement).toHaveAttribute(
			"aria-hidden",
			"true",
		)
	})
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `pnpm vitest run components/ui/IconButton.test.tsx`
Expected: FAIL, cannot resolve `@/components/ui/IconButton`.

- [ ] **Step 4: Write the primitive**

Create `components/ui/IconButton.tsx`:

```tsx
import type { ReactNode } from "react"

type IconButtonProps = {
	/** Becomes both the accessible name and the tooltip. Name the action. */
	label: string
	onClick?: () => void
	type?: "button" | "submit"
	className?: string
	children: ReactNode
}

/**
 * A square control whose only content is a glyph. 36px is the hit area, which
 * clears the 24px WCAG 2.5.8 minimum with room, while the glyph itself sits at
 * 18px to stay in scale with the nav's 14px text.
 *
 * The cursor comes from the base rules in app/globals.css, not from here.
 */
export function IconButton({
	label,
	onClick,
	type = "button",
	className,
	children,
}: IconButtonProps) {
	return (
		<button
			type={type === "submit" ? "submit" : "button"}
			onClick={onClick}
			aria-label={label}
			title={label}
			className={[
				"grid h-9 w-9 place-items-center rounded-sm border border-line text-fg-2",
				"transition-colors duration-[var(--duration-fast)]",
				"hover:border-fg-2 hover:text-fg active:text-accent",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<span aria-hidden="true" className="contents">
				{children}
			</span>
		</button>
	)
}
```

- [ ] **Step 5: Run it to verify it passes**

Run: `pnpm vitest run components/ui/IconButton.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Write the failing ThemeToggle test**

Replace the contents of any existing theme toggle test, or create `components/nav/ThemeToggle.test.tsx` if none exists:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

const setTheme = vi.fn()

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "dark", setTheme }),
}))

describe("ThemeToggle", () => {
	it("names the action, not the current state", async () => {
		render(<ThemeToggle />)
		expect(
			await screen.findByRole("button", { name: "Switch to light theme" }),
		).toBeInTheDocument()
	})

	it("renders no visible text once mounted", async () => {
		render(<ThemeToggle />)
		const button = await screen.findByRole("button")
		expect(button.textContent).toBe("")
	})
})
```

- [ ] **Step 7: Run it to verify it fails**

Run: `pnpm vitest run components/nav/ThemeToggle.test.tsx`
Expected: FAIL. The button still renders the visible text "Light".

- [ ] **Step 8: Rewrite the toggle**

Replace `components/nav/ThemeToggle.tsx`. The `mounted` flag and its comment stay exactly as they are: that reasoning about next-themes resolving during the client's first render is still correct and still load-bearing. Only the rendering changes.

```tsx
"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { IconButton } from "@/components/ui/IconButton"

// A `mounted` flag, not a check on `resolvedTheme`: next-themes resolves
// `resolvedTheme` during the client's FIRST render (via its own pre-hydration
// script), so checking it here still hydration-mismatches (server renders the
// placeholder, client's first pass already renders the real button). The
// `mounted` state only flips true in a useEffect, which runs after hydration
// has already reconciled, so both the server and the client's first render
// agree on the placeholder.
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		// Same 36px box as the real button, so the nav does not reflow on mount.
		return (
			<div aria-hidden="true" className="h-9 w-9 rounded-sm border border-line" />
		)
	}

	const isDark = resolvedTheme === "dark"
	const nextTheme = isDark ? "light" : "dark"

	// The label names the ACTION. The old button showed the target theme's name
	// as visible text, which read equally well as a statement of the current
	// state. An icon plus an action label cannot be misread that way.
	return (
		<IconButton
			label={`Switch to ${nextTheme} theme`}
			onClick={() => setTheme(nextTheme)}
		>
			{isDark ? (
				<SunIcon size={18} weight="light" />
			) : (
				<MoonIcon size={18} weight="light" />
			)}
		</IconButton>
	)
}
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `pnpm vitest run components/nav components/ui`
Expected: PASS.

- [ ] **Step 10: Check the nav still fits on one line**

The button grew from 32px to 36px tall. The nav bar has `min-h-16` (64px) so it still fits vertically, but confirm the dense case does not newly overflow:

```bash
NEXT_PUBLIC_SECTIONS=work,craft,writing pnpm dev
```

Then at 320px wide, confirm the nav wraps its gap rather than overflowing horizontally, which is the existing explicit test requirement in `Nav.tsx`'s comment. Run the existing nav e2e spec too:

```bash
pnpm e2e --grep nav
```

- [ ] **Step 11: Verify the no-JS path**

The toggle is the one control that genuinely requires JavaScript. With JS disabled it renders the placeholder div, which is `aria-hidden` and not focusable, so it is correctly invisible to everyone rather than being a dead button. Confirm in the browser with JavaScript disabled that the nav renders and the theme still follows `prefers-color-scheme`.

- [ ] **Step 12: Full suite, typecheck and commit**

```bash
pnpm test && pnpm typecheck && pnpm e2e
git add package.json pnpm-lock.yaml components/ui components/nav
git commit -m "feat: make the theme toggle an icon button"
```

## Task 5: Route transitions

Fixes the "no transitions anywhere" half of the brief, at zero client JavaScript cost.

Next remounts `template.tsx` on every navigation by design, which is exactly the "re-run an enter animation per route" primitive, so this needs no `AnimatePresence`, no `usePathname`, and no client boundary. Exit animations are not possible this way and are deliberately skipped: enter-only route motion is both the tasteful default and the free one.

**Files:**
- Create: `app/template.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/interaction.spec.ts` (extend)

**Interfaces:**
- Consumes: `--duration-route` from Task 1.
- Produces: nothing other units import.

- [ ] **Step 1: Write the failing e2e test**

Append to `tests/e2e/interaction.spec.ts`:

```ts
test("a route change replays the enter animation", async ({ page }) => {
	await page.goto("/")
	await page.getByRole("link", { name: "About" }).first().click()
	await page.waitForURL("**/about")

	const name = await page
		.locator("[data-route-enter]")
		.evaluate((node) => getComputedStyle(node).animationName)

	expect(name).toBe("route-enter")
})

test("the route animation is off under reduced motion", async ({ browser }) => {
	const context = await browser.newContext({ reducedMotion: "reduce" })
	const page = await context.newPage()
	await page.goto("/about")

	const name = await page
		.locator("[data-route-enter]")
		.evaluate((node) => getComputedStyle(node).animationName)

	expect(name).toBe("none")
	await context.close()
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm e2e tests/e2e/interaction.spec.ts`
Expected: FAIL. No element carries `data-route-enter`.

- [ ] **Step 3: Add the template**

Create `app/template.tsx`:

```tsx
import type { ReactNode } from "react"

/*
 * A template, not a layout: Next remounts this on every navigation, which is
 * what replays the enter animation per route. A layout persists and would only
 * animate once.
 *
 * Server component. The animation is CSS keyed on the data attribute, so route
 * transitions cost no client JavaScript and survive with JS disabled, where the
 * page simply renders with no animation.
 */
export default function Template({ children }: { children: ReactNode }) {
	return <div data-route-enter>{children}</div>
}
```

- [ ] **Step 4: Add the keyframes**

In `app/globals.css`, after the `intro-content` keyframes so the intro rules and the route rules read together:

```css
/*
 * Route transitions. app/template.tsx remounts per navigation, so this replays
 * on every route change without any client JavaScript.
 *
 * Guarded on the intro: the full intro already owns the first paint (the veil
 * plus the logo choreography), and running both would double-animate the first
 * screen a visitor ever sees.
 */
@media (prefers-reduced-motion: no-preference) {
	html:not([data-intro="full"]) [data-route-enter] {
		animation: route-enter var(--duration-route) var(--ease-out-expo) both;
	}
}

@keyframes route-enter {
	from {
		opacity: 0;
		transform: translateY(6px);
	}
	to {
		opacity: 1;
		transform: none;
	}
}
```

- [ ] **Step 5: Run it to verify it passes**

Run: `pnpm e2e tests/e2e/interaction.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Confirm LCP did not regress**

This is the one step in Unit 1 that can touch the existing LCP work. A `translateY` on the wrapper of every page's content puts a transform on the LCP element's ancestor.

```bash
pnpm build && pnpm start
```

Run Lighthouse against `http://localhost:3000/` and `/about`. Compare LCP and the performance score against the numbers recorded in `docs/launch-checklist.md`.

If LCP regresses, drop the `translateY` and animate opacity alone. Record which one shipped in `docs/design.md`. Do not proceed to commit on a regression.

- [ ] **Step 7: Commit**

```bash
git add app/template.tsx app/globals.css tests/e2e/interaction.spec.ts
git commit -m "feat: add enter animations on route change"
```

## Task 6: The scroll reveal and the drawn rule

The two motion primitives Units 2 to 4 compose with. `DrawRule` is the cut motif at rule scale: the site's hairlines stop being static borders and start drawing themselves, which is the thesis applied at its smallest.

**Files:**
- Create: `components/motion/Reveal.tsx`
- Create: `components/motion/Reveal.test.tsx`
- Create: `components/motion/DrawRule.tsx`
- Create: `components/motion/DrawRule.test.tsx`

**Interfaces:**
- Consumes: `duration` and `easing` from `@/lib/motion`.
- Produces:
  - `<Reveal as? delayIndex? className? children />` where `delayIndex` multiplies `--duration-stagger`
  - `<DrawRule className? />` rendering an `<hr>`

Both are client leaves with `"use client"` at the top, per the interactivity isolation rule. Both honour `useReducedMotion`.

- [ ] **Step 1: Write the failing Reveal test**

Create `components/motion/Reveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Reveal } from "@/components/motion/Reveal"

const reducedMotion = vi.hoisted(() => ({ current: false }))

vi.mock("motion/react", async () => {
	const actual = await vi.importActual<typeof import("motion/react")>(
		"motion/react",
	)
	return { ...actual, useReducedMotion: () => reducedMotion.current }
})

describe("Reveal", () => {
	it("renders its children", () => {
		render(<Reveal>Hello</Reveal>)
		expect(screen.getByText("Hello")).toBeInTheDocument()
	})

	it("renders the requested element", () => {
		render(
			<Reveal as="li" data-testid="item">
				Hello
			</Reveal>,
		)
		expect(screen.getByTestId("item").tagName).toBe("LI")
	})

	it("still renders its children under reduced motion", () => {
		reducedMotion.current = true
		render(<Reveal>Hello</Reveal>)
		expect(screen.getByText("Hello")).toBeInTheDocument()
		reducedMotion.current = false
	})
})
```

The third test is the one that matters: a reveal that hides content when motion is reduced is a content-loss bug, not a motion preference.

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm vitest run components/motion/Reveal.test.tsx`
Expected: FAIL, cannot resolve `@/components/motion/Reveal`.

- [ ] **Step 3: Write Reveal**

Create `components/motion/Reveal.tsx`:

```tsx
"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ComponentProps, ElementType, ReactNode } from "react"
import { duration, easing } from "@/lib/motion"

type RevealProps = {
	as?: "div" | "li" | "section" | "p"
	/** Multiplies --duration-stagger to sequence siblings. */
	delayIndex?: number
	className?: string
	children: ReactNode
} & Omit<ComponentProps<"div">, "children" | "className">

/**
 * Enter on scroll, once. `viewport.once` is deliberate: content that re-animates
 * every time it scrolls back into view is distracting rather than expressive.
 *
 * Under reduced motion this renders the children with no animation at all rather
 * than a faster one, and it never starts them hidden, so nothing can strand
 * content at opacity 0.
 */
export function Reveal({
	as = "div",
	delayIndex = 0,
	className,
	children,
	...rest
}: RevealProps) {
	const reduce = useReducedMotion()
	const Tag = motion[as] as ElementType

	if (reduce) {
		const Plain = as as ElementType
		return (
			<Plain className={className} {...rest}>
				{children}
			</Plain>
		)
	}

	return (
		<Tag
			className={className}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.35 }}
			transition={{
				duration: duration("--duration-slow"),
				delay: delayIndex * duration("--duration-stagger"),
				ease: easing("--ease-out-expo"),
			}}
			{...rest}
		>
			{children}
		</Tag>
	)
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `pnpm vitest run components/motion/Reveal.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write the failing DrawRule test**

Create `components/motion/DrawRule.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { DrawRule } from "@/components/motion/DrawRule"

vi.mock("motion/react", async () => {
	const actual = await vi.importActual<typeof import("motion/react")>(
		"motion/react",
	)
	return { ...actual, useReducedMotion: () => false }
})

describe("DrawRule", () => {
	it("renders a separator", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toBeInTheDocument()
	})

	it("merges a caller className", () => {
		render(<DrawRule className="my-12" />)
		expect(screen.getByRole("separator")).toHaveClass("my-12")
	})

	it("draws from the left", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toHaveStyle({
			transformOrigin: "left",
		})
	})
})
```

- [ ] **Step 6: Run it to verify it fails**

Run: `pnpm vitest run components/motion/DrawRule.test.tsx`
Expected: FAIL, cannot resolve `@/components/motion/DrawRule`.

- [ ] **Step 7: Write DrawRule**

Create `components/motion/DrawRule.tsx`:

```tsx
"use client"

import { motion, useReducedMotion } from "motion/react"
import { duration, easing } from "@/lib/motion"

/**
 * A hairline that draws itself in when it scrolls into view. This is the logo's
 * stroke-drawing language at rule scale, which is what stops the choreography
 * being a one-off intro and makes it the site's vocabulary.
 *
 * scaleX rather than width: width is a layout property and animating it forces
 * layout on every frame.
 */
export function DrawRule({ className }: { className?: string }) {
	const reduce = useReducedMotion()

	return (
		<motion.hr
			className={["border-line border-t", className].filter(Boolean).join(" ")}
			style={{ transformOrigin: "left" }}
			initial={reduce ? false : { scaleX: 0 }}
			whileInView={{ scaleX: 1 }}
			viewport={{ once: true, amount: 1 }}
			transition={{
				duration: duration("--duration-draw"),
				ease: easing("--ease-out-expo"),
			}}
		/>
	)
}
```

- [ ] **Step 8: Run it to verify it passes**

Run: `pnpm vitest run components/motion/DrawRule.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 9: Full suite, typecheck, lint, commit**

```bash
pnpm test && pnpm typecheck && pnpm lint
git add components/motion
git commit -m "feat: add scroll reveal and drawn rule motion primitives"
```

## Task 7: Document the foundation and open the PR

**Files:**
- Modify: `docs/design.md`

- [ ] **Step 1: Write the Motion section additions**

In `docs/design.md`, under "Motion", add `--duration-route` to the token table with the value `240ms` and the use "route enter". Then add a subsection recording the decisions this unit made:

- The motion vocabulary is the logo's own: stroke-drawing, the diagonal cut, and the weave. `DrawRule` is that language at rule scale. Anything new should extend this vocabulary rather than introduce a second one.
- Token reading lives in `lib/motion.ts`. Components read tokens through `duration()` and `easing()`, never with their own `getComputedStyle` call.
- Route transitions use `app/template.tsx` plus CSS, not `AnimatePresence`. Enter only. They are suppressed while `data-intro="full"` so the intro owns the first paint alone.
- Links have three variants and the hierarchy is meaningful: `primary` for a destination the page wants taken, `secondary` for supporting destinations, `quiet` for navigation and tertiary links.
- Icons are `@phosphor-icons/react` at `weight="light"`, `size={18}`. One family for the project, imported per icon.
- Interactive cursors come from the base layer in `app/globals.css`, not per component.

- [ ] **Step 2: Verify the whole unit**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm e2e
```

Expected: typecheck clean, lint clean, unit tests pass with the count risen from 141 to roughly 164, e2e pass with the count risen from 40 to 44.

- [ ] **Step 3: Commit and open the PR**

```bash
git add docs/design.md
git commit -m "docs: record the motion foundation decisions"
git push -u origin feat/redesign-foundation
gh pr create --title "feat: redesign foundation, motion system and interaction primitives" --body "..."
```

The PR body should state what changed for a visitor (the theme toggle became an icon button, controls have cursors, routes animate in) and what did not (no page composition changed yet), plus the Lighthouse comparison from Task 5 Step 6.

- [ ] **Step 4: Review**

Run `/code-review medium` on the diff. This unit touches no auth, payments, migrations or public APIs, so the multi-agent review is not warranted. Address findings, then request merge.

---

# Units 2 to 5: deliverables and interfaces

These get stepped out once Unit 1 merges. Each one starts by re-reading this section and the primitives Unit 1 actually shipped.

## Unit 1b: The mobile nav and the mark's scale

Branch `feat/redesign-nav-and-mark`, stacked on Unit 1. Added on 2026-08-31 after
Andre flagged the mobile nav and the mark's size. Both are shell work, so they sit
between the foundation and Home rather than inside either.

**The mobile nav is broken, measured.** At 320px the bar has 280px of usable
width. One line needs 269px (logo 28, gap 16, then Writing 49, About 40, Contact
52, toggle 36 and three 16px gaps). It fits by 11px and wraps anyway, so the
toggle is orphaned on a second line, right aligned under the links, with the mark
floating at bottom left out of alignment with everything. It reads as an accident.
With all five sections visible it needs 371px against 280 and can never fit.

**The mark is smaller than its box.** Its ink occupies 80% of the viewBox width
and 59% of the height, so `size-7` renders 22.4 x 16.4px of actual mark. The
perceived size is 16px, not 28px, and 41% of the vertical box is empty padding.

**Rejected: a bottom bar with icons.** `docs/design.md` "Register" says "no icon
font" and the register is editorial, so a bottom tab bar is a bigger departure
than "evolve the bones" allows. The icons would also be worse than the words:
there is no clear glyph for "About", and none that separates "Craft" from "Work"
when both are work. The labels are 5 to 7 characters and unambiguous. A fixed
bottom bar is also the most fragile place for persistent UI on mobile web, since
it fights iOS Safari's own bottom chrome and the home indicator.

**Chosen: a large mark plus a text "Menu" sheet.** Below `sm` (640px) the bar
carries the mark on the left and the theme toggle plus a text "Menu" on the right.
"Menu" opens a full-screen sheet with the links set in display type. At `sm` and
up the bar is the single text row it is today. The sheet is a native `<dialog>`
driven by `showModal()`, which gives focus trapping, Escape and the top layer
without a hand-rolled focus trap. It is also the mobile motion moment: the logo's
diagonal cut draws across the sheet on open, which is the thesis applied where
there was previously no identity at all.

**The crop.** `LOGO_VIEW_BOX` becomes `93 200 814 600`: the ink bounds
(x 100 to 900, y 207 to 793) padded by 7 units, which is half of `LogoDraw`'s
`STROKE_WIDTH` of 14, so the stroke cannot clip mid-draw. Aspect becomes 814:600,
so every consumer needs a landscape box rather than a square one. Sizes are then
set deliberately: 28px of real ink in the desktop bar, 36px on mobile.

**What the crop touches, and the trap in it.** `LogoIntro`'s overlay is `size-32`
and docks into `NavLogo`'s `size-7` through a shared `layoutId`. Both boxes have to
change together or the dock animates into the wrong shape. Also `NavLogo` uses one
`SIZE` constant in five places, `components/craft/demos/LogoDrawDemo.tsx` renders
the mark at `size-full`, and `docs/design.md` records 1.75rem as the docked size.

**What it does not touch.** `app/icon.svg` keeps its square `viewBox="100 100 800
800"`, because a favicon paints into square browser chrome and a 1.357:1 crop
would letterbox there. `app/icon.test.ts` asserts the polygon points and the four
hex values, never the viewBox, so the crop leaves it passing. That divergence is
deliberate and belongs in `docs/design.md`.

**Verification.** The dock has to be watched, not assumed: a first visit at
desktop and at 320px, confirming the mark lands in the bar at the right size and
shape. The sheet needs Escape, a click outside, focus returning to the Menu
button on close, and no page scroll behind it. Lighthouse accessibility stays 100.

## Unit 2: Home

Branch `feat/redesign-home`. Fixes audit findings 3, 4, 7 and 8.
Stepped out into tasks below, under "Unit 2: Home, stepped out".

**Deliverable.** Home stops being the shared template and becomes four movements: a hero, a full-bleed mono facts band, a split of bio against Selected writing, and a large contact close. The page gains real scroll height, which is the precondition for every scroll-driven primitive from Task 6.

**The hero cut.** The name is set at `--text-hero` and a 1px accent diagonal draws across the letterforms on load, reusing `--duration-cut` and the stroke-draw technique from `LogoDraw`. It is a `CutLine` client leaf over the heading. With JavaScript off, or under reduced motion, the line renders statically at full length rather than disappearing. This is the first place the accent has ever appeared on Home.

**Structure below the fold.**
1. Full-bleed band on `--color-bg-2` carrying the three mono facts (role, employer, location) spread across the container with no boxes and no borders per item.
2. A split: the two-paragraph bio at `--container-measure` on the left, a Selected writing list on the right. This is what finally uses the 62rem container instead of leaving a dead right rail.
3. A contact close: the email at display scale, the four socials as `quiet` links beneath it. This replaces the bare copyright footer, which moves into this block as a single small line.

**Constraints.** The Work rows slot stays unbuilt because Work stays hidden; the split above is what fills that space instead. Every link uses `TextLink` with a deliberate variant. `FACTS` currently sits hardcoded in `app/page.tsx` with a comment explaining that no content schema covers it; either keep that comment accurate or move the facts into `content/site.yaml`, but do not leave the comment describing something that is no longer true.

**Verification.** `body.scrollHeight` must exceed `innerHeight` at 1440x900, which is the direct fix for audit finding 4. At least one element must compute to the accent colour on `/`, which is the direct fix for finding 3. Both belong in the e2e suite as regression guards.

## Unit 3: The content pages

Branch `feat/redesign-pages`. Fixes audit finding 1 for About, Writing, Contact and 404.

**Deliverable.** Each page gets a composition of its own instead of the shared `h1` plus grey subtitle. About already has the most structure and needs the least: mainly the CV timeline reworked so it is not six rows each with its own hairline. Writing gains a real list treatment. Contact and 404 each get a single deliberate idea rather than the template.

All eleven pasted link strings are gone by the end of this unit. Verify with the same grep from the audit; it must return nothing outside `components/ui/Link.tsx`.

**Copy.** The copy pass is a separate open item and is explicitly not in scope here, with one exception: `aboutStatement`'s "Fourteen years of building for the web" is correct today and silently wrong from 2027, so it either becomes derived from a start year or gets rephrased.

## Unit 4: Work and Craft

Branch `feat/redesign-hidden-sections`. Both stay flagged off on every published environment; `NEXT_PUBLIC_SECTIONS` is not changed anywhere.

**Re-sequenced on 2026-09-01: Unit 4b ships first.** This unit was stepped out
before the sidebar was decided, and its four routes are all composed inside the
shell the sidebar rewrites. See "# Unit 4b: The sidebar navigation, stepped out"
at the end of this document. The step-out below stands as written; only its
position moved.

**Deliverable.** Both sections rebuilt on the primitives so they are ready to turn on when their content exists. Craft's rework is the larger of the two and folds in the `kind: video` demo branch, which currently has no build-time check that the file exists.

**Carried from the Unit 1 review.** `app/template.tsx` remounts on every
navigation, including a search-param-only change, so `WorkFilter`'s
`/work?tag=<kind>` links replay the full route-enter animation and remount the
Suspense boundary around the filter. That regresses what U7 deliberately built
as a CSS-only, no-reflow interaction. It is latent today (with one work entry
the filter does not render, verified against a build with every section on), so
the rework has to solve it rather than inherit it. Either drive the filter
without a navigation, or scope the route animation to exclude same-route param
changes.

**Gate.** These stay hidden regardless of how good they look. Craft needs three published pieces as a floor, and Work needs real heroes.

## Unit 5: The extruded mark

Branch `feat/redesign-3d-mark`. Ships behind a flag, off by default.

**Deliverable.** `LETTER_A`, `LETTER_B` and `CUT` from `LogoMark.tsx` become `THREE.Shape` paths fed to `ExtrudeGeometry`, so the weave that `LOGO_WEAVES` currently fakes with two `clipPath` rects becomes real geometry. The mark sits beside the hero name and reacts to the pointer. No model file, no textures, no loader.

**Non-negotiables.**
- The static `LogoMark` SVG is the fallback and renders for no-JS, for `prefers-reduced-motion`, and below the mobile breakpoint. The 3D layer is additive and never the only way the mark exists.
- Pointer tracking uses `useMotionValue` and `useTransform`, never `useState`. State-driven pointer tracking re-renders the tree every frame and collapses on mobile.
- The canvas is dynamically imported and never in the initial bundle. three.js is large and the hero is above the fold, so it must not become the LCP element or block it.
- Never mix motion and three.js in the same component tree; they compete for the same frames.
- Follow the `r3f-best-practices` skill for fiber v9 and React 19 specifics before writing any of it.

**Gate.** This is the one unit that can genuinely break the performance work. Measure LCP and the performance score before and after. The agreed stance is identity first and measure after, but if the 3D mark costs the LCP work outright, it stays behind the flag until it does not.

---

---

# Unit 2: Home, stepped out

Stepped out on 2026-08-31 after Unit 1b merged (`main@28c74f9`). Branch
`feat/redesign-home`. Read "## Unit 2: Home" above, plus `docs/design.md`
"The motion vocabulary", "The theme swap" and "How the intro hides the page",
before starting. Every trap recorded there applies to this unit.

**What Unit 1 actually shipped, which is not what its own steps predicted.**
`Reveal` and `DrawRule` are SERVER components carrying `data-reveal` and
`data-draw-rule`; the animation is a CSS scroll timeline in `app/globals.css`.
They take no `delayIndex` and no motion props. `Reveal` accepts
`as`, `className` and pass-through div attributes. The reason is the no-JS
contract: motion's `initial` serialises `style="opacity:0"` into the server
HTML, so a visitor whose bundle never arrived got permanently invisible
content. Anything this unit adds follows the same rule.

**Decisions taken before stepping out.**

1. **The Selected writing list stays** (André, 2026-08-31). `docs/design.md`
   "Page decisions" currently says the opposite: "Home is a calling card, not an
   index. Writing does not appear on Home." That line is superseded and Task 7
   amends it. Today the list renders one entry, which is accepted.
2. **The facts move into `content/site.yaml`**, per this plan's open question 1.
   The band promotes them to a real page section, so they stop being a
   hardcoded side rail with a comment apologising for itself.
3. **`components/motion/CutLine.tsx` is NOT created.** The file structure table
   above lists it, but the hero is its only consumer in this unit and a
   component with one call site is indirection, not a primitive. It is one
   `<span data-hero-cut>` plus a CSS rule. Extract it when Unit 3 or Unit 5
   needs a second one.

**Interfaces consumed:** `TextLink` and `LINK_CLASS` from
`@/components/ui/Link`, `Reveal` from `@/components/motion/Reveal`, `DrawRule`
from `@/components/motion/DrawRule`, `getSite` and `getAll` from
`@/lib/content`, `isVisible` from `@/lib/sections`, `formatDate` from
`@/lib/site`.

## Task 1: The facts become content

**Files:**
- Modify: `lib/schemas.ts`
- Modify: `content/site.yaml`
- Modify: `lib/content.test.ts`

- [ ] **Step 1: Extend the site schema**

Add to `siteSchema`:

```ts
facts: z.array(z.object({ label: z.string(), value: z.string() })),
```

Required, not optional. The band is a page section now, so a `site.yaml`
without facts is a broken Home and should fail the build rather than render an
empty band.

- [ ] **Step 2: Add the failing test**

In `lib/content.test.ts`, assert `getSite()` returns the three facts in file
order, and that a `site.yaml` missing `facts` throws. Run
`pnpm vitest run lib/content.test.ts` and confirm it fails before the yaml
change.

- [ ] **Step 3: Move the values**

Into `content/site.yaml`, verbatim from `app/page.tsx`:

```yaml
facts:
  - label: Role
    value: Sr. Software Engineer
  - label: At
    value: Metalab, since 2024
  - label: Based in
    value: Aguascalientes, MX
```

Delete `FACTS` and its four-line comment from `app/page.tsx`. The comment says
no content schema covers the facts, which stops being true in this task, and
this plan's global rule is that a comment must not describe something that no
longer holds.

- [ ] **Step 4: Verify**

`pnpm vitest run lib/content.test.ts` passes. `pnpm typecheck` clean.

## Task 2: The hero and its cut

The first accent pixel Home has ever had (audit finding 3), and the first place
the logo's diagonal is quoted outside the logo.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Set the hero**

The name at `--text-hero` (it exists in `@theme` and is currently used by
nothing), the positioning line under it keeping the existing `Positioning`
highlight component. The heading and the cut share one wrapper:

```tsx
<div className="relative overflow-hidden">
  <h1 className="font-medium text-hero tracking-[-0.03em]">{site.name}</h1>
  <span data-hero-cut aria-hidden />
</div>
```

`overflow-hidden` is load-bearing, not tidiness: the cut runs at the mark's own
angle, which drops half its width, so across a hero-width heading it leaves the
box on both ends. Clipped to the heading, what you see is a cut through the
name. Unclipped it would cross the nav and the band below.

- [ ] **Step 2: Write the cut's CSS**

In `app/globals.css`, after the theme-swap block:

```css
/*
 * The hero cut. The mark's diagonal runs (100,700) to (900,300) in its viewBox,
 * 400 down over 800 across, so its angle is atan(0.5) = 26.57deg. Same number
 * the nav sheet and the theme swap express as 50vw over 100vw; here it has to
 * be an angle rather than a clip-path because the line is a real 1px object
 * over type, not a boundary between two fills.
 *
 * The resting state is the finished line at full length. That is the whole
 * fallback: no JavaScript, no CSS animation support or reduced motion all land
 * on a static accent diagonal across the name rather than on nothing. The
 * animation below is purely additive.
 */
[data-hero-cut] {
	position: absolute;
	left: -10%;
	top: 50%;
	width: 120%;
	height: 1px;
	background-color: var(--color-accent);
	transform-origin: left center;
	transform: rotate(-26.57deg) scaleX(1);
}
```

`rotate` then `scaleX`, in that order, so the scale runs along the rotated axis
and the line grows from its own start point. Reversed, it scales horizontally
and the angle changes as it draws.

- [ ] **Step 3: Key the animation on the intro's terminal states**

```css
@media (prefers-reduced-motion: no-preference) {
	html[data-intro="done"] [data-hero-cut],
	html[data-intro="inline"] [data-hero-cut] {
		animation: hero-cut var(--duration-cut) var(--ease-standard) both;
	}
}

@keyframes hero-cut {
	from {
		transform: rotate(-26.57deg) scaleX(0);
	}
	to {
		transform: rotate(-26.57deg) scaleX(1);
	}
}
```

This is the exact inverse of the route-transition trap in `docs/design.md`, and
the reason has to be understood before touching it. A CSS animation starts when
an element BEGINS matching its selector. For the route rule that was a bug: the
`full` to `done` flip restarted it on content already painted. Here it is the
mechanism. `data-intro` is `full` for the 2.2s the veil is up and flips to
`done` when the mark docks, so an ungated cut would draw itself behind an opaque
sheet and be finished before anyone saw it. Gated, it starts the frame the veil
lifts. A return visit is `inline` and never becomes `done`, which is why both
states are listed. A client-side navigation to `/` mounts the span while a
terminal state already matches, so the cut replays per visit to Home, which is
wanted. With JavaScript off there is no `data-intro` at all and the static line
is what renders, which is the documented fallback for every rule in this file.

- [ ] **Step 4: Watch it**

`pnpm build && pnpm start` on the visible port. Check, in this order:

1. A first visit in a fresh tab: the cut draws AFTER the veil lifts, not during.
2. A reload in the same tab (`inline`): it draws.
3. A client-side navigation from `/about` back to `/`: it draws.
4. JavaScript disabled: the line is there, full length, static.
5. `prefers-reduced-motion: reduce`: same, static.
6. 320px: the heading wraps or does not, and the cut still reads as one line
   across it. If the wrap makes it nonsense, cut the angle's span rather than
   the angle.

300ms across a hero is fast, and `--duration-cut` is the token the plan calls
for because it is the same gesture as the mark's. If it reads as a flick rather
than a stroke, `--duration-sweep` (500ms) is the other honest choice, for the
reason recorded on the nav sheet: a travelling object wants to pick up speed and
settle. Pick one in the browser, do not guess here.

## Task 3: The facts band

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Restructure the page root**

`app/page.tsx` currently opens with one `mx-auto max-w-wide px-gutter py-section`
wrapper around everything, which no full-bleed band can escape. The page becomes
a fragment of sections, each owning its own container. `main` in
`app/layout.tsx` has no container of its own, so nothing else has to change.

- [ ] **Step 2: The band**

Full-bleed `bg-bg-2`, the three facts from `site.facts` in mono, spread across
the container, no per-item border and no boxes. Stacked below `sm` and a row
above it: "Sr. Software Engineer" and "Aguascalientes, MX" cannot share a
320px line, and squeezing them is what the audit's dead right rail already was.
Keep the `<dl>`: three label and value pairs are a description list, and the
markup is what a screen reader gets.

- [ ] **Step 3: Verify**

The band's fill runs edge to edge at 1440 with the text still aligned to the
62rem container. Nothing overflows horizontally at 320px.

## Task 4: The split

The fix for audit finding 7, the dead right rail. This is what finally uses the
62rem container.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Divide with a DrawRule**

The `<hr className="my-12 border-line" />` above the bio becomes `<DrawRule />`.
One line, and it is the first place on the site where the vocabulary shows up
in a hairline rather than in the logo.

- [ ] **Step 2: The two columns**

Left: both bio paragraphs at `max-w-measure`, then a `TextLink variant="primary"`
to `/about`. Primary is correct here by the hierarchy Unit 1 settled: it is the
destination the page wants taken.

Right: "Selected writing". A mono uppercase `--text-meta` heading, then up to
three posts from `getAll("writing")` (already sorted newest first), each a
`TextLink` on the title with its date in mono beneath, then a
`TextLink variant="quiet"` to `/writing`.

Wrap both columns in `Reveal`.

- [ ] **Step 3: Gate the column, and handle the empty case**

The right column renders only when `isVisible("writing")`. With the flag off,
`/writing` 404s by design (`lib/rewrites.ts` plus `notFound()`), so an ungated
column ships dead links to a section that does not exist. When it is hidden the
bio takes the full width rather than leaving the grid column empty, which would
recreate finding 7 exactly.

`getAll("writing")` filters drafts in production and not in development, so the
production list can be shorter than the local one, and can be empty. An empty
list renders no column at all, same branch as the flag being off. Do not paste
`PostList`'s "Nothing published yet." here: that copy is right for a section
index and wrong for a curated Home slot.

- [ ] **Step 4: Verify**

At 1440 the split fills the container with no dead space below either column.
Below `min-[760px]` it is one column, bio first. `NEXT_PUBLIC_SECTIONS=work,craft`
renders Home with a full-width bio and no writing column, and no console
warning.

## Task 5: The contact close, and the footer

Audit finding 8.

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: The close**

The email at `--text-display` as a `TextLink variant="primary"` (a `mailto:`, so
`TextLink` correctly renders a plain anchor and does not prefetch it as an RSC
payload), the four socials beneath it as `quiet` links with `external`. This
replaces the `border-t` block currently labelled "Reach me" and the eleven-times
pasted class strings inside it.

- [ ] **Step 2: Fix the footer where it lives**

Do not fold the copyright into Home's contact block. The footer in
`app/layout.tsx` is global, so moving it fixes Home and leaves the other six
pages without one until Unit 3, and Home with two closing lines in the meantime.
Finding 8 is not that the copyright is in a footer, it is that the line occupies
a full band and is aligned to the viewport rather than to the page. Both are one
edit: drop the `border-line border-t`, align it to `mx-auto max-w-wide` like
every other block on the site, and tighten the vertical padding. Every page gets
the fix at once.

- [ ] **Step 3: Verify**

`grep -rn 'underline decoration-1 decoration-line underline-offset-4' app` no
longer matches `app/page.tsx`. The remaining hits are Unit 3's work.

## Task 6: The regression guards

Both audit findings this unit closes are measurements, so both become e2e
assertions. Neither can be a unit test: they are computed style and layout in a
real browser.

**Files:**
- Create: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Scroll height**

At 1440x900, `document.body.scrollHeight` must exceed `window.innerHeight`. This
is finding 4 ("the whole site is one screen", measured at exactly 900) and it is
the precondition for every scroll-driven primitive Unit 1 built, so a future
refactor that flattens Home back to one screen silently disables `Reveal` and
`DrawRule` across the page.

- [ ] **Step 2: The accent**

Sweep every element on `/` and assert at least one computes to the accent. A
sweep rather than an assertion on `[data-hero-cut]`, because finding 3 was
measured as a sweep: the assertion should be "the brand colour appears on Home",
which stays true if the cut is later replaced by something else that carries it,
and fails if the accent quietly leaves the page again.

Read the expected value from the stylesheet rather than hardcoding
`rgb(99, 212, 191)`: `getComputedStyle(document.documentElement)
.getPropertyValue("--accent")`. Hardcoded, the test has to be edited in two
places if the palette ever moves, and this plan's palette rule means a
hardcoded hex here is a second source of truth for it.

Check `color`, `background-color`, `border-*-color` and
`text-decoration-color`. Both accent values (dark `#63d4bf`, light `#0e7c69`)
have to be considered, or the test depends on which theme the runner lands in;
reading the live custom property handles that by itself.

- [ ] **Step 3: Verify**

`pnpm e2e` passes with the count risen from 48 to 50. Then break each
assertion deliberately once (comment out the band, comment out the cut) and
confirm the matching test fails. An untested guard is not a guard.

## Task 7: Document, verify, ship

**Files:**
- Modify: `docs/design.md`

- [ ] **Step 1: Amend "Page decisions"**

The "Home is a calling card, not an index. Writing does not appear on Home"
paragraph is now wrong and has to be rewritten, not appended to. Record what
replaced it: Home is four movements (hero and cut, facts band, bio against
Selected writing, contact close), the writing slot is three curated entries
gated on the section flag rather than an index, and the Work rows slot still
goes above the contact close when Work becomes visible.

Also update the follow-up list: the contact strip André wanted reworked later
has now been reworked, and the copy pass is still open.

- [ ] **Step 2: Add the hero cut to "The motion vocabulary"**

One bullet, carrying the thing that is not obvious from the code: the cut is
keyed on `data-intro="done"` and `"inline"`, and that gating is deliberate and
is the exact inverse of the route rule that must not be gated. State why for
both, or the next person reading two rules with opposite treatment will
"fix" one of them. Also record that the resting state is the finished line, so
no-JS and reduced motion land on a static diagonal.

- [ ] **Step 3: Record the content move**

The facts live in `content/site.yaml` and are required by `siteSchema`.

- [ ] **Step 4: Verify the whole unit**

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm e2e
```

Expected: clean, unit tests risen from 178 to roughly 181, e2e from 48 to 50.

- [ ] **Step 5: Lighthouse**

Mobile Lighthouse on `/` against a production build, compared with Unit 1b's
99 / accessibility 100 / LCP 2.5s / CLS 0. Home gains real scroll height and a
larger heading in this unit, so LCP is the number at risk. Accessibility must
stay 100: a 1px accent line over display type is decorative and `aria-hidden`,
but the band's contrast on `--color-bg-2` is a real check in both themes.

- [ ] **Step 6: Screenshots**

Capture against the production build, not the dev server. `gh` cannot upload
them (`user-attachments` is web-editor only), so put the filenames in the PR
body as placeholders and hand André the folder to drag in.

- [ ] **Step 7: Commit and open the PR**

Conventional commits, single line, one per task where the tasks are separable.
Never `--body` on `gh pr create`: it bypasses the repo's PR template.

- [ ] **Step 8: Review**

`/code-review medium` on the diff. No auth, payments, migrations or public APIs,
so the multi-agent review is not warranted. Address findings, then request
merge.

## Unit 2b: The hero

Branch `feat/redesign-home-hero`, stacked on Unit 2. Added on 2026-08-31 after
André's read that U2's hero still landed as a basic portfolio hero, which was
correct: U2 built it from one sentence of this plan's prose ("the name at
`--text-hero` and a 1px accent diagonal draws across the letterforms") with no
comps and no design pass behind it.

**What the references settled.** Four were supplied: two Dribbble developer
portfolios, Davide Perozzi's Awwwards SOTD, and a home slider concept. All four
agree on four things, and U2 had none of them.

| | The references | U2 |
| --- | --- | --- |
| Headline | The positioning | The name |
| Name | A mark in a corner | The headline |
| Type | 200px+, two or three lines | 84px, one line |
| Container | The type bleeds or crops past it | Ends at 45% of the width |
| Fold | 100vh | About 470px, then a band |
| Facts | Corner furniture | A separate stripe below the fold |

**What Stitch contributed, and what it did not.** A design system was generated
from a condensed `docs/design.md` so the comps carried the real palette, type
scale and container widths. Two comps landed. The first got the structure right
(three lines, the cut crossing them, facts pinned to the bottom) but kept the type
inside the container at about 68px. The second bled the type off the right edge,
cropping a word, but dropped the accent entirely, which fails audit finding 3.
Neither could draw the mark, so both rendered it as a grey placeholder box. The
build target was comp A's structure plus comp B's bleed. Note for next time: the
generation tool times out at the MCP layer while the job keeps running, so a
timeout is not a failure. Poll `list_screens` rather than retrying, which produced
three duplicate screens here.

**Deliverable.** Home's fold becomes one section: the name as a mono label, the
claim `Finished. Polished. Shipped.` at up to 18rem across three lines, the accent
diagonal crossing all three, the mark oversized and woven with the type, and the
facts on the fold's bottom edge as inline label and value pairs on `--color-bg-2`.

**Decisions and traps, all recorded in `docs/design.md` under "The Home hero".**
The name stays the `h1` while the claim is a `<p>`, because the page is about a
person; inverting them broke the heading-name assertions in `smoke.spec.ts` and
`intro.spec.ts`. `--text-hero` was retuned rather than joined by a second token,
since the headline is its only consumer. `--nav-height` is a new plain custom
property and is asserted at three viewports rather than trusted. Three lines
cannot both bleed off screen and keep the facts on the fold: that is arithmetic,
and the type fills its column instead.

**The slash's angle, corrected here.** Every layer that quoted "the mark's own cut"
had measured the diagonal from (100,700) to (900,300), which runs corner to corner
across the stroke's WIDTH. The slash's own direction is its long edges, (150,638) to
(900,300): 750 across for 337.5 down, so rise 0.45 and 24.23deg rather than 0.5 and
26.57deg. The nav sheet wipe and the theme swap were built on the same wrong figure,
so all three are corrected together and the geometry becomes three tokens instead of
four copies of a number.

**The mark assembles itself.** The mark is `</>` rotated 90 degrees, so the two
carets arrive from the directions they point away from and the slash travels the
line it is drawn on: the carets close over `--duration-draw`, the slash travels over
`--duration-cut`, then the accent draws at page scale over `--duration-sweep`. The
polygon names are inverted from the letters they draw, which is the trap:
`letter-a` is the V and `letter-b` is the A.

**Verification.** 184 unit and 57 e2e. Mobile Lighthouse 97-99, accessibility 100,
LCP 2.0-2.5s (bimodal on this page, because on a first visit LCP is the moment the
intro veil lifts), CLS 0. Three guards were confirmed to fail when the thing they
guard is broken: the fold guard on a wrong `--nav-height`, the angle guard on the
old 26.57deg figure, and the apex guard on a flipped expectation.

---

---

# Unit 3: The content pages, stepped out

Stepped out on 2026-08-31 after Unit 2b merged (`main@b5b1a1c`). Branch
`feat/redesign-pages`. Read "## Unit 3: The content pages" above, plus
`docs/design.md` "The motion vocabulary", "The slash's real angle" and "Page
decisions", before starting. Every trap recorded there applies here.

**Why this unit exists.** Audit finding 1: `grep -rln 'text-display
tracking-\[-0.025em\]' app` still returns `about`, `writing`, `contact`,
`work`, `craft` and `not-found`. Home left the template in U2, so what is left
is six pages that are one page with different strings. Finding 2 is the same
story in miniature: eight files still paste the same link class string, so a
primary path and a social handle render identically.

**What U2 taught, which this unit inherits.** A page composed from one sentence
of plan prose comes out as a bigger version of what it replaced. U2's hero had
to be rebuilt as U2b against real references. So all four pages here were
comped first, in Stitch, against `docs/design.md` (design system
`assets/6405388263773352760`, project `9825788623028959278`):

| Page | Screen |
| --- | --- |
| About | `screens/2b0254a0009f4e77ab0b56b26c18e8d0` |
| Writing | `screens/6a50f7cd24a84277b4e61b6eead927e8` |
| Contact | `screens/3953c17f516a403faba0a16f5412ef84` |
| 404 | `screens/42fa6af09c2a4f9fb29537219eceae8a` |

The comps are directional, not literal. Two things in them are rejected
outright and must not be copied: the 404 comp fakes the severed halves with a
drop shadow, and the Contact comp puts the accent line straight through the
address so it reads as a strikethrough on a dead mailbox. Both are solved below
with the mark's own techniques instead.

**Decisions taken before stepping out.**

1. **Each page's `h1` is the document heading, not the visual one.** U2b settled
   this on Home and it is now a site rule rather than a one-off: the name is the
   `h1` at `--text-meta` while the claim runs at forty times the size. Writing and
   Contact follow it (`h1` small, the post titles and the address are the visual
   headline). About and 404 do not need to, because on those pages the document
   heading and the visual headline are the same element. Recorded here because the
   next person will otherwise read Writing's small `h1` as a mistake.
2. **About's `h1` becomes the name, not the word "About".** "About" is a nav
   label. The page is about a person, and the heading a crawler lands on should be
   that person.
3. **`components/motion/CutLine.tsx` IS created now.** U2 decision 3 deferred it
   with "extract it when Unit 3 or Unit 5 needs a second one". Contact needs a
   second and 404 a third, so the `<span data-hero-cut>` plus its CSS rule becomes
   one component with an over/under variant. Home switches to it in the same task.
4. **No vertical `DrawRule`.** The two spines are a `data-spine` attribute plus one
   CSS block on a list that already exists. A component with no props and no
   children is indirection, not a primitive.
5. **`aboutStatement` gets rephrased, not derived.** "Fourteen years of building
   for the web" is silently wrong from 2027. A derived count reads from a start
   year at *build* time, so it is equally wrong on a deployed build that nobody has
   redeployed since January, and costs a schema field to be wrong in a subtler way.
   The statement becomes "Building for the web since 2012, most of it on the front
   end." One string, no code, correct forever.
6. **`site.yaml` gains `timezone`.** Contact's fold furniture carries it, and a
   contact page for a remote senior engineer that omits the timezone is missing the
   one fact the reader actually needs. One required string.
7. **The copy pass stays out of scope**, per the unit's own brief, with decision 5
   as the single exception.

**Interfaces consumed:** `TextLink` and `LINK_CLASS` from
`@/components/ui/Link`, `Reveal` from `@/components/motion/Reveal`, `DrawRule`
from `@/components/motion/DrawRule`, `CutLine` from
`@/components/motion/CutLine` (new, Task 2), `getSite` and `getAll` from
`@/lib/content`, `getCv`, `formatPeriod` and `parseEmphasis` from `@/lib/cv`,
`isVisible` from `@/lib/sections`, `formatDate` from `@/lib/site`.

**Standing constraints this unit must not break.**

- `tests/e2e/hidden.spec.ts` compares every hidden route's 404 body to an unknown
  route's **byte for byte**. Nothing on the 404 may vary by route, by time, or by
  a random value. A `Math.random()` offset on the severed halves fails this.
- Both specs assert the 404's `h1` reads exactly `Whoops,` and that its computed
  `font-size` exceeds 24px, and that a link named `Go back home` is visible. The
  giant figures are decoration and must be `aria-hidden`, not the heading.
- `smoke.spec.ts` asserts `main h3` on About equals the number of experience
  entries in `content/cv.yaml`. The spine rows keep `h3` on the role, and nothing
  else on About may become an `h3`.
- No horizontal scroll at 320, 375 and 1440 on about, contact and writing, already
  asserted. Contact's address at display scale is the live risk.

## Task 1: The link primitive finishes its job

Audit finding 2, closed. Eight files, eleven pasted strings, none of them left.

**Files:**
- Modify: `app/about/page.tsx`, `app/contact/page.tsx`, `app/writing/page.tsx`,
  `app/not-found.tsx`, `app/craft/[slug]/page.tsx`
- Modify: `components/cv/CvTimeline.tsx`, `components/work/WorkHeader.tsx`
- Add: `tests/link-usage.test.ts`

- [ ] **Step 1: Add the guard first, and watch it fail**

`tests/link-usage.test.ts` reads every `.tsx` under `app/` and `components/` and
asserts the string `underline decoration-1 decoration-line underline-offset-4`
appears in `components/ui/Link.tsx` and nowhere else. Run it and confirm it
fails naming seven files.

This is a grep the plan already asks to be run by hand; a test is the version
that keeps being run.

- [ ] **Step 2: Replace every occurrence**

Each becomes a `TextLink` with the variant its role calls for:

| Where | Variant | Why |
| --- | --- | --- |
| About "Download CV" | `primary` | The page's one destination |
| About CV company links | `secondary` | Supporting, in-flow |
| Contact email, Contact socials | rebuilt in Task 6 | |
| Writing RSS | `quiet` | Tertiary |
| 404 "Go back home" | `primary` | The page's only action |
| `craft/[slug]` source link, `WorkHeader` | `secondary` | U4 reworks them; the string still dies here |

`external` on anything off-origin. The `/cv.pdf` and `/feed.xml` comments stay:
both explain why the href is not a `next/link`, and `TextLink` routes them to a
bare `<a>` for exactly that reason, so the reasoning is still load-bearing.

- [ ] **Step 3: Verify**

`pnpm vitest run tests/link-usage.test.ts` passes. `pnpm typecheck` clean.
`grep -rln 'underline decoration-1 decoration-line underline-offset-4' app components`
returns `components/ui/Link.tsx` alone.

## Task 2: The cut becomes a component

**Files:**
- Add: `components/motion/CutLine.tsx`, `components/motion/CutLine.test.tsx`
- Modify: `app/page.tsx`, `app/globals.css`

- [ ] **Step 1: The component**

```tsx
export function CutLine({ over = false }: { over?: boolean }) {
	return <span data-cut={over ? "over" : "under"} aria-hidden />
}
```

Server component, one attribute, no props beyond the variant. It must stay a
server component for the same reason `Reveal` is one: anything that serialises
an initial style into the HTML can strand a no-JS visitor.

- [ ] **Step 2: Move the CSS**

Rename `[data-hero-cut]` to `[data-cut]` in `app/globals.css`, keeping the
gradient, the `pointer-events: none` and the `--cut-angle` derivation exactly as
they are. Split the stacking:

- `[data-cut="over"]` keeps `z-index: 3`, which is what Home needs so the accent
  is never buried by the mark or the type.
- `[data-cut="under"]` takes `z-index: 0`. This is the whole reason the variant
  exists: an accent line drawn *over* an email address is a strikethrough, and a
  strikethrough on a mailbox says the mailbox is dead. Under the glyphs it reads
  as the mark's cut passing behind the type, which is what it is.

The `html[data-intro="done"] / ="inline"` gate and the `hero-cut` keyframes are
unchanged and now apply to both variants. Rename the keyframe to `cut` while
moving it. Do not touch the gate's logic: it is the inverse of the route rule
and the comment above it explains why.

- [ ] **Step 3: Home switches to it**

`<span data-hero-cut aria-hidden />` becomes `<CutLine over />`. No visual
change is intended; this is the check that the extraction was faithful.

- [ ] **Step 4: Verify**

`CutLine.test.tsx` asserts both variants render the right attribute and carry
`aria-hidden`. `pnpm vitest run` green. `pnpm e2e -- home.spec.ts` green,
including the U2b `getScreenCTM` angle assertion, which is what proves Home's
cut is untouched.

## Task 3: The spine

One CSS block, used by About and Writing. The site's stroke-drawing language at
list scale, the way `DrawRule` is at rule scale.

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: The rule**

```css
[data-spine] {
	position: relative;
}

[data-spine]::before {
	content: "";
	position: absolute;
	inset-block: 0;
	inset-inline-start: 0;
	width: 1px;
	background: var(--color-line);
	transform-origin: top;
}
```

- [ ] **Step 2: The draw**

Inside the existing `@media (prefers-reduced-motion: no-preference)` plus
`@supports (animation-timeline: view())` block that already wraps `[data-reveal]`
and `[data-draw-rule]`, add `[data-spine]::before` with `animation: draw-spine
linear both; animation-timeline: view();`. Range `entry 0% cover 45%`, not the
`entry` window the hairlines use: a career list is taller than the viewport, so
an entry-only range finishes the draw while most of the line is still below the
fold and the effect is invisible.

`@keyframes draw-spine` is `scaleY(0)` to `scaleY(1)`. Transform only, never
`height`, and never opacity (the U2 accessibility finding: axe blends text
colour by opacity, and while this element carries no text, the rule is now
site-wide and there is no reason to make an exception for a decoration).

- [ ] **Step 3: Verify**

Nothing consumes it yet. `pnpm build` clean is the whole check.

## Task 4: About, the career as one line

The comp's structure, with the facts moved. Fixes finding 1 for `/about` and
replaces six rows each closed by its own full-width hairline, which is what made
fourteen years read as a table.

**Files:**
- Modify: `app/about/page.tsx`, `components/cv/CvTimeline.tsx`, `content/site.yaml`

- [ ] **Step 1: The statement**

In `content/site.yaml`, `aboutStatement` becomes `Building for the web since
2012, most of it on the front end.` Decision 5 above. `lib/content.test.ts` needs
no change; the field is already covered.

- [ ] **Step 2: The page head**

`h1` is `site.name` at `--text-display` with `tracking-[-0.025em]`, then
`site.aboutStatement` at `--text-h2` in `text-fg-2` at `max-w-[26ch]`.

Then the mono facts as one horizontal row rather than a 14rem right rail:
`Languages` and `Studied`, built exactly as they are today from `cv.languages`
and `cv.education`, laid out like Home's facts (`flex flex-wrap`, label in
`text-fg-2 uppercase`, value in `text-fg`, all `font-mono text-meta`) but
container-aligned, not full-bleed. A short right rail beside a long list leaves
the same dead space audit finding 7 objected to on Home.

Close the head with a `DrawRule`, replacing the bare `<hr>`.

- [ ] **Step 3: The bio**

Unchanged content at `max-w-measure`, wrapped in `Reveal`.

- [ ] **Step 4: The spine**

`CvTimeline` keeps its signature (`entries: Experience[]`) and loses its
borders. The `<ul>` gains `data-spine` and drops `border-line border-t`; each
`<li>` drops `border-line border-b` and keeps the `11rem minmax(0,1fr)` grid
that `docs/design.md` already documents as the directory row, collapsing at
640px.

The period sits in the mono column, offset from the spine by the gutter. The
role stays an `h3` (the smoke assertion counts them), the location and bullets
are unchanged. Nothing else on the page may become an `h3`.

Under 640px the grid is one column and the spine stays on the left, so the
period reads as a label above its role rather than beside it.

- [ ] **Step 5: The CV link**

`TextLink variant="primary"` on `/cv.pdf`, keeping the mono "PDF, generated from
the same data" note beside it. This is the accent's one appearance on the page.

- [ ] **Step 6: Verify**

`pnpm vitest run` green. `pnpm e2e -- smoke.spec.ts` green, specifically the
`main h3` count and the "Where I have worked" heading, which both still hold.
Check `/about` at 320px for overflow.

## Task 5: Writing, the index

The design problem is stated by the content: there is one published post, and
the page has to look deliberate at one entry and still hold at fifteen. The
comp's answer is that the list *is* the composition, so the titles are the
largest type on the page and the metadata is a mono column beside them.

**Files:**
- Modify: `app/writing/page.tsx`, `components/writing/PostList.tsx`,
  `components/writing/PostList.test.tsx`

- [ ] **Step 1: The head**

`h1` reads `Writing` at `font-mono text-meta uppercase tracking-[0.12em]`,
matching Home's name treatment, with the RSS `TextLink variant="quiet"` opposite
it on the same row, above a `DrawRule`. `Occasional notes on how things get
built.` stays, at `text-small` in `text-fg-2` under the heading rather than at
`--text-h2`: it is a standfirst, and at h2 scale it competes with the entries
that are supposed to carry the page.

- [ ] **Step 2: The rows**

`PostList` becomes a `data-spine` list of `11rem minmax(0,1fr)` rows, the same
directory grid About uses, with no per-row rule.

Mono column: the ordinal (`01`, `02`, newest first, zero-padded) above the date.
The ordinal is positional and must be computed from the rendered index, never
stored, so drafts dropping out in production cannot leave a gap.

Content column: the title at `--text-display` with `tracking-[-0.025em]`, the
summary at `text-small` in `text-fg-2` at `max-w-measure`, then the tags in mono
uppercase. The whole row is one `next/link`; the title takes the accent
underline on `group-hover`, which the current component already does with
`decoration-transparent` to `decoration-accent`, so keep that mechanism and just
move it up to display scale.

The empty state (`Nothing published yet.`) stays.

- [ ] **Step 3: Verify**

`PostList.test.tsx` gains the ordinal assertion (three posts render `01 02 03`,
newest first) and keeps everything it already covers. `pnpm e2e -- smoke.spec.ts`
green, including the date and tag assertions. Check `/writing` at 320px: the
title at `--text-display` inside a single column is the overflow risk.

## Task 6: Contact, the address is the page

Home already closes with the email set large and the socials beneath it, so this
page cannot be a bigger copy of that close. Its idea is that the address is the
entire page: the fold holds nothing else, and the mark's cut passes behind it.

**Files:**
- Modify: `app/contact/page.tsx`, `content/site.yaml`, `lib/schemas.ts`,
  `lib/content.test.ts`

- [ ] **Step 1: The timezone**

`siteSchema` gains `timezone: z.string()`, required. `content/site.yaml` gains
`timezone: CST, UTC-6`. Add the failing assertion to `lib/content.test.ts` first
and watch it fail, the same order Task 1 uses.

- [ ] **Step 2: The fold**

One section at `min-h-[calc(100svh-var(--nav-height))]`, `relative` and
`overflow-hidden`, laid out as a column exactly like Home's hero, so the
furniture lands on the fold rather than under it.

`h1` reads `Contact` at `font-mono text-meta uppercase tracking-[0.12em]`.

The address is a `mailto:` `TextLink variant="primary"` set on two lines,
`contact@` and `andrevital.com`, each its own block and `whitespace-nowrap`,
mirroring the headline's three blocks on Home and for the same reason: the
leading is the block's rather than the browser's guess at a break. Two lines is
also what makes the fit provable. At 320px with the gutter, `andrevital.com` is
fourteen characters in roughly 280px, so the clamp floor has to sit near 2rem;
one line of the full 22-character address does not fit at any size worth setting.

`<CutLine />`, the `under` variant, is laid over the section and passes behind
the glyphs.

- [ ] **Step 3: The furniture**

Pinned to the fold's bottom edge above a hairline, one row: the four socials as
`quiet` `TextLink`s with `external` on the left, and on the right the mono facts,
`Aguascalientes, MX` from `site.facts` plus `site.timezone`. Wraps to two rows
below 640px.

The page will scroll by roughly the footer's height. That is accepted rather than
worked around: subtracting the footer from the fold calculation would put a
second magic number next to `--nav-height` for a page whose fold is not asserted.

- [ ] **Step 4: Verify**

`pnpm vitest run lib/content.test.ts` green. No horizontal scroll at 320, 375 and
1440, which `smoke.spec.ts` already checks for `/contact` and which the address
is the live risk for. Confirm by eye that the cut reads as passing behind the
address rather than through it.

## Task 7: 404, the mark fails to assemble

The one page allowed to be playful, and the only one whose idea can come from the
mark itself: `</>` rotated 90 degrees, drawn stroke by stroke, cut by a diagonal.
Here the assembly fails and the glyph has slipped apart along its own cut.

**Files:**
- Modify: `app/not-found.tsx`, `app/globals.css`

- [ ] **Step 1: The figures**

`404` in mono at hero scale, `aria-hidden`, in `--color-fg-2`. Not the `h1`: the
`h1` stays `Whoops,` at `--text-display`, which both specs assert by text and by
computed size.

- [ ] **Step 2: The slip**

Two absolutely-stacked copies of the figures inside one `relative` box carrying
`container-type: inline-size`, each clipped to one side of the cut and translated
along it in opposite directions.

The clip is derived from `--cut-rise`, never from a hand-measured angle. That is
the U2b lesson (`docs/design.md`, "The slash's real angle"): every layer that
quoted the cut had measured a corner diagonal instead of the stroke's own
direction and was 2.3 degrees out. The cut drops `--cut-rise` of the box's width
across its full width, so at `x = 0` it sits `--cut-rise / 2` of the width below
centre and at `x = 100%` the same distance above it, which `cqi` expresses
directly:

```css
--slip: 6px;
--half: calc(var(--cut-rise) / 2 * 100cqi);

[data-slip="above"] {
	clip-path: polygon(0 0, 100% 0, 100% calc(50% - var(--half)), 0 calc(50% + var(--half)));
	transform: translate(var(--slip), calc(var(--slip) * var(--cut-rise) * -1));
}
```

`below` is the complementary polygon with the translate negated. The offset is
fixed, not random: `hidden.spec.ts` compares 404 bodies byte for byte, and the
CSS is static, so this holds as long as nobody reaches for `Math.random()`.

`<CutLine over />` sits above both halves, so the accent is the edge they slipped
along.

No drop shadow. The comp fakes the offset with one and the register bans it; the
two clipped copies are the real thing.

- [ ] **Step 3: The copy**

`Whoops,` as the `h1`, `I haven't actually coded this one, my bad :(` beneath it,
and `Go back home` as a `primary` `TextLink`. Tone unchanged, and nothing added:
no search, no suggestions, no sitemap. This page also serves hidden-section
routes and must never hint that anything exists behind the URL.

- [ ] **Step 4: Verify**

`pnpm e2e -- hidden.spec.ts` against the all-hidden build is the one that
matters: byte equality across nine routes plus the `Whoops,` heading and the
`font-size > 24` check. `smoke.spec.ts`'s unknown-route test too.

## Task 8: The regression guards

Each guard has to fail when the thing it guards is broken, and be seen to fail
before it is trusted. That is the standard U2b set.

**Files:**
- Add: `tests/e2e/pages.spec.ts`
- Modify: `tests/e2e/smoke.spec.ts` if any existing assertion moved

- [ ] **Step 1: About has one rule, not six**

Assert the CV list's computed `border-bottom-width` is `0px` on every row and
that the list carries the spine. Break it by restoring one `border-b` and watch
it fail.

- [ ] **Step 2: Writing's titles outrank its heading**

Assert the first post title's computed `font-size` is greater than the `h1`'s.
This is the composition's entire claim, and it is the assertion that catches
someone "fixing" the small `h1` later.

- [ ] **Step 3: Contact's furniture is on the fold**

The same shape as `home.spec.ts`'s facts-band assertion, at three viewports: the
furniture row's bottom sits within a few pixels of `innerHeight`. Break it by
changing the section's `min-h` and watch it fail.

- [ ] **Step 4: The 404 slipped along the real angle**

Measure the two halves' bounding boxes and assert their offset ratio matches
`--cut-rise` within tolerance, the same way the U2b test asserts the mark's slash
via `getScreenCTM`. Break it by using a corner diagonal ratio (0.5) and watch it
fail.

- [ ] **Step 5: Verify**

Full `pnpm test` and `pnpm e2e`. Every new guard confirmed failing against a
deliberately broken build before it is kept.

## Task 9: Document, verify, ship

**Files:**
- Modify: `docs/design.md`
- Modify: this plan

- [ ] **Step 1: Amend `docs/design.md`**

Under "Page decisions", add a subsection per page recording the idea and the
reason, in the register the Home hero section already uses. Specifically:

- The `h1` rule from decision 1, promoted to a site-wide rule with the two pages
  that follow it and the two that do not.
- The directory row (`11rem 1fr`) now carries a spine instead of per-row
  hairlines, and the "Layout" section's line about directory rows needs the
  amendment.
- The cut has an `under` variant and why (a line over an address is a
  strikethrough).
- The 404's slip, with the `cqi` derivation and the note that it is derived from
  `--cut-rise` rather than measured.

- [ ] **Step 2: Full verification**

`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm e2e` (both configs). Lighthouse
on `/about`, `/writing`, `/contact` and a 404, mobile, recording the numbers.
Accessibility must be 100, not 96: the U2 finding was a fade on scrolled content,
and this unit adds scroll-driven decoration to two more pages.

Kill anything on 4317 before `pnpm e2e`, or `reuseExistingServer` serves the
wrong build.

- [ ] **Step 3: Ship**

Branch `feat/redesign-pages`, conventional single-line commits, PR through the
template. No direct commits to `main`.

## What shipped, and where it differs from these steps

Recorded on 2026-08-31, on `feat/redesign-pages`. The compositions landed as
stepped out. Five things did not.

1. **The spine is static.** Task 3 gave it a scroll-driven draw. Built and
   measured, that draw lags the reader on a list taller than the viewport: with
   the career list at about 1400px, the first 300px of scroll drew roughly 180px
   of spine beside 900px of visible rows, and every range that fixes the lag
   finishes the draw off screen instead. The keyframes and the timeline rule were
   deleted rather than retuned.
2. **The 404's slip is a gradient mask, not a `clip-path` polygon.** Task 7's
   `cqi` derivation needs `container-type: inline-size`, which contains the box's
   inline size and collapsed it to zero width inside a centred column: the figures
   fell out of centre and the accent line, being `inset: 0` of a zero-width box,
   never rendered. A `linear-gradient` at `--cut-angle` is the same construction
   `[data-cut]` paints, so the seam and the accent coincide with no arithmetic in
   between and no aspect-ratio dependency.
3. **Contact's cut is scoped to the address**, not laid over the fold. Over the
   whole section it ran corner to corner through empty ground and read as a stray
   hairline.
4. **Contact's address is `clamp(2rem, 11vw, 10rem)`, not `--text-hero`.** That
   token is tuned for a three-word claim and put fourteen characters nine hundred
   pixels past the page.
5. **`TextLink` gained an `aria-label` passthrough.** Split across two block
   children, the address's computed accessible name was `contact@ andrevital.com`.
   The Task 8 guard found it; nobody had looked.

**Two of the Task 8 guards were not guards when first written**, and only the
deliberate-break pass caught it. The 404 ratio check had a 0.05 tolerance against
an error of exactly 0.05 (0.5 corner diagonal against the stroke's 0.45) and let
it through on a floating-point hair; it is 0.02 now. The Writing hierarchy check
reached for the title positionally, landed on the anchor, and passed with the
titles set at `--text-small`; the title carries `data-post-title` now. All six
were then re-broken and confirmed failing.

**One real regression, caught by an existing test.** Replacing a slice of
`app/globals.css` by index deleted the z-index scale documentation and the
`header { position: relative; z-index: 30 }` rule with it, which drops the nav
sheet panel behind the page. `interaction.spec.ts`'s "opening it covers the page"
case failed, and its own comment names that exact regression from U1b.

**Verification.** 191 unit and 63 e2e, both configs. Mobile Lighthouse: About 99,
Writing 99, Contact 98, all with accessibility 100, best practices 100, SEO 100
and CLS 0; desktop 100 in all four on all three. No horizontal scroll at 320px on
any of the four. Dark and light both checked by screenshot.

## Open questions

None blocking. Two worth a decision before Unit 2:

1. The three Home facts are hardcoded in `app/page.tsx`. Unit 2 should either move them to `content/site.yaml` or keep them and fix the comment. Recommendation: move them, since the facts band promotes them to a real page section rather than a side rail.
2. `AGENTS.md` and `CLAUDE.md` are generated by Next 16's `predev` and are not gitignored, so they show as untracked after any `pnpm dev`. This is an existing open item and Unit 1 will surface it immediately. Recommendation: gitignore both as the first commit on the foundation branch, so every later unit has a clean tree.

---

# Unit 4b: The sidebar navigation, stepped out

Stepped out on 2026-09-01, ahead of Unit 4. Branch `feat/redesign-sidebar-nav`,
off `main@c121973`. Read "## Unit 1b: The mobile nav and the mark's scale" above,
plus `docs/design.md` "Register", "Layout", "The mobile navigation" and "How the
intro hides the page", before starting. Every trap recorded there applies here.

**Why it exists.** Andre asked for a sidebar and confirmed its shape after two
revisions of a throwaway spike (`spike/sidebar-nav`, deleted once this unit
lands): the sidebar is the navigation on every desktop page, text only, with the
top bar gone entirely above `lg` and the mark and the theme toggle moved into the
sidebar's own top row. It is shell work with no page of its own, which is what
makes it a `b` unit rather than a numbered one, the same as Unit 1b.

**Why it runs before Unit 4.** Unit 4 composes four routes and every one of them
sits inside this shell. The sidebar deletes the bar above `lg`, takes a column off
the width the content has to work with, and moves the fold. Comping and building
four pages against the old shell and then sliding the shell out from under them
is the same work twice. Unit 4's step-out stays as written; it is re-sequenced,
not rewritten.

**R3 is already amended, with this step-out.** It read "Navigation is a single
compact bar with the logo mark and text links; no icon rail and no icon font",
and a sidebar is not a bar. Rewritten in
`docs/plans/2026-08-28-001-feat-portfolio-rebuild-plan.md` on 2026-09-01 in the
format R5 set, to name the shell per viewport. The half that survives is the half
that was load bearing: text links, no icon rail, no icon font. It is amended here
rather than during implementation so that no task in this unit is arguing with a
written requirement while it runs.

## What the spike proved

The spike was built to be looked at, not merged, and it still surfaced the two
costs that make up most of this unit. Both are silent. Neither shows up in the
console, and neither fails a test that exists today.

**1. The intro dock resolves to the wrong mark, and paints nothing.** `NavLogo`
carries `layoutId={LOGO_LAYOUT_ID}` and `LogoIntro`'s overlay docks into it. Put a
second `NavLogo` in the sidebar and both are mounted at every viewport, because
`hidden lg:block` and `lg:hidden` are CSS, not conditional rendering. Two nodes
share one `layoutId`, motion resolves to the first, and above `lg` that is the
display:none bar. Measured on the spike: the sidebar's slot holds at 38x28 and the
mark never arrives, with a clean console and no failing test. The dock is R7, the
first two seconds of a first visit, and nothing currently guards it at a desktop
viewport.

**2. Home's fold reserves 65px for a bar that is gone.** `--nav-height`
(4.0625rem) is a hardcoded token and three pages size their first section as
`min-h-[calc(100svh-var(--nav-height))]`: Home, Contact and the 404. Above `lg`
there is no longer a bar to subtract, so the facts band lands 65px below the fold.
`tests/e2e/home.spec.ts` asserts that band at 1440x900, 1280x800 and 320x720, and
`pages.spec.ts` asserts Contact's furniture at the same three: the two desktop
viewports fail in both, which is the guard behaving exactly as U2b built it to.

**Also carried out of the spike:** the contextual `CRAFT / INDEX 2026` header the
first revision put at the sidebar's top is dropped. It restated the page's own
heading a few hundred pixels to its left.

**Stitch trap, for whoever comps this.** Five index-comp generations timed out on
2026-08-31, and `list_screens` does not list screens created in the same session,
so a timed-out generation is unreachable through the MCP and has to be recovered
from the Stitch web UI. Budget for it or comp in fewer, larger passes.

## Decisions taken before stepping out

1. **The sidebar is not compact and carries no icons.** Text set in mono at
   `--text-meta`, uppercase, one item per line. `docs/design.md` "Register" bans
   the icon font, and Unit 1b already recorded why icons lose here: there is no
   glyph for "About", and none that separates "Craft" from "Work" when both are
   work.
2. **The bar is deleted above `lg`, not hidden and reused.** Keeping a stub bar
   for the mark is what created cost 1. Above `lg` the sidebar is the only shell
   chrome: mark, theme toggle, links, byline.
3. **`lg` (1024px) is the switch, and the mobile sheet keeps everything below
   it.** Between `sm` and `lg` the bar stays exactly as Unit 1b shipped it,
   including the text row. Below `sm` the sheet is untouched. This unit changes
   one breakpoint and adds nothing to mobile.
4. **The sidebar's nav is labelled `Primary`, and the bar's row keeps that name
   too.** They are never both in the accessibility tree, because `display: none`
   removes the hidden one, so there is exactly one Primary landmark at every
   viewport. This is also what keeps `intro.spec.ts` and `smoke.spec.ts` working
   unchanged: both reach for `nav[aria-label="Primary"]` at a desktop viewport.
   The spike's `Primary, sidebar` would have broken all three files for nothing.
5. **`--nav-height` becomes responsive rather than the three pages changing.** A
   `@media (width >= 64rem)` block sets it to `0rem`, and Home, Contact and the
   404 keep their `calc(100svh - var(--nav-height))` untouched. The fold guards
   then pass unedited at all three viewports, which is worth more than the
   token's current honesty as a constant: an assertion that had to be rewritten
   to accommodate this change would stop being evidence that it worked.
6. **The links reuse `NavLink`, which gains a variant.** The spike hand rolled a
   second active-state link with its own `usePathname`. `NavLink` is already the
   smallest client boundary in the shell and this is its second consumer, which
   is the same bar `CutLine` had to clear in Unit 3 before being extracted.
7. **Active state becomes prefix aware.** `NavLink` matches `pathname === href`
   today, so `/work/an-entry` leaves Work unlit. Unit 4 is the unit that ships
   those child routes, so the fix belongs to the unit that runs first.
8. **The page footer is deleted, on every page and at every viewport.** Andre,
   2026-09-01. The sidebar's byline replaces it at desktop, and the `<footer>`
   in `app/layout.tsx` goes with the copyright line it carries. Below `lg` there
   is then no copyright anywhere, since `app/layout.tsx` is the only place the
   site has ever rendered one: the mobile sheet's foot takes the same byline, so
   the fact survives at both shells and lives in neither uniquely.
9. **A hairline sits above the byline, not around it.** Andre, 2026-09-01, with
   Contact's furniture row as the reference: one full-width rule across the
   sidebar's column with the mark and the year below it. `--color-line`, 1px, the
   same hairline the shell already uses on the bar and on the sidebar's right
   edge, and no rule under it.

## Standing constraints this unit must not break

- **No JavaScript is required to navigate.** The sheet is a `<details>` and the
  sidebar is plain links. The only client code in the shell stays `NavLink`,
  `ThemeToggle` and `NavLogo`, all of which already existed.
- **One source of truth for the links.** `visibleSections()` plus About and
  Contact, in one place. A second hardcoded list is how a hidden section leaks
  into a nav (R2).
- **The mark's docked size stays 1.75rem** and `LOGO_VIEW_BOX` is not touched.
  Unit 1b tuned both, and `docs/design.md` records the docked size.
- **Lighthouse accessibility stays 100** on mobile and desktop, and no page
  scrolls horizontally at 320px or at 1024px, which is the width where the
  sidebar first takes its column and the shell has the least room.
- **`NEXT_PUBLIC_SECTIONS` is not changed anywhere.** Work and Craft stay hidden
  through this unit; the sidebar has to be right with three links and correct
  with five.

## Task 1: The design doc catches up to the rule

R3 is done. `docs/design.md` is not, and it is the doc every later unit reads
first.

- "Layout": the shell is a sidebar column plus content above `lg` and a bar below
  it. Record the sidebar's width, that `--nav-height` is 0 above `lg`, and that
  there is no footer.
- "The mobile navigation" gains a sibling for the desktop navigation, or is
  renamed to cover both. Two navigations were already the documented answer at
  `sm`; this makes it three shells across two breakpoints, and the doc should say
  so in one place rather than by implication.
- "Register" lists the site's furniture. The footer leaving and the byline
  arriving in the shell belong there.

Written before the code so the implementation has something to be wrong against,
then corrected in Task 7 wherever it turned out to be wrong.

**Verify.** `grep -rn "footer" docs/design.md` describes only what still exists.

## Task 2: The shell splits

`app/layout.tsx` gains a sidebar column above `lg`. Lift the link list out of
`Nav` into one exported source both shells consume (the spike's `navLinks()` is
the shape; fold the spike's `SPIKE:` comments out as it lands). The bar's
`<header>` goes `lg:hidden` in full, header rule included, and the `<footer>` and
its copyright line are deleted outright (decision 8).

**Trap.** `header { position: relative; z-index: 30 }` in `app/globals.css` is
what keeps the open sheet panel above the page, and `interaction.spec.ts` has a
case whose comment names that exact regression from Unit 1b. Hiding the header
above `lg` must not move or delete that rule.

**Verify.** At 1280 the bar is absent from the layout and from the accessibility
tree; at 1023 it is the bar Unit 1b shipped, unchanged.

## Task 3: The mark docks into whichever shell is visible

This is cost 1, and it is the task most likely to be declared done while broken.

Exactly one `NavLogo` may carry `LOGO_LAYOUT_ID` at a time. Both are mounted at
every viewport, so the choice is a runtime one: a single `matchMedia("(min-width:
64rem)")` read in a client effect, passed down so the slot that is actually
painted owns the `layoutId` and the other renders the same mark without one.
Server render owns neither, which is correct: the overlay is client only and the
dock happens roughly two seconds in, long after the effect has run.

**Verify, and this needs a new e2e case at a desktop viewport.** First visit at
1440: the mark ends up in the sidebar at its docked size and shape. First visit at
375: it ends up in the bar, as it does today. Break it deliberately by giving both
slots the `layoutId` and confirm the desktop case fails.

## Task 4: The fold stops reserving a bar that is gone

Add the `@media (width >= 64rem)` override for `--nav-height` in
`app/globals.css`, beside the token and its existing comment.

**Verify.** `home.spec.ts`'s facts band and `pages.spec.ts`'s Contact furniture
pass unedited at all three viewports. Then set the override to `4rem` and confirm
both desktop viewports fail in both files, which is the same break U2b used to
prove the guard bites.

## Task 5: The sidebar's composition

The comp, as confirmed: a top row carrying the mark (linked home, its own
`aria-label`) and the theme toggle; the nav sitting low rather than under the
mark, so the links land near the optical centre of a tall page; the byline at the
foot. Sticky, full viewport height, a hairline on its right edge, `--spacing-gutter`
of horizontal padding.

`NavLink` gains its variant here, and its active match becomes prefix aware for
section routes while staying exact for `/`.

**The byline.** The mark and the year at the foot, in mono at `--text-meta`, with
a hairline directly above it running the sidebar's full column width. It is the
only copyright the site has once the footer is gone, so the same line goes into
the foot of the mobile sheet, under the same rule.

**Open, and worth measuring rather than guessing:** the sidebar's width against
the shell. The page shell is `--container-wide` (62rem) centred. At 1024 a 13rem
sidebar leaves 816px of column, so the shell stops being able to reach its own
width exactly at the breakpoint that introduces the sidebar. Check 1024, 1280 and
1440 before settling the width, and check what it does to Home's hero grid
(`minmax(0, 1fr) 14rem`) and to the 760px directory collapse, which is measured
against the viewport rather than the column.

## Task 6: The regression guards

Guards for what this unit can silently break later, not for what it built.

1. The desktop dock, from Task 3.
2. Exactly one navigation landmark named `Primary` in the accessibility tree, at
   320, 768, 1024 and 1440. This is the assertion that fails if a future change
   renders both shells at once.
3. No horizontal scroll at 1024, alongside the existing 320 check.
4. The sheet still opens, covers the page and closes on navigation below `sm`.
   That behaviour is untouched by this unit, which is exactly why a change here
   could break it unnoticed.

Every guard is broken deliberately once and confirmed failing before the unit is
called done.

## Task 7: Document, verify, ship

- `docs/design.md` gets what actually shipped, including anything measured in
  Task 5 that contradicts this step-out.
- Full unit and e2e suites on both configs, plus a build with every section on,
  since the sidebar renders five links there and three by default.
- Lighthouse on Home, About and Contact, mobile and desktop.
- Dark and light checked by screenshot at 1440 and at 375.
- Delete `spike/sidebar-nav`.
- PR through the template, with before and after screenshots at desktop.

## How this unit is peer tested

1. `/` at 1440 on a first visit of the session: the mark draws centre screen and
   lands in the **sidebar**, at the same size it lands in the bar today. If the
   sidebar's top row is empty when the intro ends, that is cost 1 and it is a
   bug.
2. Same at 375: the mark lands in the bar, exactly as it does today.
3. `/` at 1440: the facts band's bottom edge sits on the fold, not 65px under it.
   Same on `/contact` and on any unrouted URL.
4. Resize across 1024 slowly: the bar and the sidebar swap once, and never both
   show. Nothing else in the shell jumps.
5. At 1023 the site is what shipped in Unit 3, bar and all.
6. Tab from the top at 1440: skip link, then the mark, then the toggle, then the
   links in order. `aria-current` is on the page you are on.
7. With JavaScript disabled at 1440, navigate the whole site from the sidebar.
8. At 375, open Menu and tap a link: the sheet closes and the page changes. The
   byline sits at the foot of the sheet, under its own hairline.
9. Scroll any page to its end at 1440 and at 375: there is no footer, and the
   page simply ends. The copyright is in the sidebar and in the sheet.

## What shipped, and where it differs from these steps

Implemented on 2026-09-01, in one pass on `feat/redesign-sidebar-nav`.

**The sidebar is fixed, with the body padded past it, not a flex column beside the
page.** Task 5 assumed a column. A column wraps `header` and `main` in a div, and
`app/globals.css` staggers a return visit with `body > :is(header, main, footer)`:
the selector would have stopped matching and R8's stagger would have quietly gone
away, with no test to fail. That is a third silent cost of the same kind as the two
the spike found, discovered only by reading the CSS the shell sits in. Fixed plus
`lg:pl-sidebar` leaves the document's own structure exactly as it was, and the
sidebar joins the stagger by being a body child like the others.

**Both shells being named `Primary` is right for the accessibility tree and wrong
for CSS.** Decision 4 held: `display: none` keeps the hidden one out of the tree, so
`getByRole` finds exactly one at every width. What it missed is that a CSS selector
has no such filter, and three existing cases reached for
`nav[aria-label="Primary"] a[href=...]`: two in `smoke.spec.ts` counting a section's
link, one in `intro.spec.ts` taking a bounding box to click through the veil. All
three now go through `getByRole`, which is both correct and viewport-agnostic.

**`#site-logo` follows the live shell, so it arrives with hydration.** The plan named
the `layoutId` as the thing that cannot exist twice and missed that the mark's DOM id
is the same problem: three e2e cases read the mark's fill and stroke through
`#site-logo`, and a duplicate would have handed them whichever copy is off screen.
Both now belong to the live slot, which means neither exists during SSR and the first
client render, so `smoke.spec.ts`'s colour-flip case polls its first read instead of
taking it immediately.

**jsdom implements no media queries**, so `vitest.setup.ts` stubs `matchMedia` as
permanently unmatched. Every sidebar assertion that needs a real viewport is in Playwright.

**The skip link moved to `app/layout.tsx`** and its unit test in `Nav.test.tsx` became
an e2e case at both shells, because "first focusable element in the document" stopped
being a fact about the bar once the bar stopped being first.

**Task 1 collapsed into Task 7.** One documentation pass, written after the code, with
the measured numbers in it rather than a set of predictions to correct an hour later.
R3 itself was still amended first, in the step-out commit, which is the part that had
to precede the work.

**The byline is in the mobile sheet as well.** Andre asked for the footer to go on
every page, not only above `lg`, and `app/layout.tsx` was the only place the site had
ever rendered a copyright. The sheet's foot carries the same line under the same rule.

**Settled by measurement:** the sidebar is 13rem. At 1024 that leaves 816px of column,
so the 62rem shell narrows at the breakpoint that introduces the sidebar and no page
scrolls sideways there; Home's hero grid and the 760px directory collapse both hold at
1024, 1280 and 1440. Contact's fold comment was rewritten: above `lg` that page no
longer scrolls at all, because the footer that used to add the scroll is gone.

**Verification.** 201 unit and 76 e2e (up from 191 and 70), both configs, plus the
hidden-sections build. Lighthouse accessibility 100 on Home, About and Contact at
desktop; mobile Home 98 performance, 100 accessibility, 100 best practices, 100 SEO,
CLS 0. Dark and light checked by screenshot at 1440, plus 1024, 1023, 375 and the open
sheet. Every new guard was broken deliberately once and confirmed failing.

### The review round

Five findings, all real, all fixed on the branch before it was pushed.

1. **The route wipe stopped running at the mark's angle above `lg`, and nothing
   caught it.** `--cut-drop` was `100vw * --cut-rise`, but the box it wipes is
   inside `main`, which the sidebar makes 208px narrower: 27.75deg at 1440 and
   29.45deg at 1024 against the mark's 24.23. That is the same class of defect
   `geometry.spec.ts` exists for, a few degrees out and close enough to look
   deliberate, and its own comment ("both boxes are inset:0 and therefore 100vw
   wide") had quietly become false. Fixed with `--shell-inset`, and the file now
   measures the route wipe at three widths, not just the nav sheet at 375.
2. **The sidebar was a `<div>`, so desktop pages had no banner landmark.** The bar
   it replaces is a `<header>`, so the mark, the home link and the theme toggle
   went from inside a landmark to outside every one of them. It is a `<header>`
   now. The trap in doing that: `header { position: relative; z-index: 30 }` is
   unlayered and Tailwind's utilities are in `@layer utilities`, so an unscoped
   rule beats `fixed` on specificity-that-is-not-specificity and drops the sidebar
   back into the flow. Scoped with `:not([data-sidebar])`, and two test selectors
   that meant "the bar" now say `[data-nav-bar]`.
3. **There is no copyright between `sm` and `lg`.** The sheet is `sm:hidden` and
   the sidebar starts at `lg`, so 384px of viewport carry neither byline, which
   two comments and this plan all claimed otherwise. The behaviour stands, because
   a copyright in a top bar is a copyright in the wrong place, but it is now
   asserted in `shell.spec.ts` and stated where it was misstated.
4. **The fold guards stopped guarding at two of their three viewports.** With
   `--nav-height` at 0 above `lg`, the 1440 and 1280 iterations only prove that a
   `100svh` section fills the viewport, which any token value does. Both loops
   gained 900px, where the bar still exists and a wrong value still misses by 65.
5. A comment sent the next reader to the wrong file for the skip-link contract.

**Also worth carrying forward:** `playwright.config.ts` has
`reuseExistingServer: !process.env.CI`, and a stale `next start` on 4317 from an
earlier session serves an old build to the whole suite without saying so. Kill
4317 and 4319 before an e2e run.

**Verification after the round.** 201 unit and 77 e2e, both configs. Lighthouse
accessibility still 100 on Home, About and Contact at desktop with two `<header>`
elements in the DOM, since the hidden one is out of the tree. The route-wipe guard
was broken deliberately (`--shell-inset: 0rem` above `lg`) and confirmed failing at
3.48deg out.

### The design pass

Andre reviewed the built shell on 2026-09-02 and named three things. All three were
the same defect wearing different clothes: geometry measured against the viewport
when it should have been measured against the thing it sits with.

1. **The hero mark, at wide windows.** `height: 132%` is taken off the section, so
   the mark covers every window narrower than about 1.35 times its own height and
   floats on every window wider: at 2208x1080 it was 1934px wide inside a 2000px
   section, cropped by no edge. Fixed twice, and the first fix is worth recording
   because it was wrong in an instructive way. Tying the mark to the column held a
   constant scale against the headline and broke the other end of the range: at
   1670x1367 the mark came out 1185px tall inside a 1367px fold and floated
   vertically, which Andre caught within the hour. The rule is not "keep its scale
   constant", it is **"never let it fit"**: the width is now the larger of the
   fold's diagonal reach and 1.12 sections, so the original height term still wins
   everywhere it used to and the floor only bites on a window too wide for it. The
   accent needed nothing: it is a gradient at a declared angle through the centre
   of its box, and the headline is centred in the same box, so it crosses the type
   in the same place at every width. What moved is where it meets the screen's
   edges, because the sidebar took 208px off that box and the deleted bar gave it
   65px back.
2. **The masthead.** The mark and the theme toggle shared the top row, which put
   the least-used control on the site beside its identity in a 112px slot with
   nothing else in it, pushed apart by `justify-between`. The toggle moved to the
   foot, where the mobile sheet already keeps it, and the top of the column is a
   masthead again.
3. **The foot's rule.** A `border-t` on the byline itself, so it spanned the text's
   own width and floated. It is full bleed now, cancelling the column's padding to
   land on the sidebar's right-hand hairline, with the byline and the toggle sharing
   the row beneath it. That needed the column's own padding token:
   `--spacing-sidebar-gutter` (1.5rem), because 3rem of page gutter either side of a
   13rem column leaves 7rem, which will not hold the two of them on one line.

Tab order changed with it, and the guard changed with that: identity, then the
links, then the toggle, which is also the reading order of the column.

**Verification.** 202 unit and 78 e2e. Screenshots at 1440 and 2208, dark, before
and after.

---

# Unit 4c: The navigation's motion, stepped out

Stepped out on 2026-09-02, after Unit 4b merged (`main@3c74ced`) and before Unit 4.
Branch `feat/redesign-nav-motion`. Read `docs/design.md` "The motion vocabulary",
"The theme swap", "How the intro hides the page" and "The sidebar" before starting.

**Why it exists.** Unit 4b built a shell and gave it no motion. The sidebar's links
have a colour transition and nothing else, the column does not arrive, and the two
site-wide animations that used to be tuned against a top bar are now tuned against
nothing: the route wipe runs in a box the sidebar narrowed, and the theme sweep
starts at the top right while the control that fires it sits at the bottom left.

**Why it runs before Unit 4.** The same reason 4b did. Unit 4 composes four pages
inside this shell, and two of them (the Work index and its filter) have motion of
their own that has to agree with the shell's. Settling the shell's motion first
means Unit 4 extends a vocabulary rather than negotiating with one.

**Weighting.** A creative portfolio: production polish first (Jakub), expression
second, and Emil's frequency gate applied strictly to the nav links, which are the
one thing here a visitor triggers dozens of times. The house rules outrank all
three: the site's motion language is the mark's stroke, its diagonal and its weave,
and anything new extends that rather than importing a second language.

## What is already wrong, before anything is added

**The theme sweep is 3.2 degrees off, live, and it is Unit 4b's fault.** `--cut-drop`
became `calc((100vw - var(--shell-inset)) * var(--cut-rise))` so the route wipe would
stop measuring its drop across a width the page does not have. The theme sweep reads
the same token, but its box is the **root snapshot**, which is the whole viewport,
sidebar included: at 1440 it now drops 554px across 1440 instead of 648, which is
21.05deg against the mark's 24.23. Nothing caught it, because a view-transition
pseudo-element is not in the DOM and `geometry.spec.ts` measures elements.

That is the third time this exact defect has shipped (U2b's four restatements, U4b's
route wipe, now this), so the fix is a naming one rather than another arithmetic one:
**two tokens, each named for the box it belongs to.**

**`lib/motion.ts` still says `--duration-route: 240`** while `app/globals.css` says
420ms. Nothing reads that token through `duration()` today, so it is inert, but
`docs/design.md` calls a wrong fallback "a real bug" and it is exactly the kind that
bites the first component to read it.

## Task 1: Two drops, one per box

**Files:** `app/globals.css`, `tests/e2e/geometry.spec.ts`

- [ ] **Step 1: Name them for their boxes**

`--cut-drop` goes back to `calc(100vw * var(--cut-rise))` and belongs to anything
whose box is the viewport: the nav sheet's panel (`inset: 0`) and the theme sweep
(the root snapshot). `--cut-drop-page` is `calc((100vw - var(--shell-inset)) *
var(--cut-rise))` and belongs to `route-enter`, whose box is inside `main`. Each
token's comment names its box, because the last three of these were caused by one
token being read by a consumer it did not describe.

- [ ] **Step 2: Both are measured**

Extend the route-wipe case in `geometry.spec.ts` to probe both: a viewport-width box
with `--cut-drop` and the route box with `--cut-drop-page`, each compared to the
mark's rendered slash. Confirm the theme sweep's fix by breaking it: point
`theme-sweep` back at `--cut-drop-page` and the viewport probe fails.

## Task 2: The active item is a mark that travels

**Files:** `components/nav/NavLink.tsx`, `app/globals.css`,
`tests/e2e/shell.spec.ts`

The sidebar's one real motion moment, and the only one a visitor sees more than
once a session. Today the accent simply appears on a different word.

- [ ] **Step 1: One tick, shared**

A 1px accent rule in the sidebar's left gutter, rendered only for the active item
and carrying a shared `layoutId`, so navigating moves the same object rather than
crossfading two. That is the dock's own idea at nav scale: a single element
travelling to where it now belongs, which is the site's motion language rather than
a generic sidebar indicator.

- [ ] **Step 2: The frequency gate applies to everything else**

Hover stays a `--duration-fast` colour transition and gains nothing. The links are
the most-triggered thing in the shell and are keyboard-reachable, so anything more
is friction. No scale, no slide, no underline draw on hover.

- [ ] **Step 3: Reduced motion moves it without animating it**

`useReducedMotion` drops the layout animation, not the tick: the marker still marks,
it simply arrives. The tick is also in the server HTML, since `NavLink` is a client
component that still server-renders, so a visitor with no JavaScript sees the
current page marked.

- [ ] **Step 4: The bar keeps its own arrangement**

`variant="bar"` does not get the tick. Between `sm` and `lg` the links are a
horizontal row and a left-gutter rule has no gutter to live in.

## Task 3: The column settles after the mark lands

**Files:** `app/globals.css`, `components/nav/SidebarNav.tsx`

On a first visit the veil lifts on a finished sidebar. The mark travelled; nothing
else did.

- [ ] **Step 1: Stagger the column's own items**

The links, then the foot, rise `12px` on `--ease-out-expo` with `--duration-stagger`
between them, gated on `html[data-intro="done"]` exactly as the hero cut is gated,
so it starts the frame the veil lifts rather than behind it. Once per session, which
is the frequency band where expression is welcome.

- [ ] **Step 2: It moves, it does not fade**

The house rule from U2: axe blends text colour by opacity, and a faded entrance
measured mid-flight is a contrast failure. A 12px rise reads as an entrance on its
own.

- [ ] **Step 3: A return visit already has one**

`intro-content` staggers `body > :is(header, main)` on `data-intro="inline"`, and the
sidebar is a `header`, so it is covered. Do not add a second entrance on top of it.

## Task 4: The sweep starts where the control is

**Files:** `app/globals.css`, `docs/design.md`

- [ ] **Step 1: Reverse the diagonal's travel**

The theme sweep and the sheet's wipe both run top-right to bottom-left, which was
right when the toggle was in the top bar. It is now at the foot of the sidebar on
desktop and the foot of the sheet on mobile: on both, the swap starts as far from
the press as the geometry allows. Reverse the keyframes so the wipe travels from
the bottom left, and keep the angle exactly as it is.

- [ ] **Step 2: Look at it before keeping it**

This is a judgment call and it is reversible in one keyframe, so record which
direction shipped and why in `docs/design.md` "The theme swap". If the reversed
version reads worse, say so there and revert it: a decision documented as taken and
rejected is worth more than a silent one.

## Task 5: The motion module stops lying

**Files:** `lib/motion.ts`, `lib/motion.test.ts`

- [ ] **Step 1: `--duration-route` is 420**

Correct the fallback and let the existing unit test cover it. Check the rest of the
table against `app/globals.css` in the same pass, since one drift means the table
was never re-read after U3 retuned the route.

## Task 6: Verify, record, ship

- [ ] **Step 1: Watch it, do not infer it**

Motion cannot be reviewed from a screenshot. Record the three moments with
Playwright video at 1440 and at 375: a first visit, two navigations, and a theme
swap. Attach them to the PR.

- [ ] **Step 2: Reduced motion is a separate pass**

Run the same three with `prefers-reduced-motion: reduce`. Every one of them must
land on its finished state with no travel and nothing missing.

- [ ] **Step 3: Everything**

`pnpm typecheck`, `pnpm test`, `pnpm e2e`, both configs, 4317 and 4319 killed first.
Lighthouse accessibility stays 100 on Home, About and Contact, and CLS stays 0: an
entrance that moves layout rather than transforming it shows up there and nowhere
else.

## What shipped, and where it differs from these steps

Implemented on 2026-09-02, same day as the step-out.

**Task 1 found a second live drift while fixing the first.** The theme sweep was
3.2 degrees off as predicted, but the guard written for it (`app/cut-drop.test.ts`,
which reads the CSS and asserts which token each `@keyframes` block uses) exists
because the rendered-geometry tests **cannot** catch this class: a
`::view-transition` pseudo-element is not in the DOM. So there are now two guards
of different kinds, one measuring that each token is right for its box and one
asserting that each consumer reads the token named for its own box.

**Task 5 found a third drift, by accident.** The fallback table was checked against
`app/globals.css` in a test rather than by eye, and `--duration-sweep` turned out to
be missing from it entirely: `duration("--duration-sweep")` returned `NaN`. Inert
today, since nothing reads it, and exactly what the table exists to prevent. Both
the missing entry and the stale `--duration-route` are fixed, and the new test walks
every authored token rather than a list someone has to remember to extend.

**The active mark is a hairline in the gutter, not an indicator beside the text.**
12px wide, 1px tall, `--color-accent`, sitting in the sidebar's left gutter. It
travels on `--duration-base` with `--ease-standard`. Measured across a navigation:
y 426 to 615 over about 240ms, easing out, with exactly one tick in the document at
every sampled frame including mid-flight.

**Nothing was added to hover.** Emil's gate, applied literally: the links are the
one thing in this shell a visitor triggers dozens of times a session and they are
keyboard-reachable, so the colour transition that was already there is the whole
interaction.

**Verification.** 209 unit and 79 e2e, both configs. Mobile Lighthouse on Home: 98
performance, 100 accessibility, CLS 0, which is the number that matters for an
entrance that could have been written as a layout change. Recorded at 1440: a first
visit through the dock and the settle, two navigations, and a theme swap. The
column's travel was measured rather than eyeballed (12px to 0, the foot one stagger
behind), and reduced motion was run separately: the mark still marks, the column
does not travel, and the swap does not run at all.
