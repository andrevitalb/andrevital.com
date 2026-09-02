import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

// jsdom implements no media queries at all, and NavLogo reads one to decide which
// shell is live (U4b). Nothing here should assert against this stub: it reports
// every query as unmatched, which in that component means the bar, and any test
// that cares about the sidebar's side of the branch belongs in Playwright, where
// there is a real viewport.
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}),
})

afterEach(() => {
	cleanup()
})
