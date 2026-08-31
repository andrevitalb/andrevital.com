import { expect, test } from "./fixtures"

// Buttons default to cursor: default in every browser. Nothing on this site set
// a pointer, so every control read as inert to the hand even where it worked.
test("an interactive control carries a pointer cursor", async ({ page }) => {
	await page.goto("/")

	const toggle = page.getByRole("button", { name: /theme/i })
	await expect(toggle).toHaveCSS("cursor", "pointer")
})

test("a route change replays the enter animation", async ({ page }) => {
	await page.goto("/")

	// The fixture defaults to a return visit, so the mode here is "inline" and
	// there is no veil to click through. That is also the mode this rule most
	// needs to cover: "inline" never becomes "done".

	await page.getByRole("link", { name: "About" }).first().click()
	await page.waitForURL("**/about")

	const name = await page
		.locator("[data-route-enter]")
		.evaluate((node) => getComputedStyle(node).animationName)

	expect(name).toBe("route-enter")
})

// A reveal that animates under reduced motion is a bug, not a preference.
test("the route animation is off under reduced motion", async ({ browser }) => {
	const context = await browser.newContext({ reducedMotion: "reduce" })
	const page = await context.newPage()
	await page.goto("/about")

	const name = await page
		.locator("[data-route-enter]")
		.evaluate((node) => getComputedStyle(node).animationName)

	expect(name).toBe("none")
	await context.close()
})

test.describe("the mobile nav sheet", () => {
	test.use({ viewport: { width: 320, height: 640 } })

	test("the bar holds one line and the links move into the sheet", async ({
		page,
	}) => {
		await page.goto("/")

		const bar = page.locator("header > div")
		expect((await bar.boundingBox())?.height).toBeLessThan(70)

		// The text row is display:none here, so its links are out of the tree.
		await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden()
		await expect(page.getByText("Menu", { exact: true })).toBeVisible()
	})

	test("opening it covers the page, and the same control closes it", async ({
		page,
	}) => {
		await page.goto("/")

		await page.getByText("Menu", { exact: true }).click()

		const sheetLink = page
			.getByRole("navigation", { name: "Primary, mobile" })
			.getByRole("link", { name: "About" })
		await expect(sheetLink).toBeVisible()

		// The panel is opaque and on top: a point mid-viewport must land inside it,
		// not on the page underneath. This is the regression that shipped once,
		// when the header's filled opacity animation trapped the panel in its own
		// stacking context.
		const insidePanel = await page.evaluate(() => {
			const hit = document.elementFromPoint(160, 320)
			return hit ? hit.closest("[data-nav-sheet-panel]") !== null : false
		})
		expect(insidePanel).toBe(true)

		await page.getByText("Close", { exact: true }).click()
		await expect(sheetLink).toBeHidden()
	})

	// The reason this is a <details> rather than a <dialog>: it has to work with
	// no JavaScript at all, which is where a dialog's showModal() leaves it dead.
	test("it opens and navigates with JavaScript disabled", async ({
		browser,
	}) => {
		const context = await browser.newContext({
			javaScriptEnabled: false,
			viewport: { width: 320, height: 640 },
		})
		const page = await context.newPage()
		await page.goto("/")

		const summary = page.locator("details[data-nav-sheet] > summary")
		await expect(summary).toBeVisible()

		await summary.click()
		const link = page
			.getByRole("navigation", { name: "Primary, mobile" })
			.getByRole("link", { name: "About" })
		await expect(link).toBeVisible()

		await link.click()
		await expect(page).toHaveURL(/\/about$/)

		await context.close()
	})
})
