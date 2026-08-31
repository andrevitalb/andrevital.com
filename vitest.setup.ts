import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"
import "@testing-library/jest-dom/vitest"

// jsdom has no IntersectionObserver, and motion's whileInView constructs one on
// mount, so any component using it throws before it can render. The stub never
// fires a callback: components that reveal on scroll must render their content
// regardless, which is the behaviour worth pinning anyway.
if (!("IntersectionObserver" in globalThis)) {
	class StubIntersectionObserver {
		readonly root = null
		readonly rootMargin = ""
		readonly scrollMargin = ""
		readonly thresholds: readonly number[] = []
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return []
		}
	}

	globalThis.IntersectionObserver =
		StubIntersectionObserver as unknown as typeof IntersectionObserver
}

afterEach(() => {
	cleanup()
})
