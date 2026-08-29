import { expect, test } from "./fixtures"

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

test.describe("with a light system preference", () => {
	test.use({ colorScheme: "light" })

	test("the first load is light", async ({ page }) => {
		await page.goto("/")

		const scheme = await page.evaluate(
			() => getComputedStyle(document.documentElement).colorScheme,
		)
		expect(scheme).toContain("light")
	})
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
	test(`no horizontal scroll at ${viewport.width}px on home, about and contact`, async ({
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

		// R24: About is the densest page on the site, with an 11rem date column
		// beside prose, so it is the one most likely to push the viewport wide.
		await page.goto("/about")
		const aboutOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		)
		expect(aboutOverflow).toBe(false)
	})
}

test("about renders the CV timeline and links the generated PDF", async ({
	page,
}) => {
	const response = await page.goto("/about")
	expect(response?.status()).toBe(200)

	await expect(
		page.getByRole("heading", { name: "Where I have worked" }),
	).toBeVisible()
	await expect(
		page.getByRole("heading", { level: 3, name: /Metalab/ }),
	).toBeVisible()

	// Every entry in content/cv.yaml reaches the page: a loader that silently
	// dropped one would still pass a "the timeline renders" assertion.
	await expect(page.locator("main h3")).toHaveCount(6)

	await expect(page.getByRole("link", { name: "Download CV" })).toHaveAttribute(
		"href",
		"/cv.pdf",
	)
})

test("the generated CV PDF is served, including from its legacy URLs", async ({
	page,
}) => {
	const direct = await page.request.get("/cv.pdf")
	expect(direct.status()).toBe(200)
	expect(direct.headers()["content-type"]).toContain("pdf")

	// R22: the old site linked a capitalised filename, and the case mismatch
	// between the link and the tracked file is what 404'd it on Vercel. Fetched
	// rather than navigated to: Chromium downloads a PDF instead of loading it,
	// which fails page.goto outright.
	for (const legacy of ["/docs/en/cv.pdf", "/docs/en/CV.pdf"]) {
		const hop = await page.request.get(legacy, { maxRedirects: 0 })
		expect(hop.status()).toBe(308)
		expect(hop.headers().location).toBe("/cv.pdf")

		const followed = await page.request.get(legacy)
		expect(followed.status()).toBe(200)
		expect(followed.headers()["content-type"]).toContain("pdf")
	}
})
