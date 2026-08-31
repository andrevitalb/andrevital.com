import { expect, test } from "./fixtures"

/*
 * Every diagonal on the site, measured against the mark itself.
 *
 * This exists because the number was wrong once, in four places at the same time.
 * "The mark's own cut" had been measured corner to corner across the slash's
 * WIDTH (0.5, 26.57deg) instead of along its long edges (0.45, 24.23deg), so the
 * nav sheet wipe, the theme swap and the hero accent were all 2.3 degrees off the
 * shape they claim to quote (docs/design.md, "The slash's real angle"). Close
 * enough to look deliberate, which is what made it survive.
 *
 * Reading the tokens back is not a check: it only proves the CSS quotes itself.
 * So the ground truth here is the rendered polygon, measured through
 * getScreenCTM, and every other diagonal is compared to that.
 */

/*
 * One of the slash's two long edges, in the mark's own 1000x1000 user space, from
 * CUT in components/logo/LogoMark.tsx. The short edges are its end caps and are
 * exactly what the old figure measured by accident.
 */
const SLASH_FROM = { x: 150, y: 638 }
const SLASH_TO = { x: 900, y: 300 }

/** Half a degree: far tighter than the 2.3 the old figure was out by, and loose
 *  enough for the SVG's own rounding and for subpixel layout. */
const TOLERANCE = 0.5

/** The rendered angle of the mark's slash, in degrees above the horizontal. */
async function slashAngle(page: import("@playwright/test").Page) {
	return page.evaluate(
		([from, to]) => {
			const cut = document.querySelector<SVGPolygonElement>(
				'[data-logo-part="cut"]',
			)
			if (!cut) throw new Error("no mark on the page")
			const svg = cut.ownerSVGElement
			const ctm = cut.getScreenCTM()
			if (!svg || !ctm) throw new Error("no screen CTM")

			const at = (x: number, y: number) => {
				const point = svg.createSVGPoint()
				point.x = x
				point.y = y
				return point.matrixTransform(ctm)
			}
			const a = at(from.x, from.y)
			const b = at(to.x, to.y)
			return (Math.atan2(-(b.y - a.y), b.x - a.x) * 180) / Math.PI
		},
		[SLASH_FROM, SLASH_TO] as const,
	)
}

/** The angle a `linear-gradient(<deg>, ...)` paints its colour stops at. A
 *  gradient's axis is <deg> clockwise from "to top", and the stop boundaries run
 *  perpendicular to that axis, so a boundary sits |deg| above the horizontal. */
function gradientStopAngle(image: string) {
	const match = image.match(/(-?[\d.]+)deg/)
	if (!match) throw new Error(`no angle in: ${image}`)
	return Math.abs(Number(match[1]))
}

test("the tokens carry the mark's real angle, not a corner diagonal", async ({
	page,
}) => {
	await page.goto("/")

	const slash = await slashAngle(page)
	const { rise, angle } = await page.evaluate(() => {
		const root = getComputedStyle(document.documentElement)
		return {
			rise: Number(root.getPropertyValue("--cut-rise").trim()),
			angle: Math.abs(
				Number(root.getPropertyValue("--cut-angle").trim().replace("deg", "")),
			),
		}
	})

	// The two tokens have to agree with the shape and with each other: --cut-rise
	// is the tangent of --cut-angle, and everything on the site derives from one
	// or the other.
	expect(Math.abs(slash - angle)).toBeLessThan(TOLERANCE)
	expect(Math.abs(slash - (Math.atan(rise) * 180) / Math.PI)).toBeLessThan(
		TOLERANCE,
	)
	// The old figure, named so a revert to it fails here rather than looking fine.
	expect(Math.abs(rise - 0.5)).toBeGreaterThan(0.02)
})

