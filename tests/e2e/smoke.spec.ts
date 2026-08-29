import { test as base, expect } from "@playwright/test"

// A generic resource-load 404 (the browser's own "Failed to load resource"
// line) is expected noise in this repo: nav links to routes later units
// haven't shipped yet 404 on purpose (see components/nav/Nav.tsx), and the
// 404-parity test below deliberately navigates to pages that return 404.
// Everything else, most importantly a React hydration mismatch (which shows
// up as its own distinctly worded console.error even in a production
// build), is real and fails the test. This is the regression guard for the
// U3 fix-round-1 hydration bug (a mismatched ThemeToggle first render).
const BENIGN_ERROR = /Failed to load resource.*404/i

function watchForErrors(
	page: import("@playwright/test").Page,
	errors: string[],
) {
	page.on("console", (message) => {
		if (message.type() === "error" && !BENIGN_ERROR.test(message.text())) {
			errors.push(message.text())
		}
	})
	page.on("pageerror", (error) => {
		errors.push(error.message)
	})
}

const test = base.extend({
	page: async ({ page }, use) => {
		const errors: string[] = []
		watchForErrors(page, errors)

		await use(page)

		expect(errors, `console or page errors:\n${errors.join("\n")}`).toEqual([])
	},
})

test("home responds and shows the site name", async ({ page }) => {
	const response = await page.goto("/")

	expect(response?.status()).toBe(200)
	await expect(page.getByRole("heading", { name: "André Vital" })).toBeVisible()
})

test("an unknown route and a hidden section route both 404 the same way", async ({
	page,
}) => {
	const unknown = await page.goto("/this-route-does-not-exist")
	expect(unknown?.status()).toBe(404)
	const unknownHeading = await page
		.getByRole("heading", { level: 1 })
		.textContent()

	// This build has no NEXT_PUBLIC_SECTIONS set, so /work is a hidden section
	// route: it must 404 identically, with no hint that it exists.
	const hidden = await page.goto("/work")
	expect(hidden?.status()).toBe(404)
	const hiddenHeading = await page
		.getByRole("heading", { level: 1 })
		.textContent()

	expect(hiddenHeading).toBe(unknownHeading)
})

test("theme toggle persists across reload", async ({ page }) => {
	await page.goto("/")
	const toggle = page.getByRole("button", { name: /switch to/i })
	await expect(toggle).toBeVisible()

	const initialLabel = await toggle.getAttribute("aria-label")
	await toggle.click()

	await expect(
		page.getByRole("button", { name: /switch to/i }),
	).not.toHaveAttribute("aria-label", initialLabel ?? "")
	const toggledLabel = await page
		.getByRole("button", { name: /switch to/i })
		.getAttribute("aria-label")

	await page.reload()
	await expect(
		page.getByRole("button", { name: /switch to/i }),
	).toHaveAttribute("aria-label", toggledLabel ?? "")
})

test("system light preference yields a light first load", async ({
	browser,
}) => {
	const context = await browser.newContext({ colorScheme: "light" })
	const page = await context.newPage()
	const errors: string[] = []
	watchForErrors(page, errors)

	await page.goto("/")

	const scheme = await page.evaluate(
		() => getComputedStyle(document.documentElement).colorScheme,
	)
	expect(scheme).toContain("light")
	expect(errors, `console or page errors:\n${errors.join("\n")}`).toEqual([])

	await context.close()
})

test("the logo mark's rendered color flips with the theme", async ({
	page,
}) => {
	await page.goto("/")

	const readLogoColor = () =>
		page.evaluate(() => {
			const letter = document.querySelector(
				'#site-logo [data-logo-part="letter-a"]',
			)
			return letter ? getComputedStyle(letter).fill : null
		})

	const initialColor = await readLogoColor()
	expect(initialColor).not.toBeNull()

	await page.getByRole("button", { name: /switch to/i }).click()
	const toggledColor = await readLogoColor()

	expect(toggledColor).not.toBe(initialColor)
})

for (const viewport of [
	{ width: 320, height: 700 },
	{ width: 390, height: 844 },
	{ width: 1440, height: 900 },
]) {
	test(`no horizontal scroll at ${viewport.width}px on home and contact`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport)

		await page.goto("/")
		const homeOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(homeOverflow).toBe(false)

		await page.goto("/contact")
		const contactOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(contactOverflow).toBe(false)
	})
}
