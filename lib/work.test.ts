import { describe, expect, it } from "vitest"
import type { Work } from "./schemas"
import { kindsPresent, sortByDefaultOrder } from "./work"

function entry(slug: string, kind: Work["kind"]): Work {
	return {
		title: slug,
		slug,
		summary: "",
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

describe("sortByDefaultOrder", () => {
	it("puts client and personal entries before tools", () => {
		const sorted = sortByDefaultOrder([
			entry("a-tool", "tool"),
			entry("a-personal", "personal"),
			entry("a-client", "client"),
		])

		expect(sorted.map((item) => item.slug)).toEqual([
			"a-client",
			"a-personal",
			"a-tool",
		])
	})

	it("keeps the incoming order within a kind, which is getAll's date order", () => {
		const sorted = sortByDefaultOrder([
			entry("newer", "client"),
			entry("older", "client"),
		])

		expect(sorted.map((item) => item.slug)).toEqual(["newer", "older"])
	})
})

describe("kindsPresent", () => {
	it("lists only the kinds that have an entry, in filter order", () => {
		expect(kindsPresent([entry("a", "tool"), entry("b", "client")])).toEqual([
			"client",
			"tool",
		])
	})
})
