import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Work } from "@/lib/schemas"
import { WorkList } from "./WorkList"

function entry(slug: string, kind: Work["kind"]): Work {
	return {
		title: slug,
		slug,
		summary: `Summary of ${slug}.`,
		date: new Date("2026-01-01T00:00:00.000Z"),
		status: "published",
		tags: [],
		kind,
		role: "Engineer",
		period: "2026",
		links: [],
		hero: "/images/work/hero.png",
		permission: { clientName: false, screenshots: false },
	}
}

describe("WorkList", () => {
	// Half of the filter's contract: the CSS rule in app/globals.css hides rows by
	// this attribute, and nothing else in the codebase would notice if it went.
	// The other half is WorkFilter's data-active-kind and the rule itself, which
	// tests/e2e/smoke.spec.ts checks against the real stylesheet.
	it("tags each row with its kind for the filter rule to hide on", () => {
		render(
			<WorkList
				entries={[entry("a-client", "client"), entry("a-tool", "tool")]}
			/>,
		)

		const rows = screen.getAllByRole("listitem")
		expect(rows.map((row) => row.dataset.kind)).toEqual(["client", "tool"])
	})

	it("says so rather than rendering an empty list", () => {
		render(<WorkList entries={[]} />)

		expect(screen.getByText("Nothing published yet.")).toBeInTheDocument()
		expect(screen.queryByRole("list")).not.toBeInTheDocument()
	})
})
