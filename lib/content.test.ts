import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { getAll, getSite } from "./content"

const fixtureRoot = path.join(import.meta.dirname, "__fixtures__", "valid")
const invalidRoot = path.join(import.meta.dirname, "__fixtures__", "invalid")
const duplicateSlugRoot = path.join(
	import.meta.dirname,
	"__fixtures__",
	"duplicate-slugs",
)
const duplicateTagRoot = path.join(
	import.meta.dirname,
	"__fixtures__",
	"duplicate-tags",
)
const noFactsRoot = path.join(import.meta.dirname, "__fixtures__", "no-facts")

describe("getAll", () => {
	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it("rejects front matter that repeats a tag", () => {
		expect(() => getAll("writing", { root: duplicateTagRoot })).toThrow(
			/tags: must not repeat a tag/,
		)
	})

	it("excludes drafts by default when NODE_ENV is production", () => {
		vi.stubEnv("NODE_ENV", "production")
		const entries = getAll("work", { root: fixtureRoot })
		const slugs = entries.map((entry) => entry.slug)
		expect(slugs).toContain("alpha")
		expect(slugs).not.toContain("beta")
	})

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

	it("throws an error naming the collection, slug and both files when slugs collide", () => {
		let message = ""
		try {
			getAll("work", { root: duplicateSlugRoot })
		} catch (error) {
			message = (error as Error).message
		}
		expect(message).toContain("work")
		expect(message).toContain("same-slug")
		expect(message).toContain("one.mdx")
		expect(message).toContain("two.mdx")
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

	it("reads the Home facts in file order", () => {
		expect(getSite(fixtureRoot).facts).toEqual([
			{ label: "Role", value: "Test Role" },
			{ label: "At", value: "Test Employer" },
			{ label: "Based in", value: "Test Place" },
		])
	})

	it("reads the contact timezone", () => {
		expect(getSite(fixtureRoot).timezone).toBe("TST, UTC+0")
	})

	it("rejects a site.yaml with no facts", () => {
		expect(() => getSite(noFactsRoot)).toThrow(/: facts: /)
	})
})
