import { render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { DrawRule } from "@/components/motion/DrawRule"

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

	it("carries the hook the stylesheet animates", () => {
		render(<DrawRule />)
		expect(screen.getByRole("separator")).toHaveAttribute("data-draw-rule")
	})

	// Same contract as Reveal: a scaleX(0) baked into the server HTML would leave
	// the rule invisible without JavaScript rather than plain.
	it("ships no inline transform in the server HTML", () => {
		const html = renderToStaticMarkup(<DrawRule />)
		expect(html).not.toContain("transform")
	})
})
