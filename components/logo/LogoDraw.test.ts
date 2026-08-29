import { describe, expect, it } from "vitest"
import { parseCubicBezier, parseDuration } from "./LogoDraw"

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

describe("parseCubicBezier", () => {
	const fallback = [0.65, 0, 0.35, 1] as [number, number, number, number]

	it("reads the token as the build emits it", () => {
		expect(parseCubicBezier("cubic-bezier(.65, 0, .35, 1)", fallback)).toEqual([
			0.65, 0, 0.35, 1,
		])
	})

	it("keeps negative control points, which overshoot easings use", () => {
		expect(
			parseCubicBezier("cubic-bezier(0.5, -0.5, 0.2, 1)", fallback),
		).toEqual([0.5, -0.5, 0.2, 1])
	})

	it("falls back on anything that is not four numbers", () => {
		expect(parseCubicBezier("", fallback)).toBe(fallback)
		expect(parseCubicBezier("ease-in-out", fallback)).toBe(fallback)
		expect(parseCubicBezier("cubic-bezier(1, 2, 3)", fallback)).toBe(fallback)
	})
})
