import { expect, test } from "@playwright/test"

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
	await page.goto("/")

	const scheme = await page.evaluate(
		() => getComputedStyle(document.documentElement).colorScheme,
	)
	expect(scheme).toContain("light")

	await context.close()
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
