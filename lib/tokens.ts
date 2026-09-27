import { readFileSync } from "node:fs"
import path from "node:path"

export type Token = { name: string; value: string }

/*
 * The design page's token source, read out of app/globals.css itself.
 *
 * Deliberately NOT the fallback-table-plus-drift-test shape lib/motion.ts uses,
 * and the difference is the reason rather than a preference. That table exists
 * because a BROWSER needs those values in JavaScript, where a custom property
 * does not resolve on the server, so a copy is unavoidable and a test has to
 * hold it in step. This module only has to PRINT names and authored values, and
 * it prints them from a server component at build time, so it can read the
 * stylesheet and there is no second copy to drift in the first place.
 *
 * Specimens still paint through var(--x). The parsed string is the label only,
 * which is what keeps the page correct under a live theme swap: the swatch
 * beside "#0f1214" is the current theme's --bg, not that hex.
 *
 * process.cwd() rather than import.meta.dirname, because the bundler moves this
 * module and its own directory is inside .next/server by the time it runs.
 * lib/content.ts reads the content tree the same way.
 */
const CSS_PATH = path.join(process.cwd(), "app", "globals.css")

/*
 * A block's body, from its opening line to the `}` that closes it.
 *
 * Anchored on a newline, which is what makes a plain indexOf safe here: every
 * selector below opens in column zero and closes in column zero, while the
 * copies that must NOT match are all indented or suffixed. `\n:root {` finds
 * the palette and never the `:root` nested inside the two media queries or the
 * `:root:not(.dark)` inside the third. None of these blocks nests braces, so
 * the first `\n}` after the opening is the real end.
 */
function block(css: string, selector: string): string {
	const head = `\n${selector} {`
	const open = css.indexOf(head)
	if (open === -1)
		throw new Error(`app/globals.css has no \`${selector}\` block`)

	const start = open + head.length
	const end = css.indexOf("\n}", start)
	if (end === -1) {
		throw new Error(`app/globals.css never closes \`${selector}\``)
	}

	return css.slice(start, end)
}

/** The `--name: value` declarations in a block, in source order. */
export function declarations(source: string): Token[] {
	// Comments first. This file carries more prose than CSS in places, and a
	// commented-out token would otherwise render as a real one.
	const bare = source.replace(/\/\*[\s\S]*?\*\//g, "")

	return [...bare.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
		([, name, value]) => ({ name, value: value.replace(/\s+/g, " ").trim() }),
	)
}

const css = readFileSync(CSS_PATH, "utf8")

/** The dark palette and the motion and geometry tokens. */
export const ROOT = declarations(block(css, ":root"))
/** The light overrides, which are the palette alone. */
export const LIGHT = declarations(block(css, ".light"))
/** Everything Tailwind turns into a utility namespace. */
export const THEME = declarations(block(css, "@theme inline"))

/** The tokens whose names start with `prefix`, in the order CSS declares them. */
export function group(tokens: Token[], prefix: string): Token[] {
	return tokens.filter((token) => token.name.startsWith(prefix))
}

function tokenValue(tokens: Token[], name: string): string {
	const found = tokens.find((token) => token.name === name)
	if (!found) throw new Error(`app/globals.css has no ${name}`)
	return found.value
}

/*
 * The palette. Listed explicitly because these seven share no prefix, in the
 * order docs/design.md argues them: the field, then the ink, then the line,
 * then the accent, then the one surface that answers to shiki instead.
 */
export const PALETTE_TOKENS = [
	"--bg",
	"--bg-2",
	"--fg",
	"--fg-2",
	"--line",
	"--accent",
	"--code-bg",
] as const

export const PALETTE = PALETTE_TOKENS.map((name) => ({
	name,
	dark: tokenValue(ROOT, name),
	light: tokenValue(LIGHT, name),
}))

/**
 * A token's authored value, following one `var(--x)` indirection.
 *
 * One level is all the palette needs and all it should get: `--code-bg` is
 * `var(--bg)` in the light theme, and its own hex in the dark one, which is the
 * whole reason it is a separate token. A general resolver would invite a chain,
 * and a chain in a palette is a value nobody can read off the file.
 */
export function resolve(tokens: Token[], name: string): string {
	const value = tokenValue(tokens, name)
	const indirect = /^var\((--[\w-]+)\)$/.exec(value)
	return indirect ? tokenValue(tokens, indirect[1]) : value
}

function channel(component: number): number {
	const ratio = component / 255
	return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number | null {
	const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
	if (!match) return null

	const packed = Number.parseInt(match[1], 16)
	return (
		0.2126 * channel((packed >> 16) & 255) +
		0.7152 * channel((packed >> 8) & 255) +
		0.0722 * channel(packed & 255)
	)
}

/**
 * The WCAG 2.1 contrast ratio between two authored hex values, or null if either
 * is not one.
 *
 * Here so the design page can CHECK the AA claims docs/design.md makes about
 * this palette rather than reprinting them. The doc says --fg-2 on --bg clears
 * AA for body text in both themes; a number rendered beside the pair is the only
 * version of that sentence which cannot quietly stop being true.
 *
 * Authored values, not computed ones: nothing here resolves a gradient, an
 * alpha channel or a blend, so it is only correct for the flat hexes the palette
 * is made of. That is why it returns null instead of guessing.
 */
export function contrast(a: string, b: string): number | null {
	const first = luminance(a)
	const second = luminance(b)
	if (first === null || second === null) return null

	const [brighter, darker] = first > second ? [first, second] : [second, first]
	return (brighter + 0.05) / (darker + 0.05)
}

/*
 * The pairs docs/design.md makes a claim about, with the floor that claim is
 * against: 4.5 for body text (WCAG 1.4.3), 3.0 for a non-text boundary that
 * carries meaning (1.4.11). The ratio beside each is computed from the authored
 * hex rather than asserted here, so a retune that breaks one shows the number
 * that broke. lib/tokens.test.ts fails the build for every pair with a floor.
 *
 * A null floor means the pair has no threshold rather than that nobody checked.
 * 1.4.11 is about the parts a visitor needs in order to identify a CONTROL, and
 * exempts pure decoration; a hairline between two bands of content is decoration,
 * because the content either side is what carries the separation. The ratio is
 * printed anyway, because --line is ALSO a control border, where the rule does
 * apply. The note under the table is that finding.
 */
export const CONTRAST_PAIRS = [
	{ of: "--fg", on: "--bg", role: "Body text", floor: 4.5 },
	{ of: "--fg-2", on: "--bg", role: "Secondary text", floor: 4.5 },
	{ of: "--fg", on: "--bg-2", role: "Text on a raised surface", floor: 4.5 },
	{ of: "--fg-2", on: "--code-bg", role: "Text on a code block", floor: 4.5 },
	{ of: "--accent", on: "--bg", role: "Accent, non-text", floor: 3 },
	{ of: "--line", on: "--bg", role: "Hairline between content", floor: null },
] as const
