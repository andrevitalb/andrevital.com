import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { HERO_MARK_FILL, HeroMark } from "@/components/logo/HeroMark"

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

	it("is decorative, so neither layer is named", () => {
		const { container } = render(<HeroMark />)

		for (const layer of container.querySelectorAll("svg")) {
			expect(layer).toHaveAttribute("aria-hidden", "true")
			expect(layer.querySelector("title")).toBeNull()
		}
	})
})
