import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Work } from "@/lib/schemas"
import { WorkHeader } from "./WorkHeader"

const base: Work = {
	title: "An anonymized client engagement",
	slug: "example-client",
	summary: "What the product was and what changed after.",
	date: new Date("2026-01-15T00:00:00.000Z"),
	status: "published",
	tags: ["react", "design-systems"],
	kind: "client",
	role: "Senior software engineer",
	client: "Acme Corp",
	team: "Two engineers, one designer, one PM",
	period: "2026 Q1",
	links: [{ label: "Live site", url: "https://example.com" }],
	hero: "/images/work/example-client.png",
	permission: { clientName: false, screenshots: false },
}

describe("WorkHeader", () => {
	// AE8.
	it("withholds the client name and keeps the role and team line without permission", () => {
		render(<WorkHeader entry={base} />)

		expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument()
		expect(screen.queryByText("Client")).not.toBeInTheDocument()
		expect(screen.getByText("Senior software engineer")).toBeInTheDocument()
		expect(screen.getByText(base.team as string)).toBeInTheDocument()
	})

	it("names the client once permission is recorded", () => {
		render(
			<WorkHeader
				entry={{
					...base,
					permission: { clientName: true, screenshots: false },
				}}
			/>,
		)

		expect(screen.getByText("Client")).toBeInTheDocument()
		expect(screen.getByText("Acme Corp")).toBeInTheDocument()
	})

	it("shows no client line when permission is recorded but no client is named", () => {
		render(
			<WorkHeader
				entry={{
					...base,
					client: undefined,
					permission: { clientName: true, screenshots: false },
				}}
			/>,
		)

		expect(screen.queryByText("Client")).not.toBeInTheDocument()
	})

	it("renders the entry's tags", () => {
		render(<WorkHeader entry={base} />)

		for (const tag of base.tags) {
			expect(screen.getByText(tag)).toBeInTheDocument()
		}
	})

	it("opens external links safely", () => {
		render(<WorkHeader entry={base} />)

		const link = screen.getByRole("link", { name: "Live site" })
		expect(link).toHaveAttribute("href", "https://example.com")
		expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
	})
})
