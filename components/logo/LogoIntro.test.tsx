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

const overlay = () => document.querySelector("[data-intro-overlay]")
const introAttribute = () =>
	document.documentElement.getAttribute(INTRO_ATTRIBUTE)

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

		it("draws over the page, which stays readable underneath", () => {
			renderIntro()

			expect(overlay()).toBeInTheDocument()
			// Not hidden and not inert: the veil is what covers it, so a screen reader
			// still has the whole page (KTD4 amended 2026-08-29).
			expect(screen.getByText("home")).toBeInTheDocument()
			expect(document.getElementById("main")).not.toHaveAttribute("inert")
		})

		it("hands over exactly at the end of the sequence", () => {
			renderIntro()

			act(() => {
				vi.advanceTimersByTime(INTRO_MS - 1)
			})

			// Pins R7's budget: a token change that lengthens the intro fails here.
			expect(introAttribute()).toBe("full")

			act(() => {
				vi.advanceTimersByTime(1)
			})

			expect(introAttribute()).toBe(INTRO_DONE)
			expect(overlay()).not.toBeInTheDocument()
		})

		it("ends on the next keypress without waiting out the sequence", () => {
			renderIntro()

			act(() => {
				window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }))
			})

			expect(introAttribute()).toBe(INTRO_DONE)
			expect(overlay()).not.toBeInTheDocument()
		})

		it("ends on a pointer press", () => {
			renderIntro()

			act(() => {
				window.dispatchEvent(new Event("pointerdown"))
			})

			expect(introAttribute()).toBe(INTRO_DONE)
		})

		it("stops the sequence if it unmounts mid-draw", () => {
			const { unmount } = renderIntro()

			act(() => {
				unmount()
				vi.advanceTimersByTime(INTRO_MS * 2)
			})

			expect(introAttribute()).toBe("full")
		})
	})

	describe("in inline mode", () => {
		beforeEach(() => {
			document.documentElement.setAttribute(INTRO_ATTRIBUTE, "inline")
		})

		it("never draws over the page", () => {
			renderIntro()

			act(() => {
				vi.advanceTimersByTime(INTRO_MS * 2)
			})

			expect(overlay()).not.toBeInTheDocument()
			expect(introAttribute()).toBe("inline")
		})
	})
})
