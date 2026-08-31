import { render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { NavSheet } from "@/components/nav/NavSheet"

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}))

const LINKS = [
	{ href: "/writing", label: "Writing" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
]

function sheet(container: HTMLElement) {
	const node = container.querySelector("details[data-nav-sheet]")
	if (!node) throw new Error("no sheet rendered")
	return node as HTMLDetailsElement
}

describe("NavSheet", () => {
	it("starts closed", () => {
		const { container } = render(<NavSheet links={LINKS} />)
		expect(sheet(container).open).toBe(false)
	})

	it("names the action in words, not an icon", () => {
		const { container } = render(<NavSheet links={LINKS} />)
		const summary = container.querySelector("summary")
		expect(summary?.textContent).toBe("MenuClose")
	})

	it("renders every link with its href", () => {
		render(<NavSheet links={LINKS} />)
		for (const link of LINKS) {
			expect(screen.getByRole("link", { name: link.label })).toHaveAttribute(
				"href",
				link.href,
			)
		}
	})

	/*
	 * Load-bearing, not cosmetic. A clip-path clips its own descendants, so the
	 * line that draws along the panel's leading edge would be cut off by that very
	 * edge if it lived inside the panel. Moving it back in makes the sweep silently
	 * strokeless, which no visual test on this page would catch.
	 */
	it("draws the leading edge outside the panel, not within it", () => {
		const { container } = render(<NavSheet links={LINKS} />)
		const edge = container.querySelector("[data-nav-sheet-edge]")
		expect(edge).not.toBeNull()
		expect(edge?.closest("[data-nav-sheet-panel]")).toBeNull()
		expect(edge?.parentElement).toBe(sheet(container))
	})

	// Below sm the bar has no toggle, so this is the only way to change theme.
	it("carries the theme toggle, which the bar drops at this breakpoint", () => {
		render(<NavSheet links={LINKS} />)
		expect(
			screen.getByRole("button", { name: /switch to \w+ theme/i }),
		).toBeInTheDocument()
	})

	it("is hidden from the sm breakpoint up, where the text row takes over", () => {
		const { container } = render(<NavSheet links={LINKS} />)
		expect(sheet(container).className).toContain("sm:hidden")
	})

	/*
	 * The reason this is a <details> and not a <dialog>. It was a dialog first, and
	 * a closed dialog is display:none that only showModal() can open, so with
	 * JavaScript off the whole mobile nav was unreachable. A disclosure opens on
	 * its own, so the server HTML has to be the complete, working control.
	 */
	it("ships a working disclosure in the server HTML, with no client component", () => {
		const html = renderToStaticMarkup(<NavSheet links={LINKS} />)

		expect(html).toContain("<details")
		expect(html).toContain("<summary")
		for (const link of LINKS) {
			expect(html).toContain(`href="${link.href}"`)
		}
		// No `open`, so it starts shut, and nothing but the summary is needed to
		// change that.
		expect(html).not.toContain("<details open")
	})
})
