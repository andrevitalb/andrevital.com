import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { HERO_MARK_FILL, HeroMark } from "@/components/logo/HeroMark"
import { LOGO_PARTS } from "@/components/logo/LogoMark"

describe("HeroMark", () => {
	it("never fills with the page background", () => {
		// The mark's one standing colour invariant. A fill equal to --color-bg makes
		// the shape vanish into the page in one theme and not the other.
		expect(HERO_MARK_FILL).not.toBe("var(--color-bg)")
	})

	it("draws the whole mark behind and its cut alone in front", () => {
		const { container } = render(<HeroMark />)

		const back = container.querySelector("[data-hero-mark]")
		const front = container.querySelector("[data-hero-mark-weave]")

		expect(back?.querySelectorAll("polygon")).toHaveLength(3)
		// The front layer is the weave, so it is the cut and nothing else.
		expect(front?.querySelectorAll("polygon")).toHaveLength(1)
		expect(
			front?.querySelector("polygon")?.getAttribute("data-logo-part"),
		).toBe("cut")
	})

	/*
	 * The animation in app/globals.css slides letter-b down and letter-a up, which
	 * is only correct because the names are inverted from the letters: letter-a
	 * draws the V and letter-b draws the A. This is the assertion that stops a
	 * future edit to the polygons silently reversing the assembly.
	 */
	it("draws the A as letter-b and the V as letter-a", () => {
		const apex = (points: string) => {
			const numbers = points.split(/\s+/).map(Number)
			const ys = numbers.filter((_, index) => index % 2 === 1)
			const top = Math.min(...ys)
			const bottom = Math.max(...ys)
			// A chevron's apex is whichever extreme is a lone point: the other
			// extreme is the pair of arm ends, which share a y.
			const isLone = (value: number) =>
				ys.filter((y) => y === value).length === 1
			if (isLone(top) && !isLone(bottom)) return "up"
			if (isLone(bottom) && !isLone(top)) return "down"
			// Both lone: the apex is the extreme whose neighbours are on one side,
			// which for these shapes is the one furthest from the arms' mean.
			const mean = ys.reduce((sum, y) => sum + y, 0) / ys.length
			return mean - top > bottom - mean ? "up" : "down"
		}

		const part = (name: string) =>
			LOGO_PARTS.find((logoPart) => logoPart.part === name)?.points ?? ""

		// letter-b is the A: apex up, the opening caret of `</>` rotated 90 degrees.
		expect(apex(part("letter-b"))).toBe("up")
		// letter-a is the V: apex down, the closing caret.
		expect(apex(part("letter-a"))).toBe("down")
	})

	it("is decorative, so neither layer is named", () => {
		const { container } = render(<HeroMark />)

		for (const layer of container.querySelectorAll("svg")) {
			expect(layer).toHaveAttribute("aria-hidden", "true")
			expect(layer.querySelector("title")).toBeNull()
		}
	})
})
