import { test as base, expect, type Page } from "@playwright/test"
import { INTRO_MARKER } from "@/components/logo/intro-mode"

// A test that deliberately navigates to a 404 route gets the browser's own
// "Failed to load resource ... 404" line for the document itself, and that one
// is the point of the test. A 404 on any other URL is a missing asset and
// fails. Until U9 this was a blanket filter on every resource 404, because the
// site had no favicon; headless Chromium never actually requested one, so the
// filter was always wider than any test needed. app/icon.svg landed, so it
// narrows to documents the test asked for.
//
// Which documents those are has to be recorded as the requests go out rather
// than read off page.url() when the error arrives: a client-side navigation
// into a 404 fetches `/route?_rsc=...` while page.url() still reads `/route`,
// a fragment lives in one and not the other, and the console line can be
// delivered before Playwright has processed the navigation, leaving page.url()
// on about:blank. Origin and pathname are what the two agree on.
//
// Everything else, most importantly a React hydration mismatch (which shows
// up as its own distinctly worded console.error even in a production
// build), is real and fails the test. This is the regression guard for the
// U3 fix-round-1 hydration bug (a mismatched ThemeToggle first render).
const RESOURCE_404 = /Failed to load resource.*404/i

function routeOf(url: string) {
	try {
		const parsed = new URL(url)
		return parsed.origin + parsed.pathname
	} catch {
		return null
	}
}

export function watchForErrors(page: Page, errors: string[]) {
	const requested = new Set<string>()
	page.on("request", (request) => {
		if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
			const route = routeOf(request.url())
			if (route) requested.add(route)
		}
	})

	page.on("console", (message) => {
		if (message.type() !== "error") return

		if (RESOURCE_404.test(message.text())) {
			const route = routeOf(message.location().url)
			if (route && requested.has(route)) return
		}

		errors.push(message.text())
	})
	page.on("pageerror", (error) => {
		errors.push(error.message)
	})
}

/** What the intro script on <html> settled on, or "done" once the mark has docked. */
export function introMode(page: Page) {
	return page.evaluate(() => document.documentElement.dataset.intro)
}

/** Opacity of the veil the full intro draws over (a body::before, not an element). */
export function veilOpacity(page: Page) {
	return page.evaluate(
		() => getComputedStyle(document.body, "::before").opacity,
	)
}

/**
 * Every test is a returning visitor unless it opts out with
 * `test.use({ intro: "first" })`. Otherwise the full intro (about 2s of inert,
 * invisible page) would sit in front of every unrelated assertion.
 */
export const test = base.extend<{ intro: "first" | "return" }>({
	intro: ["return", { option: true }],

	page: async ({ page, intro }, use) => {
		if (intro === "return") {
			await page.addInitScript((marker) => {
				try {
					sessionStorage.setItem(marker, "1")
				} catch {}
			}, INTRO_MARKER)
		}

		const errors: string[] = []
		watchForErrors(page, errors)

		await use(page)

		expect(errors, `console or page errors:\n${errors.join("\n")}`).toEqual([])
	},
})

export { expect }
