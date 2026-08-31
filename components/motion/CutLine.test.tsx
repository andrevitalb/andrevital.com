import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { CutLine } from "@/components/motion/CutLine"

describe("CutLine", () => {
	it("defaults to passing under the type", () => {
		expect(renderToStaticMarkup(<CutLine />)).toContain('data-cut="under"')
	})

	it("passes over the type when asked", () => {
		expect(renderToStaticMarkup(<CutLine over />)).toContain('data-cut="over"')
	})

	// Decoration, and the only thing it would announce is the word "cut".
	it("is hidden from assistive technology", () => {
		expect(renderToStaticMarkup(<CutLine />)).toContain("aria-hidden")
	})

	// Same contract as Reveal and DrawRule: a clip-path or an opacity baked into
	// the server HTML would hide the line for a visitor whose bundle never
	// arrived, rather than leaving it drawn.
	it("ships no inline style in the server HTML", () => {
		expect(renderToStaticMarkup(<CutLine over />)).not.toContain("style")
	})
})