test("every accent cut on the site runs at the mark's angle", async ({
	page,
}) => {
	for (const route of ["/", "/contact", "/this-route-does-not-exist"]) {
		await page.goto(route)

		const slash = await slashAngle(page)
		const painted = await page.evaluate(() => {
			const cut = document.querySelector("[data-cut]")
			if (!cut) throw new Error("no cut")
			return getComputedStyle(cut).backgroundImage
		})

		expect(
			Math.abs(slash - gradientStopAngle(painted)),
			`accent cut on ${route}`,
		).toBeLessThan(TOLERANCE)
	}
})

test("the 404's slip seam runs at the mark's angle", async ({ page }) => {
	await page.goto("/this-route-does-not-exist")

	const slash = await slashAngle(page)
	const masks = await page.evaluate(() =>
		[...document.querySelectorAll("[data-slip-half]")].map((half) => {
			const style = getComputedStyle(half)
			return style.maskImage || style.webkitMaskImage
		}),
	)

	expect(masks).toHaveLength(2)
	for (const mask of masks) {
		expect(Math.abs(slash - gradientStopAngle(mask))).toBeLessThan(TOLERANCE)
	}
})

/*
 * The two wipes are clip-path polygons rather than gradients, so their angle is a
 * slope rather than a declared degree: --cut-drop is `100vw * --cut-rise`, and
 * both boxes are inset:0 and therefore 100vw wide, which is the assumption that
 * makes the ratio come out as the mark's own. Measuring the resolved polygon is
 * what proves the box really is that wide; on a narrower one the same declaration
 * would draw a steeper line.
 */
async function polygonSlope(
	page: import("@playwright/test").Page,
	selector: string,
) {
	return page.evaluate((target) => {
		const node = document.querySelector(target)
		if (!node) throw new Error(`no ${target}`)
		const clip = getComputedStyle(node).clipPath

		/*
		 * Chrome does not resolve the percentages here, so the computed value reads
		 * `polygon(0px 0px, 100% 0px, 100% calc(0% - 168.75px), 0px 0px)`. The one
		 * length in it is the drop, and the width it drops across is the element's
		 * own, which is the thing worth measuring: --cut-drop is 100vw * --cut-rise
		 * and only comes out at the mark's angle if the box really is 100vw wide.
		 */
		const lengths = [...clip.matchAll(/(-?[\d.]+)px/g)]
			.map((m) => Math.abs(Number(m[1])))
			.filter((value) => value > 0)
		if (lengths.length === 0) throw new Error(`no drop in: ${clip}`)

		return {
			drop: Math.max(...lengths),
			across: node.getBoundingClientRect().width,
		}
	}, selector)
}

test("the nav sheet is wiped open at the mark's angle", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 720 })
	await page.goto("/")

	const slash = await slashAngle(page)

	// Opened first, and this is not incidental: a closed <details> collapses its
	// content, so the panel's box is a fraction of the viewport and the same
	// declaration measures as a far steeper line. Measuring it closed put the
	// wipe 53 degrees out while the CSS was entirely correct.
	await page.getByText("Menu", { exact: true }).click()
	await expect(
		page
			.getByRole("navigation", { name: "Primary, mobile" })
			.getByRole("link", { name: "About" }),
	).toBeVisible()

	// Polled rather than read once, because the wipe is a --duration-sweep
	// transition and a clip-path caught mid-flight is an interpolated polygon:
	// every coordinate resolved to px, none of them the declared drop. Read at
	// the wrong moment it measured 9 degrees off a stylesheet that was correct.
	await expect
		.poll(async () => {
			const { drop, across } = await polygonSlope(
				page,
				"[data-nav-sheet-panel]",
			)
			// The box really is 100vw, which is what makes --cut-drop
			// (100vw * --cut-rise) come out at the mark's angle and not some other.
			if (Math.abs(across - 375) > 2) return Number.NaN
			return Math.abs(slash - (Math.atan(drop / across) * 180) / Math.PI)
		})
		.toBeLessThan(TOLERANCE)
})
