import { afterEach, describe, expect, it } from "vitest"
import { hiddenSectionRewrites } from "./rewrites"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

function sources() {
	return hiddenSectionRewrites().map((rewrite) => rewrite.source)
}

describe("hiddenSectionRewrites", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("swallows every section and the feed when nothing is flagged on", () => {
		delete process.env[ENV_KEY]

		expect(sources()).toEqual([
			"/work",
			"/work/:path*",
			"/craft",
			"/craft/:path*",
			"/writing",
			"/writing/:path*",
			"/feed.xml",
		])
	})

	it("leaves a visible section's routes alone", () => {
		process.env[ENV_KEY] = "writing"
		const swallowed = sources()

		expect(swallowed).not.toContain("/writing")
		expect(swallowed).not.toContain("/writing/:path*")
		// The feed only exists when Writing does.
		expect(swallowed).not.toContain("/feed.xml")
		expect(swallowed).toContain("/work")
		expect(swallowed).toContain("/craft/:path*")
	})

	it("sends everything it swallows to one route that does not exist", () => {
		delete process.env[ENV_KEY]
		const destinations = new Set(
			hiddenSectionRewrites().map((rewrite) => rewrite.destination),
		)

		expect(destinations.size).toBe(1)
		// Not a real route, which is the point: Next falls through to its own 404.
		expect([...destinations][0]).toBe("/_hidden-section")
	})

	it("is empty when every section is visible", () => {
		process.env[ENV_KEY] = "work,craft,writing"
		expect(hiddenSectionRewrites()).toEqual([])
	})
})
