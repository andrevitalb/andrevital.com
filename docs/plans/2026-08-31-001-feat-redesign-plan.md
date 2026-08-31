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

## Unit 2: Home

Branch `feat/redesign-home`. Fixes audit findings 3, 4, 7 and 8.

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

## Open questions

None blocking. Two worth a decision before Unit 2:

1. The three Home facts are hardcoded in `app/page.tsx`. Unit 2 should either move them to `content/site.yaml` or keep them and fix the comment. Recommendation: move them, since the facts band promotes them to a real page section rather than a side rail.
2. `AGENTS.md` and `CLAUDE.md` are generated by Next 16's `predev` and are not gitignored, so they show as untracked after any `pnpm dev`. This is an existing open item and Unit 1 will surface it immediately. Recommendation: gitignore both as the first commit on the foundation branch, so every later unit has a clean tree.
