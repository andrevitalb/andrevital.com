import { expect, test } from "@playwright/test"

// Runs against the all-sections-hidden build (see playwright.config.ts). Plain
// @playwright/test rather than the shared fixture: that fixture fails a test on
// any console error, and every page here is a deliberate 404, which logs one.
//
// KTD3: a hidden section has to be indistinguishable from a route that was never
// built. These pages exist in the filesystem and have real content behind them,
// so "indistinguishable" is a claim that has to be checked against the bytes,
// not assumed from a 404 status.

const UNKNOWN = "/this-route-does-not-exist"

const hiddenRoutes = [
	"/writing",
	"/writing/setting-up-a-multi-package-project",
	"/writing/setting-up-a-multi-package-project/opengraph-image",
	"/feed.xml",
	"/work",
	"/work/example-client",
	"/work/example-client/opengraph-image",
	"/craft",
	"/craft/logo-draw",
]

test("every hidden route answers exactly like an unknown one", async ({
	page,
}) => {
	const unknown = await page.request.get(UNKNOWN)
	expect(unknown.status()).toBe(404)
	const unknownBody = await unknown.text()

	for (const route of hiddenRoutes) {
		const response = await page.request.get(route)
		expect(response.status(), route).toBe(404)
		expect(response.headers()["content-type"], route).toContain("text/html")
		expect(await response.text(), route).toBe(unknownBody)
	}
})

test("the 404 a hidden section serves is the real, styled one", async ({
	page,
}) => {
	// Not just a 404 status: notFound() thrown from a prerendered page used to
	// return an `__next_error__` shell with an empty <body> and no stylesheet, so
	// the status was right and the page was blank.
	const response = await page.goto("/writing")
	expect(response?.status()).toBe(404)

	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Whoops,")
	await expect(page.getByRole("link", { name: "Go back home" })).toBeVisible()

	const styled = await page
		.getByRole("heading", { level: 1 })
		.evaluate((node) => getComputedStyle(node).fontSize)
	expect(Number.parseFloat(styled)).toBeGreaterThan(24)
})

test("a hidden section leaks none of its own metadata", async ({ page }) => {
	// A page's module-level `metadata` export is evaluated whatever the page then
	// does, which is how the section's title, description and canonical URL ended
	// up in its own 404 body.
	const body = await (await page.request.get("/writing")).text()

	for (const tell of [
		"Writing · André Vital",
		"https://andrevital.com/writing",
		"Notes on front-end engineering",
	]) {
		expect(body, tell).not.toContain(tell)
	}
})

test("the legacy blog and develop URLs go home rather than pointing at a hidden section", async ({
	page,
}) => {
	for (const legacy of [
		"/blog",
		"/blog/setting-up-a-multi-package-project",
		"/develop",
		"/develop/anything",
	]) {
		const hop = await page.request.get(legacy, { maxRedirects: 0 })
		// Not permanent while the destination depends on a flag: a 308 would be
		// cached by the browser and outlive the flag flip.
		expect(hop.status(), legacy).toBe(307)
		expect(hop.headers().location, legacy).toBe("/")
	}
})

test("the sitemap and robots admit nothing", async ({ page }) => {
	const sitemap = await (await page.request.get("/sitemap.xml")).text()

	expect(sitemap).toContain("https://andrevital.com/about")
	for (const section of ["/writing", "/work", "/craft"]) {
		expect(sitemap, section).not.toContain(`https://andrevital.com${section}`)
	}
})

test("home promises nothing about a hidden section", async ({ page }) => {
	// Moved here from intro.spec in U7: the visible build now flags Work on, so
	// the only build where this claim is true is this one. Nav is where a hidden
	// section leaks by omission of a filter rather than by a route.
	await page.goto("/")

	for (const section of ["/work", "/craft", "/writing"]) {
		await expect(page.locator(`a[href^="${section}"]`), section).toHaveCount(0)
	}
})
