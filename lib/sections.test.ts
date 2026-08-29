import { afterEach, describe, expect, it, vi } from "vitest"
import { isVisible, SECTIONS, visibleSections } from "./sections"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

function setSections(value: string | undefined) {
	if (value === undefined) {
		delete process.env[ENV_KEY]
	} else {
		process.env[ENV_KEY] = value
	}
}

describe("SECTIONS", () => {
	it("orders sections work, craft, writing", () => {
		expect(SECTIONS).toEqual(["work", "craft", "writing"])
	})
})

describe("visibleSections and isVisible", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("hides work and craft when only writing is listed", () => {
		setSections("writing")
		expect(visibleSections()).toEqual(["writing"])
		expect(isVisible("work")).toBe(false)
		expect(isVisible("craft")).toBe(false)
		expect(isVisible("writing")).toBe(true)
	})

	it("hides every section when the value is an empty string", () => {
		setSections("")
		expect(visibleSections()).toEqual([])
	})

	it("hides every section when the variable is undefined", () => {
		setSections(undefined)
		expect(visibleSections()).toEqual([])
	})

	it("keeps nav order regardless of the order in the env value", () => {
		setSections("writing,work")
		expect(visibleSections()).toEqual(["work", "writing"])
	})

	it("ignores unknown names and warns once naming them", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
		setSections("work,gallery,craft,blog")
		expect(visibleSections()).toEqual(["work", "craft"])
		expect(warn).toHaveBeenCalledTimes(1)
		expect(warn.mock.calls[0]?.[0]).toContain("gallery")
		expect(warn.mock.calls[0]?.[0]).toContain("blog")
		warn.mockRestore()
	})
})
