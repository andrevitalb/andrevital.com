import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

const setTheme = vi.fn()
const resolvedTheme = { current: "dark" }

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: resolvedTheme.current, setTheme }),
}))

// lib.dom types startViewTransition as always present. jsdom does not implement
// it, and a browser without it is the case the toggle has to fall back for, so
// these tests have to be able to put it there and take it away again.
function setViewTransitions(implementation: unknown) {
	Object.assign(document, { startViewTransition: implementation })
}

beforeEach(() => {
	setTheme.mockClear()
	resolvedTheme.current = "dark"
	setViewTransitions(undefined)
	// jsdom's matchMedia is not implemented; the toggle asks it about motion.
	window.matchMedia = vi.fn().mockReturnValue({ matches: false })
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

	/*
	 * The swap has to happen INSIDE the callback. startViewTransition snapshots
	 * the page, runs the callback, snapshots again and animates between the two,
	 * so a swap that lands outside it animates between two identical frames: no
	 * error, no diagonal, just an instant theme change that looks like the bug it
	 * replaced.
	 */
	it("swaps inside the view transition when the browser has one", async () => {
		const callbacks: Array<() => void> = []
		setViewTransitions((callback: () => void) => {
			callbacks.push(callback)
		})

		render(<ThemeToggle />)
		await userEvent.click(await screen.findByRole("button"))

		expect(callbacks).toHaveLength(1)
		expect(setTheme).not.toHaveBeenCalled()

		callbacks[0]()
		expect(setTheme).toHaveBeenCalledWith("light")
	})

	// A full-page value change is exactly the large-scale motion the preference
	// exists for, so it swaps outright rather than sweeping.
	it("skips the transition under reduced motion", async () => {
		const startViewTransition = vi.fn()
		setViewTransitions(startViewTransition)
		window.matchMedia = vi.fn().mockReturnValue({ matches: true })

		render(<ThemeToggle />)
		await userEvent.click(await screen.findByRole("button"))

		expect(startViewTransition).not.toHaveBeenCalled()
		expect(setTheme).toHaveBeenCalledWith("light")
	})
})
