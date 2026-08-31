import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { DrawRule } from "@/components/motion/DrawRule"

const reducedMotion = vi.hoisted(() => ({ current: false }))

vi.mock("motion/react", async () => {
	const actual =
		await vi.importActual<typeof import("motion/react")>("motion/react")
	return { ...actual, useReducedMotion: () => reducedMotion.current }
})

afterEach(() => {
	reducedMotion.current = false
})

describe("DrawRule", () => {
	it("renders a separator", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toBeInTheDocument()
	})

	it("keeps the site's hairline styling", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toHaveClass("border-line")
	})

	it("merges a caller className", () => {
		render(<DrawRule className="my-12" />)
		expect(screen.getByRole("separator")).toHaveClass("my-12")
	})

	// The stroke reads as drawn, so it has to start from one end rather than
	// growing out of the middle.
	it("draws from the left", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toHaveStyle({
			transformOrigin: "left",
		})
	})

	it("is not scaled away under reduced motion", () => {
		reducedMotion.current = true
		render(<DrawRule />)
		expect(screen.getByRole("separator").style.transform).not.toContain(
			"scaleX(0)",
		)
	})
})
