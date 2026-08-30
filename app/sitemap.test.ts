import { afterEach, describe, expect, it } from "vitest"
import sitemap from "./sitemap"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

describe("sitemap", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("always includes the unflagged routes", () => {
		delete process.env[ENV_KEY]
		const urls = sitemap().map((entry) => entry.url)
		expect(urls).toContain("https://andrevital.com")
		expect(urls).toContain("https://andrevital.com/about")
		expect(urls).toContain("https://andrevital.com/contact")
	})

	it("excludes hidden sections", () => {
		delete process.env[ENV_KEY]
		const urls = sitemap().map((entry) => entry.url)
		expect(urls).not.toContain("https://andrevital.com/work")
		expect(urls).not.toContain("https://andrevital.com/craft")
		expect(urls).not.toContain("https://andrevital.com/writing")
	})

	it("includes only the visible sections", () => {
		process.env[ENV_KEY] = "craft"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls).toContain("https://andrevital.com/craft")
		expect(urls).not.toContain("https://andrevital.com/work")
		expect(urls).not.toContain("https://andrevital.com/writing")
	})

	it("lists each published post when Writing is visible", () => {
		process.env[ENV_KEY] = "writing"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls).toContain(
			"https://andrevital.com/writing/setting-up-a-multi-package-project",
		)
	})

	it("lists no post routes when Writing is hidden", () => {
		process.env[ENV_KEY] = "craft"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls.some((url) => url.includes("/writing"))).toBe(false)
	})

	it("lists each Work entry when Work is visible", () => {
		process.env[ENV_KEY] = "work"
		const urls = sitemap().map((entry) => entry.url)
		// Under vitest NODE_ENV is "test", so getAll keeps drafts and the example
		// entry stands in for a published one. What a production build does with
		// it (drop it, AE4) is lib/content.test.ts' case, not the sitemap's.
		expect(urls).toContain("https://andrevital.com/work/example-client")
	})

	it("lists no Work routes when Work is hidden", () => {
		process.env[ENV_KEY] = "writing"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls.some((url) => url.includes("/work"))).toBe(false)
	})

	it("lists each Craft piece when Craft is visible", () => {
		process.env[ENV_KEY] = "craft"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls).toContain("https://andrevital.com/craft/logo-draw")
	})

	it("lists no Craft routes when Craft is hidden", () => {
		process.env[ENV_KEY] = "work"
		const urls = sitemap().map((entry) => entry.url)
		expect(urls.some((url) => url.includes("/craft"))).toBe(false)
	})

	it("does not set lastModified", () => {
		delete process.env[ENV_KEY]
		for (const entry of sitemap()) {
			expect(entry.lastModified).toBeUndefined()
		}
	})
})
