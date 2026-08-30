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
})
