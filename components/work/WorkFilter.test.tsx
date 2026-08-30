import { render, screen } from "@testing-library/react"
import { useSearchParams } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
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
})
