import { expect, introMode, test } from "./fixtures"

/*
 * U4b's guards. The shell is three navigations across two breakpoints now: the
 * sidebar from lg up, the bar below it, the sheet below sm. Everything here
 * guards the seams between them, which is where this unit can break something
 * later without anything else noticing.
 */

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 375, height: 720 }

test.describe("the mark docks into the shell that is on screen", () => {
	test.use({ intro: "first" })

	/*
	 * The one this unit exists to prevent. Both marks are mounted at every
	 * viewport, because the shells are swapped with a media query and display:none
	 * unmounts nothing, so two nodes would share one layoutId: motion resolves the
	 * dock against the first, which above lg is the hidden bar. Measured on the
	 * spike, the sidebar's slot held at 38x28 and painted nothing, with a clean
	 * console and no failing test anywhere in this suite.
	 */
	test("at desktop it lands in the sidebar, painted and the right size", async ({
		page,
	}) => {
		await page.setViewportSize(DESKTOP)
		await page.goto("/", { waitUntil: "domcontentloaded" })

		await expect.poll(() => introMode(page), { timeout: 5000 }).toBe("done")

		const mark = page.locator("[data-sidebar] #site-logo")
		await expect(mark).toBeVisible()

		// 1.75rem of docked height (docs/design.md) and the landscape crop U1b cut,
		// so an empty slot or a letterboxed square both fail here. Polled, because
		// `done` is set when the overlay hands over and the dock itself is a 500ms
		// layout animation: read once, this measures the mark mid-flight from 96px.
		await expect
			.poll(async () => (await mark.boundingBox())?.height ?? 0)
			.toBeLessThan(32)

		const box = await mark.boundingBox()
		if (!box) throw new Error("the docked mark is not laid out")
		expect(box.height).toBeGreaterThan(24)
		expect(box.width / box.height).toBeGreaterThan(1.2)

		// And the bar's copy is not claiming to be it.
		await expect(page.locator("#site-logo")).toHaveCount(1)
	})

	test("at mobile it lands in the bar", async ({ page }) => {
		await page.setViewportSize(MOBILE)
		await page.goto("/", { waitUntil: "domcontentloaded" })

		await expect.poll(() => introMode(page), { timeout: 5000 }).toBe("done")

		await expect(page.locator("[data-nav-bar] #site-logo")).toBeVisible()
		await expect(page.locator("#site-logo")).toHaveCount(1)
	})
})

/*
 * One navigation exposed per width, and the right one. All three shells are in
 * the DOM at every viewport, so this fails the moment a change leaves two of them
 * on screen at once: two landmarks, and two lit links for one page.
 *
 * At 320 the answer is none until the sheet is opened, which is not new and not a
 * gap: the bar's text row was already hidden below sm, and "Menu" is the control
 * that exposes the links there.
 */
test("one navigation is exposed per width, and it is the right one", async ({
	page,
}) => {
	for (const width of [768, 1024, 1440]) {
		await page.setViewportSize({ width, height: 800 })
		await page.goto("/")

		const navigation = page.getByRole("navigation", { name: "Primary" })
		await expect(navigation, `Primary at ${width}px`).toHaveCount(1)

		// Which one, not just how many: a bar that survived above lg would pass a
		// count of one while the sidebar sat hidden beside it.
		const inSidebar = await navigation.evaluate(
			(node) => node.closest("[data-sidebar]") !== null,
		)
		expect(inSidebar, `Primary belongs to the sidebar at ${width}px`).toBe(
			width >= 1024,
		)
	}

	await page.setViewportSize({ width: 320, height: 800 })
	await page.goto("/")
	await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(0)
	await expect(
		page.getByRole("navigation", { name: "Primary, mobile" }),
	).toBeHidden()

	await page.getByText("Menu", { exact: true }).click()
	await expect(
		page.getByRole("navigation", { name: "Primary, mobile" }),
	).toBeVisible()
})

