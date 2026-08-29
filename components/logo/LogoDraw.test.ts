import { describe, expect, it } from "vitest"
import { parseDuration } from "./LogoDraw"

describe("parseDuration", () => {
	it("reads the authored millisecond tokens", () => {
		expect(parseDuration("600ms", 1)).toBe(0.6)
	})

	it("reads the seconds the CSS minifier rewrites them to", () => {
		expect(parseDuration(".6s", 1)).toBe(0.6)
		expect(parseDuration("0.6s", 1)).toBe(0.6)
	})

	it("falls back when the property does not resolve, as in jsdom", () => {
		expect(parseDuration("", 600)).toBe(0.6)
		expect(parseDuration("inherit", 600)).toBe(0.6)
		expect(parseDuration("0s", 600)).toBe(0.6)
	})
})
