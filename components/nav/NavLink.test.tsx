import { render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import { NavLink } from "./NavLink"

vi.mock("next/navigation", () => ({
	usePathname: vi.fn(),
}))

describe("NavLink", () => {
	it("marks the current route with aria-current=page", () => {
		vi.mocked(usePathname).mockReturnValue("/contact")
		render(<NavLink href="/contact">Contact</NavLink>)
		expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page")
	})

	it("does not mark a non-matching route as current", () => {
		vi.mocked(usePathname).mockReturnValue("/")
		render(<NavLink href="/contact">Contact</NavLink>)
		expect(screen.getByRole("link")).not.toHaveAttribute("aria-current")
	})

	// U4b: an exact match left every child route with no lit item at all, and Unit
	// 4 ships four of them.
	it("marks a section as current from inside one of its entries", () => {
		vi.mocked(usePathname).mockReturnValue("/work/an-entry")
		render(<NavLink href="/work">Work</NavLink>)
		expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page")
	})

	// The prefix rule has to stop at a path segment, or /workshop lights Work.
	it("does not mark a section whose href is only a string prefix", () => {
		vi.mocked(usePathname).mockReturnValue("/workshop")
		render(<NavLink href="/work">Work</NavLink>)
		expect(screen.getByRole("link")).not.toHaveAttribute("aria-current")
	})

	// Home is the one exact match: as a prefix it is every route on the site.
	it("keeps home exact", () => {
		vi.mocked(usePathname).mockReturnValue("/about")
		render(<NavLink href="/">Home</NavLink>)
		expect(screen.getByRole("link")).not.toHaveAttribute("aria-current")
	})

	it("sets the sidebar variant in mono, and the bar variant in the body face", () => {
		vi.mocked(usePathname).mockReturnValue("/")
		const { container } = render(
			<NavLink href="/about" variant="sidebar">
				About
			</NavLink>,
		)
		expect(container.firstElementChild?.className).toContain("font-mono")

		const bar = render(<NavLink href="/about">About</NavLink>)
		expect(bar.container.firstElementChild?.className).not.toContain(
			"font-mono",
		)
	})
})
