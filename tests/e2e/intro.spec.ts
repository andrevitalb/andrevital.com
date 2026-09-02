import { expect, introMode, test, veilOpacity } from "./fixtures"

test.use({ intro: "first" })

const HEADING = { name: "André Vital" }

// Generous on purpose. The sequence itself is 1.7s, but the timer only starts
// once LogoIntro's effect runs, so this window has to absorb hydration too, and a
// cold WebKit run on CI is slow. R7's 2.2s budget is pinned by the token maths in
// components/logo/LogoIntro.test.tsx, not by wall clock here.
const HANDOVER_TIMEOUT = 5000

test("the first visit draws the mark, then hands the page over", async ({
	page,
}) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })

	expect(await introMode(page)).toBe("full")
	// Behind the veil: painted (so it still counts for LCP) but covered, and out
	// of reach.
	expect(await veilOpacity(page)).toBe("1")
	await expect(page.locator("main")).toHaveCSS("opacity", "1")
	await expect(page.locator("[data-intro-overlay]")).toBeVisible()

	await expect
		.poll(() => introMode(page), { timeout: HANDOVER_TIMEOUT })
		.toBe("done")

	await expect(page.locator("[data-intro-overlay]")).toHaveCount(0)
	await expect.poll(() => veilOpacity(page)).toBe("0")
	await expect(page.getByRole("heading", HEADING)).toBeVisible()
	await expect(page.locator("#site-logo")).toBeAttached()
})

test("any keypress ends the intro on the spot", async ({ page }) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })
	await expect(page.locator("[data-intro-overlay]")).toBeVisible()

	await page.keyboard.press("Escape")

	await expect.poll(() => introMode(page), { timeout: 500 }).toBe("done")
	await expect(page.locator("[data-intro-overlay]")).toHaveCount(0)
})

// The page keeps its place in the accessibility tree during the intro rather than
// going inert (KTD4, amended), so the veil has to be what stops a stray click
// reaching a link underneath.
test("a click on a link under the veil ends the intro instead of following it", async ({
	page,
}) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })
	await expect(page.locator("[data-intro-overlay]")).toBeVisible()

	// Scoped by role, so it is whichever shell is on screen at this viewport: the
	// sidebar above lg, the bar below it (U4b). The other two navigations are in
	// the DOM as well, and this test needs the link that is actually laid out.
	const link = await page
		.getByRole("navigation", { name: "Primary" })
		.getByRole("link", { name: "Contact" })
		.boundingBox()
	if (!link) throw new Error("the Contact link is not laid out")
	await page.mouse.click(link.x + link.width / 2, link.y + link.height / 2)

	await expect.poll(() => introMode(page), { timeout: 500 }).toBe("done")
	expect(new URL(page.url()).pathname).toBe("/")
})

test("a second visit in the same tab renders the page at once", async ({
	page,
}) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })
	await page.reload({ waitUntil: "domcontentloaded" })

	expect(await introMode(page)).toBe("inline")
	await expect(page.locator("[data-intro-overlay]")).toHaveCount(0)
	// R8: readable at once, no veil to wait out.
	expect(await veilOpacity(page)).toBe("0")
	await expect(page.locator("main")).toHaveCSS("opacity", "1", {
		timeout: 1000,
	})
	await expect(page.getByRole("heading", HEADING)).toBeVisible()
})

test.describe("with reduced motion", () => {
	// reducedMotion is not a top-level test option in Playwright 1.62; it reaches
	// the context through contextOptions.
	test.use({ contextOptions: { reducedMotion: "reduce" } })

	test("the page arrives with no drawing at all", async ({ page }) => {
		await page.goto("/")

		expect(await introMode(page)).toBe("inline")
		expect(await veilOpacity(page)).toBe("0")
		await expect(page.locator("main")).toHaveCSS("opacity", "1")

		// The drawing mark carries a dash pattern; the plain one never does.
		await expect
			.poll(() =>
				page.evaluate(() => {
					const part = document.querySelector("#site-logo [data-logo-part]")
					return part ? getComputedStyle(part).strokeDasharray : null
				}),
			)
			.toBe("none")
	})
})
