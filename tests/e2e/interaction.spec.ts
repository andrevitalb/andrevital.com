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
