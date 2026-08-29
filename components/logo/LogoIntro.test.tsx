import { act, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { INTRO_ATTRIBUTE, INTRO_DONE } from "./intro-mode"
import { LogoIntro } from "./LogoIntro"

// The full intro budget: two letterform draws, the cut, then the colour pop.
// jsdom cannot resolve the custom properties, so LogoDraw's fallbacks apply.
const INTRO_MS = 600 + 600 + 300 + 200

function renderIntro() {
	return render(
		<LogoIntro>
			<header>nav</header>
			<main id="main">home</main>
			<footer>footer</footer>
		</LogoIntro>,
	)
}

function main() {
	const element = document.getElementById("main")
	if (!element) throw new Error("main is missing")
	return element
}

describe("LogoIntro", () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		document.documentElement.removeAttribute(INTRO_ATTRIBUTE)
	})

	describe("in full mode", () => {
		beforeEach(() => {
			document.documentElement.setAttribute(INTRO_ATTRIBUTE, "full")
		})

		it("holds the page out of reach while the mark draws", () => {
			renderIntro()

			expect(main()).toHaveAttribute("inert")
			expect(screen.getByText("home")).toBeInTheDocument()
		})

		it("releases the page and hands over when the sequence ends", () => {
			renderIntro()

			act(() => {
				vi.advanceTimersByTime(INTRO_MS)
			})

			expect(main()).not.toHaveAttribute("inert")
			expect(document.documentElement.getAttribute(INTRO_ATTRIBUTE)).toBe(
				INTRO_DONE,
			)
		})

		it("ends on the next keypress without waiting out the sequence", () => {
			renderIntro()

			act(() => {
				window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
			})

			expect(main()).not.toHaveAttribute("inert")
			expect(document.documentElement.getAttribute(INTRO_ATTRIBUTE)).toBe(
				INTRO_DONE,
			)
		})

		it("ends on a pointer press", () => {
			renderIntro()

			act(() => {
				window.dispatchEvent(new Event("pointerdown"))
			})

			expect(main()).not.toHaveAttribute("inert")
		})

		it("releases the page if it unmounts mid-sequence", () => {
			const { unmount } = renderIntro()

			const held = main()
			act(() => {
				unmount()
			})

			expect(held).not.toHaveAttribute("inert")
		})
	})

	describe("in inline mode", () => {
		beforeEach(() => {
			document.documentElement.setAttribute(INTRO_ATTRIBUTE, "inline")
		})

		it("never touches the page", () => {
			renderIntro()

			expect(main()).not.toHaveAttribute("inert")
			expect(document.documentElement.getAttribute(INTRO_ATTRIBUTE)).toBe(
				"inline",
			)
		})
	})
})
