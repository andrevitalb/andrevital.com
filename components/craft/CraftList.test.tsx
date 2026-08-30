import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Craft } from "@/lib/schemas"
import { CraftList } from "./CraftList"

function piece(slug: string): Craft {
	return {
		title: slug,
		slug,
		summary: `Summary of ${slug}.`,
		date: new Date("2026-01-01T00:00:00.000Z"),
		status: "published",
		tags: ["motion"],
		demo: { kind: "component", id: "logo-draw" },
	}
}

describe("CraftList", () => {
	it("links each piece to its own page", () => {
		render(<CraftList pieces={[piece("logo-draw"), piece("second")]} />)

		expect(
			screen.getAllByRole("link").map((link) => link.getAttribute("href")),
		).toEqual(["/craft/logo-draw", "/craft/second"])
	})

	it("says so rather than rendering an empty list", () => {
		render(<CraftList pieces={[]} />)

		expect(screen.getByText("Nothing published yet.")).toBeInTheDocument()
		expect(screen.queryByRole("list")).not.toBeInTheDocument()
	})
})
