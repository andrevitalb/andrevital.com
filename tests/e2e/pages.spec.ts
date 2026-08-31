import { expect, test } from "./fixtures"

/*
 * Unit 3's guards. Audit finding 1 was that all seven pages were one template
 * with different strings, so each page's composition is now the thing worth
 * protecting, and each of these fails when its page's own idea is undone rather
 * than when any pixel moves.
 */

// The career was six rows each closed by its own full-width hairline, which is
// what made fourteen years read as a table. One continuous line replaces them,
// so the guard is that the rules are gone and the line is there.
test("About's career is one line, not six rules", async ({ page }) => {
	await page.goto("/about")

	const rows = page.locator("main li").filter({ has: page.locator("h3") })
	await expect(rows.first()).toBeVisible()

	const borders = await rows.evaluateAll((items) =>
		items.map((item) => getComputedStyle(item).borderBottomWidth),
	)
	expect(borders.every((width) => width === "0px")).toBe(true)

	// One rail for the whole page, not one per list: the masthead, the facts and
	// the career all hang off the same hairline, so a second [data-spine] here
	// means the career grew its own rail again, offset from everything above it.
	await expect(page.locator("[data-spine]")).toHaveCount(1)

	// The spine itself is a pseudo-element, so it is measured through its own
	// computed style rather than located.
	const spine = await page.locator("[data-spine]").evaluate((node) => {
		const style = getComputedStyle(node, "::before")
		return { content: style.content, width: style.width }
	})
	expect(spine.content).not.toBe("none")
	expect(spine.width).toBe("1px")
})

// The composition's entire claim: with one published post, the entries carry the
// page and the heading does not. This is what catches someone later "fixing" the
// small h1 back to display scale and quietly restoring the template.
test("Writing's titles outrank its heading", async ({ page }) => {
	await page.goto("/writing")
	await page.evaluate(() => document.fonts.ready)

	const size = (locator: ReturnType<typeof page.locator>) =>
		locator.evaluate((node) =>
			Number.parseFloat(getComputedStyle(node).fontSize),
		)

	const heading = await size(page.getByRole("heading", { level: 1 }))
	// The title carries its own hook. Reaching for it positionally measured the
	// mono column's parent, which is the anchor, so the guard read body text and
	// passed with the titles set at --text-small.
	const title = await size(page.locator("[data-post-title]").first())

	expect(title).toBeGreaterThan(heading)
	// And by a real margin, not by a rounding error: the claim is that the
	// entries carry the page.
	expect(title).toBeGreaterThan(heading * 2)
})

// The same fold arithmetic Home's facts band is held to, and it fails the same
// way: a wrong --nav-height misses by the height of the bar rather than by a
// few pixels.
test("Contact's furniture lands on the fold", async ({ page }) => {
	for (const viewport of [
		{ width: 1440, height: 900 },
		{ width: 1280, height: 800 },
		{ width: 320, height: 720 },
	]) {
		await page.setViewportSize(viewport)
		await page.goto("/contact")
		await page.evaluate(() => document.fonts.ready)

		const bottom = await page
			.locator("main section > div")
			.last()
			.evaluate((node) => node.getBoundingClientRect().bottom)

		// The location comes from a site.yaml fact matched by its label, which
		// nothing in the schema pins, so a rename would drop it silently. This is
		// the guard for that.
		await expect(page.getByText("Aguascalientes, MX")).toBeVisible()

		const where = `contact furniture at ${viewport.width}x${viewport.height}`
		expect(bottom, where).toBeLessThanOrEqual(viewport.height + 6)
		expect(bottom, where).toBeGreaterThan(viewport.height - 12)
	}
})

