import { fireEvent, render, screen } from "@testing-library/react"
import { useSearchParams } from "next/navigation"
import { afterEach, describe, expect, it, vi } from "vitest"
import { WorkFilter } from "./WorkFilter"

vi.mock("next/navigation", () => ({
	useSearchParams: vi.fn(),
}))

function setTag(tag?: string) {
	vi.mocked(useSearchParams).mockReturnValue(
		new URLSearchParams(tag ? { tag } : {}) as ReturnType<
			typeof useSearchParams
		>,
	)
}

const kinds = ["client", "personal", "tool"] as const

// What the filter does to the list is a CSS rule keyed on data-active-kind (see
// app/globals.css), so what there is to assert here is the attribute and the
// links that set it.
describe("WorkFilter", () => {
	it("claims no kind with no ?tag=, which is what shows every entry", () => {
		setTag()
		render(<WorkFilter kinds={[...kinds]} />)

		expect(screen.getByRole("navigation")).not.toHaveAttribute(
			"data-active-kind",
		)
	})

	it("marks the kind named by ?tag= as active", () => {
		setTag("tool")
		render(<WorkFilter kinds={[...kinds]} />)

		expect(screen.getByRole("navigation")).toHaveAttribute(
			"data-active-kind",
			"tool",
		)
		expect(screen.getByRole("link", { name: "Tool" })).toHaveAttribute(
			"aria-current",
			"true",
		)
	})

	it("ignores a tag that is not a kind rather than filtering to nothing", () => {
		setTag("react")
		render(<WorkFilter kinds={[...kinds]} />)

		expect(screen.getByRole("navigation")).not.toHaveAttribute(
			"data-active-kind",
		)
	})

	it("links every kind it was given, plus All", () => {
		setTag()
		render(<WorkFilter kinds={["client", "tool"]} />)

		expect(screen.getByRole("link", { name: "All" })).toHaveAttribute(
			"href",
			"/work",
		)
		expect(screen.getByRole("link", { name: "Client" })).toHaveAttribute(
			"href",
			"/work?tag=client",
		)
		expect(
			screen.queryByRole("link", { name: "Personal" }),
		).not.toBeInTheDocument()
	})

	describe("a click", () => {
		afterEach(() => {
			vi.restoreAllMocks()
		})

		it("filters in place: the URL moves, the page does not navigate", () => {
			setTag()
			const pushState = vi.spyOn(window.history, "pushState")
			render(<WorkFilter kinds={[...kinds]} />)

			const notPrevented = fireEvent.click(
				screen.getByRole("link", { name: "Tool" }),
			)

			expect(notPrevented).toBe(false)
			expect(pushState).toHaveBeenCalledWith(
				null,
				"",
				expect.stringMatching(/\/work\?tag=tool$/),
			)
			expect(screen.getByRole("navigation")).toHaveAttribute(
				"data-active-kind",
				"tool",
			)
		})

		it("leaves a modified click to the browser, so it can open a tab", () => {
			setTag()
			const pushState = vi.spyOn(window.history, "pushState")
			render(<WorkFilter kinds={[...kinds]} />)
			const link = screen.getByRole("link", { name: "Tool" })

			for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"]) {
				expect(fireEvent.click(link, { [modifier]: true })).toBe(true)
			}
			expect(fireEvent.click(link, { button: 1 })).toBe(true)

			expect(pushState).not.toHaveBeenCalled()
			expect(screen.getByRole("navigation")).not.toHaveAttribute(
				"data-active-kind",
			)
		})

		it("gives way to a navigation that changes ?tag= from outside", () => {
			setTag()
			vi.spyOn(window.history, "pushState").mockImplementation(() => {})
			const { rerender } = render(<WorkFilter kinds={[...kinds]} />)
			fireEvent.click(screen.getByRole("link", { name: "Tool" }))

			setTag("client")
			rerender(<WorkFilter kinds={[...kinds]} />)

			expect(screen.getByRole("navigation")).toHaveAttribute(
				"data-active-kind",
				"client",
			)
		})
	})
})
