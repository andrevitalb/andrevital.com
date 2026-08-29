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
	await expect(page.locator("main")).toHaveAttribute("inert", "")

	await expect
		.poll(() => introMode(page), { timeout: HANDOVER_TIMEOUT })
		.toBe("done")

	await expect(page.locator("main")).not.toHaveAttribute("inert", "")
	await expect.poll(() => veilOpacity(page)).toBe("0")
	await expect(page.getByRole("heading", HEADING)).toBeVisible()
	await expect(page.locator("#site-logo")).toBeAttached()
})

test("any keypress ends the intro on the spot", async ({ page }) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })
	await expect(page.locator("main")).toHaveAttribute("inert", "")

	await page.keyboard.press("Escape")

	await expect.poll(() => introMode(page), { timeout: 500 }).toBe("done")
	await expect(page.locator("main")).not.toHaveAttribute("inert", "")
})

test("a second visit in the same tab renders the page at once", async ({
	page,
}) => {
	await page.goto("/", { waitUntil: "domcontentloaded" })
	await page.reload({ waitUntil: "domcontentloaded" })

	expect(await introMode(page)).toBe("inline")
	await expect(page.locator("main")).not.toHaveAttribute("inert", "")
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

test("home promises nothing while Work is hidden", async ({ page }) => {
	await page.goto("/")

	await expect(page.locator('a[href="/work"]')).toHaveCount(0)
	await expect(page.locator('a[href^="/craft"]')).toHaveCount(0)
})
