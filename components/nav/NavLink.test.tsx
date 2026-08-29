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
})
