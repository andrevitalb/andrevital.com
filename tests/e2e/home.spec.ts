import { expect, test } from "./fixtures"

/*
 * The two audit findings Unit 2 closes were both measurements in a real browser,
 * so both stay measurements. Neither can be a unit test: one is layout, the
 * other computed style.
 */

// Finding 4: the whole site was one screen, measured at scrollHeight ===
// innerHeight === 900 at 1440x900. Real scroll height is also the precondition
// for every scroll-driven primitive Unit 1 built, so a refactor that flattens
// Home silently disables Reveal and DrawRule across the page.
test("Home scrolls at 1440x900", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 })
	await page.goto("/")

	const { scrollHeight, innerHeight } = await page.evaluate(() => ({
		scrollHeight: document.body.scrollHeight,
		innerHeight: window.innerHeight,
	}))

	expect(scrollHeight).toBeGreaterThan(innerHeight)
})

// Finding 3: the accent rendered on zero elements on Home, because it was bound
// to the active nav link and Home is not in the nav. A sweep rather than an
// assertion on [data-hero-cut], so the guard is "the brand colour appears on
// Home": still true if the cut is later replaced by something else carrying it,
// and false the moment the accent quietly leaves the page again.
test("the accent renders on Home", async ({ page }) => {
	await page.goto("/")

	const count = await page.evaluate(() => {
		// Read from the live custom property rather than hardcoding a hex: the
		// palette has a dark and a light accent, and a copy here would be a
		// second source of truth for a value the design doc fixes.
		const accent = getComputedStyle(document.documentElement)
			.getPropertyValue("--accent")
			.trim()

		const probe = document.createElement("span")
		probe.style.color = accent
		document.body.append(probe)
		const resolved = getComputedStyle(probe).color
		probe.remove()

		const properties = [
			"color",
			"backgroundColor",
			"borderTopColor",
			"borderRightColor",
			"borderBottomColor",
			"borderLeftColor",
			"textDecorationColor",
		] as const

		let hits = 0
		for (const node of document.querySelectorAll("*")) {
			const style = getComputedStyle(node)
			if (properties.some((property) => style[property] === resolved)) hits++
		}
		return hits
	})

	expect(count).toBeGreaterThan(0)
})

// The gating is this unit's trap, so it is the thing that gets watched. An
// ungated cut draws itself behind the opaque intro veil and is finished before
// anyone sees it, which looks exactly like it never ran.
test.describe("on a first visit", () => {
	test.use({ intro: "first" })

	test("the cut waits for the veil to lift", async ({ page }) => {
		await page.goto("/")

		const cut = page.locator("[data-hero-cut]")
		const animation = () =>
			cut.evaluate((node) => getComputedStyle(node).animationName)

		// data-intro is "full" for the length of the intro, so the rule does not
		// match yet and the line is sitting at its resting full length.
		expect(await animation()).toBe("none")

		await page.keyboard.press("Escape")
		await expect
			.poll(animation, { message: "the cut never started" })
			.toBe("hero-cut")
	})
})
