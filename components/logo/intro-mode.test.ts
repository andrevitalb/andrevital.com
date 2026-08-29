import { afterEach, describe, expect, it, vi } from "vitest"
import {
	decideIntroMode,
	INTRO_ATTRIBUTE,
	INTRO_MARKER,
	introScript,
} from "./intro-mode"

describe("decideIntroMode", () => {
	const cases = [
		{ reducedMotion: false, marked: false, expected: "full" },
		{ reducedMotion: false, marked: true, expected: "inline" },
		{ reducedMotion: true, marked: false, expected: "inline" },
		{ reducedMotion: true, marked: true, expected: "inline" },
	] as const

	for (const { reducedMotion, marked, expected } of cases) {
		it(`is ${expected} with reducedMotion=${reducedMotion} marked=${marked}`, () => {
			expect(decideIntroMode(reducedMotion, marked)).toBe(expected)
		})
	}
})

describe("introScript", () => {
	afterEach(() => {
		vi.restoreAllMocks()
		sessionStorage.clear()
		document.documentElement.removeAttribute(INTRO_ATTRIBUTE)
	})

	function run(reducedMotion: boolean) {
		window.matchMedia = vi.fn().mockReturnValue({ matches: reducedMotion })
		new Function(introScript)()
		return document.documentElement.getAttribute(INTRO_ATTRIBUTE)
	}

	it("marks the first visit full and stores the marker", () => {
		expect(run(false)).toBe("full")
		expect(sessionStorage.getItem(INTRO_MARKER)).toBe("1")
	})

	it("marks a later visit in the same tab inline", () => {
		run(false)
		expect(run(false)).toBe("inline")
	})

	it("marks a reduced-motion first visit inline", () => {
		expect(run(true)).toBe("inline")
	})

	it("treats unavailable storage as a first visit", () => {
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new Error("storage is blocked")
		})

		expect(run(false)).toBe("full")
	})

	it("falls back to inline if the decision throws", () => {
		window.matchMedia = vi.fn().mockImplementation(() => {
			throw new Error("no matchMedia")
		})
		new Function(introScript)()

		expect(document.documentElement.getAttribute(INTRO_ATTRIBUTE)).toBe(
			"inline",
		)
	})
})
