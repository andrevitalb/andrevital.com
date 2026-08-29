import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
	cvSchema,
	formatMonthYear,
	formatPeriod,
	getCv,
	parseEmphasis,
	toMarkdown,
} from "./cv"

const fixtureRoot = path.join(import.meta.dirname, "__fixtures__", "cv")
const invalidRoot = path.join(import.meta.dirname, "__fixtures__", "cv-invalid")

describe("getCv", () => {
	it("loads and validates the fixture CV", () => {
		const cv = getCv(fixtureRoot)
		expect(cv.profile.name).toBe("Sample Person")
		expect(cv.experience).toHaveLength(2)
		expect(cv.experience[0].present).toBe(true)
	})

	it("names the offending entry when it has no end date and no present flag", () => {
		expect(() => getCv(invalidRoot)).toThrow(/"Second Co\." needs either/)
	})

	it("rejects an entry whose end date precedes its start date", () => {
		const backwards = cvSchema.safeParse({
			...getCv(fixtureRoot),
			experience: [
				{
					company: "Backwards Co.",
					position: "Engineer",
					location: "Remote",
					start: { month: 12, year: 2024 },
					end: { month: 9, year: 2023 },
					bullets: ["A bullet."],
				},
			],
		})
		expect(backwards.success).toBe(false)
		expect(backwards.error?.issues[0].message).toContain(
			'"Backwards Co." ends before it starts',
		)
	})

	it("loads the real CV", () => {
		const cv = getCv()
		expect(cv.experience.length).toBeGreaterThan(0)
		// Exactly one current role, or the About timeline shows two "now" rows.
		expect(cv.experience.filter((entry) => entry.present)).toHaveLength(1)
	})
})

describe("formatPeriod", () => {
	const base = {
		company: "Co.",
		position: "Engineer",
		location: "Remote",
		bullets: ["A bullet."],
	}

	it("renders an open range", () => {
		const entry = { ...base, start: { month: 10, year: 2024 }, present: true }
		expect(formatPeriod(entry)).toBe("October 2024 - Present")
		expect(formatPeriod(entry, "short")).toBe("Oct 2024 to now")
	})

	it("renders a closed range", () => {
		const entry = {
			...base,
			start: { month: 12, year: 2023 },
			end: { month: 9, year: 2024 },
			present: false,
		}
		expect(formatPeriod(entry)).toBe("December 2023 - September 2024")
		expect(formatPeriod(entry, "short")).toBe("Dec 2023 to Sep 2024")
	})

	it("drops the repeated year from a short same-year range", () => {
		const entry = {
			...base,
			start: { month: 1, year: 2023 },
			end: { month: 7, year: 2023 },
			present: false,
		}
		expect(formatPeriod(entry, "short")).toBe("Jan to Jul 2023")
		// The long form is the CV's, and a CV spells both years out.
		expect(formatPeriod(entry)).toBe("January 2023 - July 2023")
	})

	it("formats a single month", () => {
		expect(formatMonthYear({ month: 7, year: 2024 })).toBe("July 2024")
		expect(formatMonthYear({ month: 7, year: 2024 }, "short")).toBe("Jul 2024")
	})
})

describe("parseEmphasis", () => {
	it("splits bold runs out of a bullet", () => {
		expect(
			parseEmphasis("Shipped with **React** and **Next.js** fast."),
		).toEqual([
			{ text: "Shipped with ", bold: false },
			{ text: "React", bold: true },
			{ text: " and ", bold: false },
			{ text: "Next.js", bold: true },
			{ text: " fast.", bold: false },
		])
	})

	it("passes plain text through as one span", () => {
		expect(parseEmphasis("No markers here.")).toEqual([
			{ text: "No markers here.", bold: false },
		])
	})

	it("leaves an unclosed marker as literal text", () => {
		expect(parseEmphasis("Half **open")).toEqual([
			{ text: "Half **open", bold: false },
		])
	})

	it("leaves a bare marker alone rather than swallowing it", () => {
		// "**" starts and ends with the marker without ever being a bold run.
		expect(parseEmphasis("Stars ** here")).toEqual([
			{ text: "Stars ** here", bold: false },
		])
	})
})

describe("toMarkdown", () => {
	it("matches the fixture byte for byte", () => {
		const expected = readFileSync(path.join(fixtureRoot, "expected.md"), "utf8")
		expect(toMarkdown(getCv(fixtureRoot))).toBe(expected)
	})

	it("keeps two degrees as separate paragraphs", () => {
		expect(toMarkdown(getCv(fixtureRoot))).toContain(
			"Graduated July 2020\n\n**Sample Diploma**",
		)
	})

	it("carries emphasis markers through untouched", () => {
		expect(toMarkdown(getCv(fixtureRoot))).toContain(
			"- Shipped things with **TypeScript** and **React**.",
		)
	})
})