test("Contact's address fits its own box at every width", async ({ page }) => {
	for (const width of [320, 375, 768, 1440]) {
		await page.setViewportSize({ width, height: 800 })
		await page.goto("/contact")
		await page.evaluate(() => document.fonts.ready)

		// Not the document's scroll width: the fold clips, so an address too wide
		// for the page is hidden rather than caught by the site-wide no-horizontal
		// -scroll check. This measures the element against its own container.
		const fits = await page
			.locator('a[href^="mailto:"]')
			.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)

		expect(fits, `address at ${width}px`).toBe(true)
	}
})

// The cut has to pass BEHIND the address. Over it, the accent is a strikethrough
// on the mailbox, which is the one thing this page must not say.
test("Contact's cut passes under the address", async ({ page }) => {
	await page.goto("/contact")

	const stacking = await page.evaluate(() => {
		const cut = document.querySelector("[data-cut]")
		const address = document.querySelector('a[href^="mailto:"]')
		if (!cut || !address) throw new Error("no cut or no address")
		return {
			cut: getComputedStyle(cut).zIndex,
			address: getComputedStyle(address).zIndex,
		}
	})

	expect(Number(stacking.cut)).toBeLessThan(Number(stacking.address))
})

// The two halves slipped along the cut, not across it. The ratio of their
// vertical offset to their horizontal one is --cut-rise, which is the mark's own
// geometry; a corner diagonal would put it at 0.5 and fail here. That is the
// U2b lesson with a guard on it.
test("the 404's halves slipped along the mark's own line", async ({ page }) => {
	await page.goto("/this-route-does-not-exist")
	await page.evaluate(() => document.fonts.ready)

	const { above, below, rise } = await page.evaluate(() => {
		const box = (selector: string) => {
			const node = document.querySelector(selector)
			if (!node) throw new Error(`no ${selector}`)
			return node.getBoundingClientRect()
		}
		return {
			above: box('[data-slip-half="above"]'),
			below: box('[data-slip-half="below"]'),
			rise: Number(
				getComputedStyle(document.documentElement)
					.getPropertyValue("--cut-rise")
					.trim(),
			),
		}
	})

	const dx = above.left - below.left
	const dy = above.top - below.top

	// Slipped at all, and to the right along the line the cut travels.
	expect(dx).toBeGreaterThan(4)
	// Up as it goes right, which is the cut's direction.
	expect(dy).toBeLessThan(0)
	// 0.02, not 0.05. The error this exists to catch is a corner diagonal at 0.5
	// against the stroke's own 0.45, so a 0.05 tolerance is exactly the size of
	// the mistake and let it through by a floating-point hair.
	expect(Math.abs(-dy / dx - rise)).toBeLessThan(0.02)
})

// The link string that was pasted eleven times is gone, and the hierarchy that
// replaced it is real: the primary variant is the accent's only appearance on
// three of these four pages.
test("each page's primary link carries the accent", async ({ page }) => {
	for (const [route, selector] of [
		["/about", 'a[href="/cv.pdf"]'],
		["/contact", 'a[href^="mailto:"]'],
		["/this-route-does-not-exist", 'main a[href="/"]'],
	] as const) {
		await page.goto(route)

		const color = await page
			.locator(selector)
			.evaluate((node) => getComputedStyle(node).textDecorationColor)

		const accent = await page.evaluate(() =>
			getComputedStyle(document.documentElement)
				.getPropertyValue("--accent")
				.trim(),
		)

		expect(color, route).not.toBe("rgba(0, 0, 0, 0)")
		// Compared through a canvas rather than by string: the token is a hex and
		// the computed value is rgb().
		const normalised = await page.evaluate((hex) => {
			const canvas = document.createElement("canvas").getContext("2d")
			if (!canvas) throw new Error("no 2d context")
			canvas.fillStyle = hex
			return canvas.fillStyle
		}, accent)
		const asHex = await page.evaluate((rgb) => {
			const canvas = document.createElement("canvas").getContext("2d")
			if (!canvas) throw new Error("no 2d context")
			canvas.fillStyle = rgb
			return canvas.fillStyle
		}, color)

		expect(asHex, route).toBe(normalised)
	}
})
