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

// The repo's own precedent, from the route animation: a rule that animates under
// reduced motion is a bug, not a preference. The cut's resting state is the
// finished line, so what this proves is that a visitor who asked for less motion
// still gets the whole diagonal, just without the draw.
test("the cut is drawn statically under reduced motion", async ({
	browser,
}) => {
	const context = await browser.newContext({ reducedMotion: "reduce" })
	const page = await context.newPage()
	await page.goto("/")

	const cut = page.locator("[data-hero-cut]")
	expect(
		await cut.evaluate((node) => getComputedStyle(node).animationName),
	).toBe("none")
	expect(await cut.evaluate((node) => getComputedStyle(node).clipPath)).toBe(
		"none",
	)
	await expect(cut).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
	expect(
		await cut.evaluate((node) => getComputedStyle(node).backgroundImage),
	).toContain("gradient")

	await context.close()
})

// --nav-height in app/globals.css is a hardcoded 4.0625rem, and the hero's
// min-height is the viewport less that number. This is the assertion that keeps
// it honest: change the bar's padding without changing the token and the facts
// band stops landing on the fold, which is the whole point of the measurement.
test("the facts band lands exactly on the fold", async ({ page }) => {
	for (const viewport of [
		{ width: 1440, height: 900 },
		{ width: 1280, height: 800 },
		{ width: 320, height: 720 },
	]) {
		await page.setViewportSize(viewport)
		await page.goto("/")
		// Both fonts load with display: swap, so measuring before they settle reads
		// the fallback's metrics and lands a few pixels out. Without this the
		// assertion is a flake generator rather than a guard.
		await page.evaluate(() => document.fonts.ready)

		const bottom = await page
			.locator("dl")
			.first()
			.evaluate((node) => node.parentElement?.getBoundingClientRect().bottom)

		const where = `facts band at ${viewport.width}x${viewport.height}`
		// A window rather than an exact match: three lines of fluid type produce
		// fractional line boxes. It is still a real guard, because a wrong
		// --nav-height misses by the height of the bar (65px), not by a few.
		expect(bottom, where).toBeLessThanOrEqual(viewport.height + 6)
		expect(bottom, where).toBeGreaterThan(viewport.height - 12)
	}
})

// The weave is two layers of one shape with the headline between them, so the
// front layer being clipped is the whole effect. Unclipped it covers the type
// outright; with no clip rule at all it is a duplicate mark at full opacity.
test("the hero mark is woven, not just stacked", async ({ page }) => {
	await page.goto("/")

	const back = page.locator("[data-hero-mark]")
	const front = page.locator("[data-hero-mark-weave]")

	await expect(back).toHaveCount(1)
	await expect(front).toHaveCount(1)

	const clip = await front.evaluate((node) => getComputedStyle(node).clipPath)
	expect(clip).not.toBe("none")

	// Both decorative, so neither may reach the accessibility tree or the pointer.
	await expect(back).toHaveAttribute("aria-hidden", "true")
	await expect(front).toHaveAttribute("aria-hidden", "true")
	await expect(front).toHaveCSS("pointer-events", "none")
})
