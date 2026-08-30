import { render, screen } from "@testing-library/react"
import { useSearchParams } from "next/navigation"
import { describe, expect, it, vi } from "vitest"
import type { Work } from "@/lib/schemas"
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

function entry(overrides: Partial<Work> & Pick<Work, "slug" | "kind">): Work {
	return {
		title: overrides.slug,
		summary: `Summary of ${overrides.slug}.`,
		date: new Date("2026-01-01T00:00:00.000Z"),
		status: "published",
		tags: [],
		role: "Engineer",
		period: "2026",
		links: [],
		hero: "/images/work/hero.png",
		permission: { clientName: false, screenshots: false },
		...overrides,
	}
}

// Deliberately given tool-first, so an assertion on order is checking the sort
// rather than the order they happened to arrive in.
const entries = [
	entry({ slug: "a-tool", kind: "tool" }),
	entry({ slug: "a-client", kind: "client" }),
	entry({ slug: "a-personal", kind: "personal" }),
]

function shownSlugs() {
	return screen
		.getAllByRole("heading", { level: 2 })
		.map((heading) => heading.textContent)
}

describe("WorkFilter", () => {
	it("puts client and personal entries before tools with no filter", () => {
		setTag()
		render(<WorkFilter entries={entries} />)

		expect(shownSlugs()).toEqual(["a-client", "a-personal", "a-tool"])
	})

	it("shows only the matching kind when ?tag= names one", () => {
		setTag("tool")
		render(<WorkFilter entries={entries} />)

		expect(shownSlugs()).toEqual(["a-tool"])
		expect(screen.getByRole("link", { name: "Tool" })).toHaveAttribute(
			"aria-current",
			"true",
		)
	})

	it("falls back to the full list for a tag that is not a kind", () => {
		setTag("react")
		render(<WorkFilter entries={entries} />)

		expect(shownSlugs()).toEqual(["a-client", "a-personal", "a-tool"])
	})

	it("offers no filter when every entry is the same kind", () => {
		setTag()
		render(<WorkFilter entries={[entry({ slug: "only", kind: "tool" })]} />)

		expect(
			screen.queryByRole("navigation", { name: "Filter by kind" }),
		).not.toBeInTheDocument()
	})
})
