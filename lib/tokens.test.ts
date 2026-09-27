import { describe, expect, it } from "vitest"
import {
	CONTRAST_PAIRS,
	contrast,
	declarations,
	group,
	LIGHT,
	PALETTE,
	ROOT,
	resolve,
	THEME,
} from "@/lib/tokens"

/*
 * The design page prints these, so an empty group is a section that silently
 * renders nothing rather than a crash. That is the failure this file exists to
 * catch: restructuring app/globals.css (renaming a block, moving the palette
 * into a media query, wrapping @theme inline in something) leaves the page
 * building and blank, and nothing else in the suite reads the stylesheet's
 * shape.
 *
 * Values are asserted sparingly and only where the value IS the decision. This
 * is not a second copy of the palette; it is a check that the parse found one.
 */
describe("the token parse", () => {
	it("finds the dark palette, the motion tokens and the geometry in :root", () => {
		expect(group(ROOT, "--duration-").length).toBeGreaterThan(5)
		expect(ROOT.map((token) => token.name)).toContain("--cut-angle")
		expect(ROOT.map((token) => token.name)).toContain("--bg")
	})

	it("finds the light overrides", () => {
		expect(LIGHT.length).toBe(PALETTE.length)
	})

	it("finds each namespace @theme inline declares", () => {
		expect(group(THEME, "--text-").length).toBe(7)
		expect(group(THEME, "--font-").length).toBe(3)
		expect(group(THEME, "--ease-").length).toBe(3)
		expect(group(THEME, "--radius-").length).toBe(2)
		expect(group(THEME, "--spacing-").length).toBeGreaterThan(2)
		expect(group(THEME, "--container-").length).toBe(2)
	})

	it("keeps the source order, which is the type scale's own order", () => {
		expect(group(THEME, "--text-").map((token) => token.name)).toEqual([
			"--text-hero",
			"--text-display",
			"--text-h2",
			"--text-h3",
			"--text-body",
			"--text-small",
			"--text-meta",
		])
	})

	it("pairs every palette token with both themes", () => {
		for (const entry of PALETTE) {
			expect(entry.dark, entry.name).toMatch(/\S/)
			expect(entry.light, entry.name).toMatch(/\S/)
		}
	})

	it("stops at the block it was asked for", () => {
		// The :root inside `@media (width >= 64rem)` also declares --nav-height and
		// --shell-inset. A parse that ran past the column-zero `}` would return two
		// of each, and the page would print the token twice with different values.
		const names = ROOT.map((token) => token.name)
		expect(names.length).toBe(new Set(names).size)
		// The light media query re-declares the whole palette; the same run-on
		// would pull it into the dark block.
		expect(ROOT.filter((token) => token.name === "--bg").length).toBe(1)
	})

	it("collapses a multi-line value onto one line", () => {
		const [drop] = declarations(
			"\n\t--drop: calc(\n\t\t100vw *\n\t\tvar(--rise)\n\t);\n",
		)
		expect(drop).toEqual({
			name: "--drop",
			value: "calc( 100vw * var(--rise) )",
		})
	})
})

describe("resolve", () => {
	it("follows the one indirection the palette has", () => {
		// --code-bg is its own hex in the dark theme and var(--bg) in the light one,
		// which is the whole reason it is a separate token.
		expect(resolve(LIGHT, "--code-bg")).toBe(resolve(LIGHT, "--bg"))
		expect(resolve(LIGHT, "--code-bg")).toMatch(/^#[0-9a-f]{6}$/i)
	})

	it("hands back a direct value untouched", () => {
		expect(resolve(ROOT, "--bg")).toBe(
			ROOT.find((token) => token.name === "--bg")?.value,
		)
	})
})

describe("contrast", () => {
	it("agrees with the WCAG reference at both ends of the range", () => {
		expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 4)
		expect(contrast("#ffffff", "#ffffff")).toBeCloseTo(1, 4)
	})

	it("is symmetric, so pair order cannot change a reported ratio", () => {
		const fg = resolve(ROOT, "--fg")
		const bg = resolve(ROOT, "--bg")
		expect(contrast(fg, bg)).toBe(contrast(bg, fg))
	})

	it("refuses anything that is not a flat hex rather than guessing", () => {
		expect(contrast("var(--bg)", "#ffffff")).toBeNull()
		expect(contrast("transparent", "#ffffff")).toBeNull()
	})

	// Every pair the design page prints with a floor, held to it here, with the
	// page's own >= so a pass on the page is a pass in CI.
	it("holds every floored pair to its floor in both themes", () => {
		for (const [label, tokens] of [
			["dark", ROOT],
			["light", LIGHT],
		] as const) {
			for (const { of, on, floor } of CONTRAST_PAIRS) {
				if (floor === null) continue
				expect(
					contrast(resolve(tokens, of), resolve(tokens, on)),
					`${label} ${of} on ${on}`,
				).toBeGreaterThanOrEqual(floor)
			}
		}
	})
})