// 1024 is the width with the least room for the page: the sidebar has just taken
// its column and the shell has not gained any width back yet.
test("no page scrolls sideways at the width the sidebar arrives", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1024, height: 800 })

	for (const route of ["/", "/about", "/writing", "/contact"]) {
		await page.goto(route)
		await page.evaluate(() => document.fonts.ready)

		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		)
		expect(overflow, `${route} at 1024px`).toBeLessThanOrEqual(0)
	}
})

/*
 * The skip link left Nav in U4b, because the bar is no longer the first thing in
 * the document: above lg the sidebar is. It has to be first at both shells, and
 * nothing else asserts that now.
 */
test("the skip link is the first thing a keyboard reaches, at both shells", async ({
	page,
}) => {
	for (const viewport of [DESKTOP, MOBILE]) {
		await page.setViewportSize(viewport)
		await page.goto("/")
		await page.keyboard.press("Tab")

		const focused = await page.evaluate(() => ({
			href: document.activeElement?.getAttribute("href"),
			text: document.activeElement?.textContent,
		}))
		expect(focused.href, `first tab stop at ${viewport.width}px`).toBe("#main")
		expect(focused.text).toBe("Skip to content")
	}
})

/*
 * The sidebar's own order, after the U4b design pass moved the theme toggle out of
 * the masthead and into the foot. Tab order follows the DOM, so this is also the
 * reading order of the column: identity, then navigation, then furniture.
 */
test("the sidebar tabs identity, then links, then the toggle", async ({
	page,
}) => {
	await page.setViewportSize(DESKTOP)
	await page.goto("/")

	const reached: string[] = []
	for (let i = 0; i < 10; i++) {
		await page.keyboard.press("Tab")
		const label = await page.evaluate(() => {
			const node = document.activeElement
			if (!node) return null
			if (!node.closest("[data-sidebar]")) return null
			return node.getAttribute("aria-label") ?? node.textContent?.trim() ?? ""
		})
		if (label !== null) reached.push(label)
	}

	// This build has every section on, which is also the widest the column gets.
	expect(reached[0]).toMatch(/home/i)
	expect(reached.slice(1, -1)).toEqual([
		"Work",
		"Craft",
		"Writing",
		"About",
		"Contact",
	])
	expect(reached.at(-1)).toMatch(/switch to/i)
})

// The footer is gone as of U4b. Its copyright moved into the sidebar and the
// sheet, and this is what fails if a page or a layout brings one back.
test("no page renders a footer, and the copyright is in the shell", async ({
	page,
}) => {
	await page.setViewportSize(DESKTOP)

	for (const route of ["/", "/about", "/contact"]) {
		await page.goto(route)
		await expect(page.locator("footer"), route).toHaveCount(0)
	}

	// Scoped to each shell. Both bylines are in the DOM at every viewport, the way
	// all three navigations are, so an unscoped selector matches twice.
	const year = new Date().getFullYear()
	await expect(
		page.locator("[data-sidebar]").getByText(`AV @ ${year}`),
	).toBeVisible()

	await page.setViewportSize(MOBILE)
	await page.goto("/")
	await page.getByText("Menu", { exact: true }).click()
	await expect(
		page.locator("details[data-nav-sheet]").getByText(`AV @ ${year}`),
	).toBeVisible()

	// And between the two shells that have a foot, the site carries no copyright
	// at all: the bar is a top bar. That is the shape of the change rather than an
	// oversight, asserted so it stays a decision on the record and so that putting
	// one back has to be deliberate.
	await page.setViewportSize({ width: 800, height: 800 })
	await page.goto("/")
	await expect(
		page.locator("[data-sidebar]").getByText(`AV @ ${year}`),
	).toBeHidden()
	await expect(
		page.locator("details[data-nav-sheet]").getByText(`AV @ ${year}`),
	).toBeHidden()
})
