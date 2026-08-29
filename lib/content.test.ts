import path from "node:path"
import { describe, expect, it } from "vitest"
import { getAll, getSite } from "./content"

const fixtureRoot = path.join(import.meta.dirname, "__fixtures__", "valid")
const invalidRoot = path.join(import.meta.dirname, "__fixtures__", "invalid")

describe("getAll", () => {
	it("includes drafts when includeDrafts is true", () => {
		const entries = getAll("work", { root: fixtureRoot, includeDrafts: true })
		const slugs = entries.map((entry) => entry.slug)
		expect(slugs).toContain("alpha")
		expect(slugs).toContain("beta")
	})

	it("excludes drafts when includeDrafts is false", () => {
		const entries = getAll("work", { root: fixtureRoot, includeDrafts: false })
		const slugs = entries.map((entry) => entry.slug)
		expect(slugs).toContain("alpha")
		expect(slugs).not.toContain("beta")
	})

	it("defaults to including drafts outside production", () => {
		expect(process.env.NODE_ENV).not.toBe("production")
		const entries = getAll("work", { root: fixtureRoot })
		expect(entries.map((entry) => entry.slug)).toContain("beta")
	})

	it("parses work fields including optional permission and links", () => {
		const entries = getAll("work", { root: fixtureRoot, includeDrafts: true })
		const alpha = entries.find((entry) => entry.slug === "alpha")
		expect(alpha?.kind).toBe("client")
		expect(alpha?.permission).toEqual({ clientName: true, screenshots: false })
		expect(alpha?.links).toEqual([
			{ label: "Live site", url: "https://example.com" },
		])

		const beta = entries.find((entry) => entry.slug === "beta")
		expect(beta?.team).toBeUndefined()
		expect(beta?.links).toEqual([])
	})

	it("parses craft entries with a demo reference", () => {
		const craft = getAll("craft", { root: fixtureRoot })
		expect(craft[0].demo).toEqual({ kind: "component", id: "gizmo-demo" })
	})

	it("parses writing entries with base fields only", () => {
		const posts = getAll("writing", { root: fixtureRoot })
		expect(posts[0].title).toBe("Hello World")
		expect(posts[0].tags).toEqual(["meta"])
	})

	it("includes the mdx body as content", () => {
		const posts = getAll("writing", { root: fixtureRoot })
		expect(posts[0].content).toContain("This is the first post.")
	})

	it("throws an error naming the file when front matter is invalid", () => {
		expect(() => getAll("work", { root: invalidRoot })).toThrowError(
			/missing-status\.mdx/,
		)
	})

	it("returns an empty list for a collection directory that does not exist", () => {
		expect(getAll("craft", { root: invalidRoot })).toEqual([])
	})
})

describe("getSite", () => {
	it("parses site.yaml", () => {
		const site = getSite(fixtureRoot)
		expect(site.name).toBe("Test Person")
		expect(site.socials[0]).toEqual({
			label: "GitHub",
			url: "https://github.com/testperson",
		})
	})
})
