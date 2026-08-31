import { render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Reveal } from "@/components/motion/Reveal"

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

	it("carries the hook the stylesheet animates", () => {
		render(<Reveal data-testid="item">Hello</Reveal>)
		expect(screen.getByTestId("item")).toHaveAttribute("data-reveal")
	})

	/*
	 * The regression that matters. The first version of this component used
	 * motion's `initial`, which serialises into the server HTML as
	 * `style="opacity:0"`, so a visitor whose bundle never arrived got content
	 * that was invisible forever. That breaks the site's no-JS contract.
	 */
	it("ships no inline opacity or transform in the server HTML", () => {
		const html = renderToStaticMarkup(<Reveal>Important content</Reveal>)
		expect(html).toContain("Important content")
		expect(html).not.toContain("opacity")
		expect(html).not.toContain("transform")
	})
})
