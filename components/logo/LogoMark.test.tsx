import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
	LOGO_ASPECT,
	LOGO_PARTS,
	LOGO_VIEW_BOX,
} from "@/components/logo/LogoMark"

/** Every x and y the three polygons touch. */
function inkBounds() {
	const xs: number[] = []
	const ys: number[] = []

	for (const { points } of LOGO_PARTS) {
		const numbers = points.split(/\s+/).map(Number)
		for (const [index, value] of numbers.entries()) {
			if (index % 2 === 0) xs.push(value)
			else ys.push(value)
		}
	}

	return {
		minX: Math.min(...xs),
		maxX: Math.max(...xs),
		minY: Math.min(...ys),
		maxY: Math.max(...ys),
	}
}

// LogoDraw strokes each polygon while drawing it, centred on the path, so the
// viewBox has to clear the ink by half the stroke or the stroke clips mid-draw.
const HALF_STROKE = 7

describe("LOGO_VIEW_BOX", () => {
	it("wraps the ink with exactly half a stroke of padding on every side", () => {
		const { minX, maxX, minY, maxY } = inkBounds()
		const [x, y, width, height] = LOGO_VIEW_BOX.split(" ").map(Number)

		expect(x).toBe(minX - HALF_STROKE)
		expect(y).toBe(minY - HALF_STROKE)
		expect(x + width).toBe(maxX + HALF_STROKE)
		expect(y + height).toBe(maxY + HALF_STROKE)
	})

	/*
	 * The reason the crop exists. The old 0 0 1000 1000 box left the ink filling
	 * 80% of the width and 59% of the height, so size-7 rendered a mark 16px tall
	 * and every size class lied about what you would see.
	 */
	it("is filled by the ink, so a size class means what it says", () => {
		const { minX, maxX, minY, maxY } = inkBounds()
		const [, , width, height] = LOGO_VIEW_BOX.split(" ").map(Number)

		expect((maxX - minX) / width).toBeGreaterThan(0.97)
		expect((maxY - minY) / height).toBeGreaterThan(0.97)
	})

	it("exports an aspect ratio matching the box", () => {
		const [, , width, height] = LOGO_VIEW_BOX.split(" ").map(Number)
		expect(LOGO_ASPECT).toBe(`${width}/${height}`)
	})

	/*
	 * The class every consumer uses is `aspect-logo`, a Tailwind theme token, so
	 * the ratio lives in CSS as well as here. It has to be a real token rather
	 * than `aspect-[${...}]`: Tailwind only generates classes it finds as literal
	 * strings, so an interpolated one is never emitted and the box collapses.
	 *
	 * Same shape of guard as app/icon.test.ts, which ties the favicon's hex values
	 * back to the tokens for the same reason.
	 */
	it("agrees with the --aspect-logo token in app/globals.css", () => {
		const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf-8")
		const declared = css.match(/--aspect-logo:\s*([^;]+);/)?.[1]

		expect(declared, "--aspect-logo missing from app/globals.css").toBeDefined()

		const [, , width, height] = LOGO_VIEW_BOX.split(" ").map(Number)
		const [cssWidth, cssHeight] = (declared as string)
			.split("/")
			.map((part) => Number(part.trim()))

		expect(cssWidth / cssHeight).toBeCloseTo(width / height, 6)
	})

	it("is landscape, which is the mark's real shape", () => {
		const [, , width, height] = LOGO_VIEW_BOX.split(" ").map(Number)
		expect(width).toBeGreaterThan(height)
	})
})
