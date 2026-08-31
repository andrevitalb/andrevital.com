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

## Open questions

None blocking. Two worth a decision before Unit 2:

1. The three Home facts are hardcoded in `app/page.tsx`. Unit 2 should either move them to `content/site.yaml` or keep them and fix the comment. Recommendation: move them, since the facts band promotes them to a real page section rather than a side rail.
2. `AGENTS.md` and `CLAUDE.md` are generated by Next 16's `predev` and are not gitignored, so they show as untracked after any `pnpm dev`. This is an existing open item and Unit 1 will surface it immediately. Recommendation: gitignore both as the first commit on the foundation branch, so every later unit has a clean tree.
