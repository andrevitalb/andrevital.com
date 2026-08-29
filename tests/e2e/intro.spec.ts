import {
	expect,
	introMode,
	test,
	veilOpacity,
	watchForErrors,
} from "./fixtures"

test.use({ intro: "first" })

const HEADING = { name: "André Vital" }

// R7: two letterform draws, the cut and the colour pop, then the dock. The mark
// has to reach the nav inside this.
const INTRO_BUDGET = 2500

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
		.poll(() => introMode(page), { timeout: INTRO_BUDGET })
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

test("reduced motion gets the page with no drawing at all", async ({
	browser,
}) => {
	const context = await browser.newContext({ reducedMotion: "reduce" })
	const page = await context.newPage()
	const errors: string[] = []
	watchForErrors(page, errors)

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

	expect(errors, `console or page errors:\n${errors.join("\n")}`).toEqual([])
	await context.close()
})

test("home promises nothing while Work is hidden", async ({ page }) => {
	await page.goto("/")

	await expect(page.locator('a[href="/work"]')).toHaveCount(0)
	await expect(page.locator('a[href^="/craft"]')).toHaveCount(0)
})
