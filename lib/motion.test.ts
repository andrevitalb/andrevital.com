import { describe, expect, it } from "vitest"
import {
	type Bezier,
	duration,
	easing,
	parseCubicBezier,
	parseDuration,
} from "@/lib/motion"

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
	const fallback = [0.65, 0, 0.35, 1] as Bezier

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

// Custom properties do not resolve in jsdom, so these exercise the fallback
// table, which is the only part of duration() and easing() that is not the
// browser's own value. That is the point: the table is what the server and the
// tests render with, so a wrong entry there is a real bug.
describe("duration", () => {
	it("falls back to the authored value of every token", () => {
		expect(duration("--duration-fast")).toBe(0.15)
		expect(duration("--duration-base")).toBe(0.24)
		expect(duration("--duration-slow")).toBe(0.4)
		expect(duration("--duration-draw")).toBe(0.6)
		expect(duration("--duration-cut")).toBe(0.3)
		expect(duration("--duration-pop")).toBe(0.2)
		expect(duration("--duration-dock")).toBe(0.5)
		expect(duration("--duration-draw-inline")).toBe(0.7)
		expect(duration("--duration-stagger")).toBe(0.06)
		expect(duration("--duration-route")).toBe(0.24)
	})
})

describe("easing", () => {
	it("falls back to the authored control points of every token", () => {
		expect(easing("--ease-out-expo")).toEqual([0.16, 1, 0.3, 1])
		expect(easing("--ease-standard")).toEqual([0.2, 0, 0, 1])
		expect(easing("--ease-in-out-quart")).toEqual([0.65, 0, 0.35, 1])
	})

	it("hands back a fresh array each call, so a consumer cannot mutate the table", () => {
		const first = easing("--ease-out-expo")
		first[0] = 999
		expect(easing("--ease-out-expo")[0]).toBe(0.16)
	})
})
