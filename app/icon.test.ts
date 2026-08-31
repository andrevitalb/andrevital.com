import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { LOGO_PARTS } from "@/components/logo/LogoMark"

// A favicon is fetched as its own image, so the browser parses it as XML and
// not as HTML. XML is strict where HTML forgives, and it fails silently: the
// tab just shows the default page icon and nothing anywhere says why. This
// shipped once already, a double hyphen inside a comment, which renders fine
// inline in a page and not at all as an icon.
describe("app/icon.svg", () => {
	const source = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8")

	it("parses as XML", () => {
		const doc = new DOMParser().parseFromString(source, "image/svg+xml")
		expect(doc.querySelector("parsererror")?.textContent ?? null).toBeNull()
	})

	// The favicon cannot import LOGO_PARTS, being a static file rather than a
	// component, so the points are a copy. This is what keeps the copy honest
	// when the mark is redrawn.
	it.each(LOGO_PARTS)("carries the $part geometry", ({ points }) => {
		expect(source).toContain(points)
	})

	it("paints itself for both themes", () => {
		expect(source).toContain("prefers-color-scheme: dark")
	})

	// The favicon hardcodes what LOGO_LETTER_FILL and LOGO_CUT_FILL resolve to,
	// having no page to cascade from. Nothing else makes the two copies move
	// together, and a stale one is invisible until someone looks at a tab.
	it("carries the same four values the tokens resolve to", () => {
		const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8")
		const token = (block: string, name: string) => {
			const value = new RegExp(
				`${block}[^}]*?--${name}:\\s*(#[0-9a-f]{6})`,
				"s",
			).exec(css)?.[1]
			expect(value, `--${name} in ${block}`).toBeDefined()
			return value
		}

		// Light is declared twice, once for the class next-themes sets and once
		// in the no-JS media query. A drift in either one is a favicon that
		// disagrees with what someone actually sees, so both are read.
		const darkFg = token(":root \\{", "fg")
		const darkFg2 = token(":root \\{", "fg-2")
		const lightFg = token("\\.light \\{", "fg")
		const lightFg2 = token("\\.light \\{", "fg-2")
		expect(token(":root:not\\(\\.dark\\) \\{", "fg")).toBe(lightFg)
		expect(token(":root:not\\(\\.dark\\) \\{", "fg-2")).toBe(lightFg2)

		expect(source).toContain(`.letter { fill: ${lightFg2} }`)
		expect(source).toContain(`.cut { fill: ${lightFg} }`)
		expect(source).toContain(`.letter { fill: ${darkFg2} }`)
		expect(source).toContain(`.cut { fill: ${darkFg} }`)
	})
})
