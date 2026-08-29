import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ThemeToggle } from "./ThemeToggle"

const setTheme = vi.fn()
let resolvedTheme: string | undefined = "dark"
let effectsEnabled = true

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme, setTheme }),
}))

// Lets the placeholder-before-mount tests disable useEffect entirely, since
// @testing-library/react's render() otherwise flushes effects synchronously
// and `mounted` would already be true before any assertion could run.
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>()
	return {
		...actual,
		useEffect: (...args: Parameters<typeof actual.useEffect>) => {
			// biome-ignore lint/correctness/useHookAtTopLevel: this wraps the real useEffect for a test double, not a component calling a hook conditionally
			if (effectsEnabled) actual.useEffect(...args)
		},
	}
})

describe("ThemeToggle", () => {
	afterEach(() => {
		setTheme.mockClear()
		resolvedTheme = "dark"
		effectsEnabled = true
	})

	it("renders a disabled, fixed-size placeholder before mount", () => {
		// This is exactly what the server, and the client's first hydration
		// pass, both render: useEffect never runs, so `mounted` never flips.
		effectsEnabled = false
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

	it("shows the target theme as the visible label, matching the accessible name", () => {
		resolvedTheme = "dark"
		render(<ThemeToggle />)
		const button = screen.getByRole("button", { name: "Switch to light theme" })
		expect(button).toHaveTextContent("Light")
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
		effectsEnabled = false
		const { container: unresolved } = render(<ThemeToggle />)
		const unresolvedClasses = unresolved.querySelector("button")?.className
		effectsEnabled = true

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
