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

/**
 * The angle a `linear-gradient(<deg>, ...)` paints its colour stops at, SIGNED,
 * in degrees above the horizontal to match `slashAngle`.
 *
 * A gradient's axis is <deg> clockwise from "to top" and the stop boundaries run
 * perpendicular to it, so a boundary sits at -<deg> above the horizontal: the
 * mark's -24.23deg paints a boundary rising to the right at +24.23.
 *
 * The sign is the whole point, and taking Math.abs here (as this did at first)
 * made the guard blind to the one edit it most needs to catch. Flipping
 * --cut-angle to +24.23deg mirrors the diagonal so it falls to the right instead
 * of rising, on every [data-cut] on the site and both mask seams on the 404, and
 * the magnitude never changes. Three tests passed against a mirrored mark.
 */
function gradientStopAngle(image: string) {
	const match = image.match(/(-?[\d.]+)deg/)
	if (!match) throw new Error(`no angle in: ${image}`)
	return -Number(match[1])
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
			// Signed, not Math.abs: the mark rises to the right, and a mirrored
			// diagonal has the same magnitude.
			angle: Number(
				root.getPropertyValue("--cut-angle").trim().replace("deg", ""),
			),
		}
	})

	// The two tokens have to agree with the shape and with each other: --cut-rise
	// is the tangent of --cut-angle, and everything on the site derives from one
	// or the other. A gradient's stop boundary sits at -<deg> above the
	// horizontal, so the token's own sign is negative where the mark rises.
	expect(Math.abs(slash - -angle)).toBeLessThan(TOLERANCE)
	expect(Math.abs(slash - (Math.atan(rise) * 180) / Math.PI)).toBeLessThan(
		TOLERANCE,
	)
	// The mark rises to the right. Named, so a mirrored token fails here.
	expect(slash).toBeGreaterThan(0)
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
 * slope rather than a declared degree: --cut-drop is the page's width times
 * --cut-rise, and the ratio only comes out as the mark's own if the box being
 * wiped really is that wide. Measuring the resolved polygon is what proves it; on
 * a narrower box the same declaration draws a steeper line.
 *
 * The nav sheet's panel is inset:0 and lives below sm, so for it the page is the
 * viewport. The route wipe is a box inside main, and from lg up that is the
 * viewport less the sidebar (--shell-inset), which is why the drop is taken
 * across `100vw - var(--shell-inset)` rather than across 100vw.
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

	/*
	 * The drop has to be on the LEFT edge, which is what makes the wipe's own edge
	 * rise to the right rather than fall. Moving it to the right-hand vertex keeps
	 * the slope identical and mirrors the direction, so measuring the magnitude
	 * cannot see it: the settled polygon's FINAL point is asserted, not merely the
	 * presence of a drop somewhere in the string.
	 */
	await expect
		.poll(async () =>
			page
				.locator("[data-nav-sheet-panel]")
				.evaluate((node) => getComputedStyle(node).clipPath),
		)
		.toMatch(/0px calc\(100% \+ [\d.]+px\)\)$/)

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
			/*
			 * The box really is 100vw, which is what makes --cut-drop
			 * (100vw * --cut-rise) come out at the mark's angle and not some other.
			 *
			 * This is a real limit of the derivation, not just a test detail. On a
			 * platform with classic (space-taking) scrollbars the panel is 100vw
			 * minus the scrollbar while --cut-drop is still a share of the full
			 * 100vw, so at 375px with a 15px bar the wipe runs atan(168.75/360) =
			 * 25.1deg against the mark's 24.23. Headless Chromium and macOS both
			 * use overlay scrollbars, so it does not bite here; this assertion is
			 * what makes it fail loudly rather than silently drift if it ever does.
			 */
			if (Math.abs(across - 375) > 2) return Number.NaN
			return Math.abs(slash - (Math.atan(drop / across) * 180) / Math.PI)
		})
		.toBeLessThan(TOLERANCE)
})

/*
 * The route wipe, at the width where it stopped being the viewport's.
 *
 * U4b put a 13rem sidebar in front of the page above lg, so the box this wipe
 * runs in is no longer 100vw. Left as `100vw * --cut-rise` the drop was measured
 * across 208px the page does not have: 27.75deg at 1440 and 29.45deg at 1024,
 * against the mark's 24.23. That is the same defect the whole of this file exists
 * for, and nothing else here would have caught it, because the only wipe measured
 * before this was the nav sheet's, at 375.
 *
 * The drop is read off a probe rather than off the animation: the wipe is a 420ms
 * animation on a template that remounts per navigation, so catching its `from`
 * keyframe is a race, while --cut-drop is a static declaration and the polygon it
 * resolves to is the thing that was wrong.
 */
test("each cut drop is measured across its own box", async ({ page }) => {
	for (const width of [1440, 1024, 900]) {
		await page.setViewportSize({ width, height: 800 })
		await page.goto("/")

		const slash = await slashAngle(page)

		/*
		 * Both tokens, because there are two boxes and the pair is exactly what went
		 * wrong: U4b gave the single token the page's width, and the theme sweep,
		 * whose box is the root snapshot and therefore the whole window, went 3.2
		 * degrees off with nothing to catch it. A view-transition pseudo-element is
		 * not in the DOM, so this is the only place that error can be caught.
		 */
		for (const [token, box] of [
			["--cut-drop", "viewport"],
			["--cut-drop-page", "page"],
		] as const) {
			const { drop, across } = await readDrop(page, token, box)
			const angle = (Math.atan(drop / across) * 180) / Math.PI
			expect(
				Math.abs(slash - angle),
				`${token} across the ${box} at ${width}px`,
			).toBeLessThan(TOLERANCE)
		}
	}
})

/*
 * The drop is read off a probe rather than off the animation: the wipe is a 420ms
 * animation on a template that remounts per navigation, so catching its `from`
 * keyframe is a race, while the token is a static declaration and the polygon it
 * resolves to is the thing that was wrong.
 */
async function readDrop(
	page: import("@playwright/test").Page,
	token: string,
	box: "viewport" | "page",
) {
	return page.evaluate(
		([property, which]) => {
			const route = document.querySelector("[data-route-enter]")
			if (!route) throw new Error("no route box")

			const probe = document.createElement("div")
			probe.style.position = "absolute"
			probe.style.width = "10px"
			probe.style.height = "10px"
			probe.style.clipPath = `polygon(0 0, 100% 0, 100% calc(0% - var(${property})), 0 0)`
			route.append(probe)

			const clip = getComputedStyle(probe).clipPath
			probe.remove()

			// The same read as polygonSlope above: the polygon's own zeroes are
			// px-suffixed too, so it is the largest length in the string that is the
			// drop, not the first one.
			const lengths = [...clip.matchAll(/(-?[\d.]+)px/g)]
				.map((match) => Math.abs(Number(match[1])))
				.filter((value) => value > 0)
			if (lengths.length === 0) throw new Error(`no drop in: ${clip}`)

			return {
				drop: Math.max(...lengths),
				across:
					which === "viewport"
						? window.innerWidth
						: route.getBoundingClientRect().width,
			}
		},
		[token, box] as const,
	)
}
