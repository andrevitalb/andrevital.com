import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

const setTheme = vi.fn()
const resolvedTheme = { current: "dark" }

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: resolvedTheme.current, setTheme }),
}))

beforeEach(() => {
	setTheme.mockClear()
	resolvedTheme.current = "dark"
})

describe("ThemeToggle", () => {
	// The old button's visible text was the name of the target theme, which read
	// equally well as a statement of the current one. The accessible name has to
	// name the action instead.
	it("names the action, not the current state", async () => {
		render(<ThemeToggle />)
		expect(
			await screen.findByRole("button", { name: "Switch to light theme" }),
		).toBeInTheDocument()
	})

	it("names the other action from the light theme", async () => {
		resolvedTheme.current = "light"
		render(<ThemeToggle />)
		expect(
			await screen.findByRole("button", { name: "Switch to dark theme" }),
		).toBeInTheDocument()
	})

	it("renders no visible text once mounted", async () => {
		render(<ThemeToggle />)
		const button = await screen.findByRole("button")
		expect(button.textContent).toBe("")
	})

	it("switches to the theme its label names", async () => {
		render(<ThemeToggle />)
		await userEvent.click(await screen.findByRole("button"))
		expect(setTheme).toHaveBeenCalledWith("light")
	})
})
