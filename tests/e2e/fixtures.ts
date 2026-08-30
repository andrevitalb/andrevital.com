import { test as base, expect, type Page } from "@playwright/test"
import { INTRO_MARKER } from "@/components/logo/intro-mode"

// A generic resource-load 404 (the browser's own "Failed to load resource"
// line) is expected noise in this repo: every page requests /favicon.ico and
// there are no favicon assets yet (a U9 item), and several tests deliberately
// navigate to pages that return 404. This filter is wider than either reason
// needs, so it goes when the favicons land and the noise stops.
// Everything else, most importantly a React hydration mismatch (which shows
// up as its own distinctly worded console.error even in a production
// build), is real and fails the test. This is the regression guard for the
// U3 fix-round-1 hydration bug (a mismatched ThemeToggle first render).
const BENIGN_ERROR = /Failed to load resource.*404/i

export function watchForErrors(page: Page, errors: string[]) {
	page.on("console", (message) => {
		if (message.type() === "error" && !BENIGN_ERROR.test(message.text())) {
			errors.push(message.text())
		}
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
