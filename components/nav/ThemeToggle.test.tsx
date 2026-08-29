import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "./ThemeToggle"

const setTheme = vi.fn()
let resolvedTheme: string | undefined = "dark"

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme, setTheme }),
}))

describe("ThemeToggle", () => {
	afterEach(() => {
		setTheme.mockClear()
		resolvedTheme = "dark"
	})

	it("renders a disabled, fixed-size placeholder before the theme resolves", () => {
		resolvedTheme = undefined
		render(<ThemeToggle />)
		const placeholder = screen.getByRole("button", { hidden: true })
		expect(placeholder).toBeDisabled()
		expect(placeholder).toHaveAttribute("aria-hidden", "true")
	})

	it("labels the action to switch to light when currently dark", () => {
		resolvedTheme = "dark"
		render(<ThemeToggle />)
		expect(
			screen.getByRole("button", { name: "Switch to light theme" }),
		).toBeInTheDocument()
	})

	it("labels the action to switch to dark when currently light", () => {
		resolvedTheme = "light"
		render(<ThemeToggle />)
		expect(
			screen.getByRole("button", { name: "Switch to dark theme" }),
		).toBeInTheDocument()
	})

	it("toggles to the opposite theme when clicked", async () => {
		resolvedTheme = "dark"
		render(<ThemeToggle />)
		await userEvent.click(
			screen.getByRole("button", { name: "Switch to light theme" }),
		)
		expect(setTheme).toHaveBeenCalledWith("light")
	})

	it("keeps the same fixed dimensions in both the placeholder and resolved states", () => {
		resolvedTheme = undefined
		const { container: unresolved } = render(<ThemeToggle />)
		const unresolvedClasses = unresolved.querySelector("button")?.className

		resolvedTheme = "dark"
		const { container: resolved } = render(<ThemeToggle />)
		const resolvedClasses = resolved.querySelector("button")?.className

		const dimensionClass = (classes: string | undefined) =>
			classes
				?.split(" ")
				.filter((cls) => cls.startsWith("h-") || cls.startsWith("w-"))
				.sort()

		expect(dimensionClass(unresolvedClasses)).toEqual(
			dimensionClass(resolvedClasses),
		)
	})
})
