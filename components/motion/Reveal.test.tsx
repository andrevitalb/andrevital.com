import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Reveal } from "@/components/motion/Reveal"

const reducedMotion = vi.hoisted(() => ({ current: false }))

vi.mock("motion/react", async () => {
	const actual =
		await vi.importActual<typeof import("motion/react")>("motion/react")
	return { ...actual, useReducedMotion: () => reducedMotion.current }
})

afterEach(() => {
	reducedMotion.current = false
})

describe("Reveal", () => {
	it("renders its children", () => {
		render(<Reveal>Hello</Reveal>)
		expect(screen.getByText("Hello")).toBeInTheDocument()
	})

	it("renders the requested element", () => {
		render(
			<Reveal as="li" data-testid="item">
				Hello
			</Reveal>,
		)
		expect(screen.getByTestId("item").tagName).toBe("LI")
	})

	it("merges a caller className", () => {
		render(
			<Reveal className="mt-12" data-testid="item">
				Hello
			</Reveal>,
		)
		expect(screen.getByTestId("item")).toHaveClass("mt-12")
	})

	// The one that matters: a reveal that withholds content when motion is
	// reduced is a content-loss bug, not a motion preference.
	it("still renders its children under reduced motion", () => {
		reducedMotion.current = true
		render(<Reveal>Hello</Reveal>)
		expect(screen.getByText("Hello")).toBeInTheDocument()
	})

	it("renders a plain element under reduced motion, with no inline opacity", () => {
		reducedMotion.current = true
		render(<Reveal data-testid="item">Hello</Reveal>)
		expect(screen.getByTestId("item").style.opacity).toBe("")
	})
})
