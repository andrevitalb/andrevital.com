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
// assertion on [data-cut], so the guard is "the brand colour appears on
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

		const cut = page.locator("[data-cut]")
		const animation = () =>
			cut.evaluate((node) => getComputedStyle(node).animationName)

		// data-intro is "full" for the length of the intro, so the rule does not
		// match yet and the line is sitting at its resting full length.
		expect(await animation()).toBe("none")

		await page.keyboard.press("Escape")
		await expect
			.poll(animation, { message: "the cut never started" })
			.toBe("cut")
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

	const cut = page.locator("[data-cut]")
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

// --nav-height in app/globals.css is a hardcoded 4.0625rem below lg and 0 above
// it, where U4b deleted the bar, and the hero's min-height is the viewport less
// that number. This is the assertion that keeps it honest: change the bar's
// padding without changing the token and the facts band stops landing on the
// fold, which is the whole point of the measurement.
//
// 900 is in the list because the two desktop widths no longer exercise the token
// at all: with it at 0 they only prove that a 100svh section fills the viewport,
// which any value would. Between sm and lg the bar is still there and still
// 4.0625rem, so that is where a wrong value now misses by the height of it.
test("the facts band lands exactly on the fold", async ({ page }) => {
	for (const viewport of [
		{ width: 1440, height: 900 },
		{ width: 1280, height: 800 },
		{ width: 900, height: 800 },
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
		// --nav-height misses by the height of the bar (65px), not by a few, at
		// every width where there is a bar.
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

/*
 * The guard for the bug this page shipped with: the accent was built from a
 * -26.57deg figure taken corner to corner across the slash's WIDTH, while the
 * slash itself runs at 24.23deg along its length. Two degrees is close enough to
 * read as a mistake rather than a second angle, and nothing caught it because the
 * number was restated in four places instead of measured once.
 *
 * This measures the rendered slash off the SVG and compares it with the angle the
 * accent's gradient actually uses.
 */
test("the accent runs at the mark's own angle", async ({ page }) => {
	await page.goto("/")

	const { slash, accent } = await page.evaluate(() => {
		const cut = document.querySelector<SVGPolygonElement>(
			'[data-hero-mark] [data-logo-part="cut"]',
		)
		if (!cut) throw new Error("no hero mark cut")
		const svg = cut.ownerSVGElement
		const ctm = cut.getScreenCTM()
		if (!svg || !ctm) throw new Error("no screen CTM")

		// One of the slash's two long edges, which is its own direction. The short
		// edges are its end caps and are what the old figure accidentally measured.
		const at = (x: number, y: number) => {
			const point = svg.createSVGPoint()
			point.x = x
			point.y = y
			return point.matrixTransform(ctm)
		}
		const from = at(150, 638)
		const to = at(900, 300)
		const slash = (Math.atan2(-(to.y - from.y), to.x - from.x) * 180) / Math.PI

		const gradient = getComputedStyle(
			document.querySelector("[data-cut]") as Element,
		).backgroundImage
		const match = gradient.match(/(-?[\d.]+)deg/)
		if (!match) throw new Error(`no angle in gradient: ${gradient}`)

		return { slash, accent: Math.abs(Number(match[1])) }
	})

	// Half a degree, which is far tighter than the 2.3 the old figure was out by
	// and loose enough for the SVG's own rounding.
	expect(Math.abs(slash - accent)).toBeLessThan(0.5)
})

// The three beats, and the order of them. Each is asserted through its own
// animation name, so a rule deleted or renamed fails here rather than silently
// leaving a piece of the mark parked off screen.
test("the mark assembles before the accent draws", async ({ page }) => {
	await page.goto("/")

	const beats = await page.evaluate(() => {
		const read = (selector: string) => {
			const node = document.querySelector(selector)
			if (!node) throw new Error(`missing ${selector}`)
			const style = getComputedStyle(node)
			return { name: style.animationName, delay: style.animationDelay }
		}
		return {
			// letter-b is the A, letter-a is the V. See HeroMark.test.tsx.
			a: read('[data-hero-mark] [data-logo-part="letter-b"]'),
			v: read('[data-hero-mark] [data-logo-part="letter-a"]'),
			slash: read('[data-hero-mark] [data-logo-part="cut"]'),
			weave: read('[data-hero-mark-weave] [data-logo-part="cut"]'),
			accent: read("[data-cut]"),
		}
	})

	expect(beats.a.name).toBe("hero-mark-caret-down")
	expect(beats.v.name).toBe("hero-mark-caret-up")
	expect(beats.slash.name).toBe("hero-mark-slash")
	// The front copy of the slash has to travel with the back one or the weave
	// breaks for the length of the beat.
	expect(beats.weave.name).toBe("hero-mark-slash")
	expect(beats.accent.name).toBe("cut")

	const seconds = (value: string) => Number.parseFloat(value)
	// The carets start together, then the slash, then the accent.
	expect(seconds(beats.a.delay)).toBe(0)
	expect(seconds(beats.v.delay)).toBe(0)
	expect(seconds(beats.slash.delay)).toBeGreaterThan(seconds(beats.a.delay))
	expect(seconds(beats.accent.delay)).toBeGreaterThan(
		seconds(beats.slash.delay),
	)
})

// Every beat is inside the reduced-motion guard, and the resting state is the
// assembled mark. A piece left parked off screen would be content loss, not a
// motion preference.
test("the mark is assembled and still under reduced motion", async ({
	browser,
}) => {
	const context = await browser.newContext({ reducedMotion: "reduce" })
	const page = await context.newPage()
	await page.goto("/")

	for (const selector of [
		'[data-hero-mark] [data-logo-part="letter-a"]',
		'[data-hero-mark] [data-logo-part="letter-b"]',
		'[data-hero-mark] [data-logo-part="cut"]',
		'[data-hero-mark-weave] [data-logo-part="cut"]',
	]) {
		const style = await page.locator(selector).evaluate((node) => {
			const computed = getComputedStyle(node)
			return { name: computed.animationName, transform: computed.transform }
		})
		expect(style.name, selector).toBe("none")
		expect(style.transform, selector).toBe("none")
	}

	await context.close()
})
