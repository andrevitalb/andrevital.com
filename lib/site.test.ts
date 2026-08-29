import { afterEach, describe, expect, it, vi } from "vitest"

const ENV_KEY = "NEXT_PUBLIC_SITE_URL"

async function loadSite() {
	vi.resetModules()
	return import("./site")
}

describe("SITE_URL", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("falls back to the production domain when unset", async () => {
		delete process.env[ENV_KEY]
		const { SITE_URL } = await loadSite()
		expect(SITE_URL).toBe("https://andrevital.com")
	})

	it("uses NEXT_PUBLIC_SITE_URL when set", async () => {
		process.env[ENV_KEY] = "https://staging.andrevital.com"
		const { SITE_URL } = await loadSite()
		expect(SITE_URL).toBe("https://staging.andrevital.com")
	})

	it("strips a trailing slash from a configured URL", async () => {
		process.env[ENV_KEY] = "https://staging.andrevital.com/"
		const { SITE_URL } = await loadSite()
		expect(SITE_URL).toBe("https://staging.andrevital.com")
	})
})

describe("absoluteUrl", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("joins the site URL with a leading-slash path", async () => {
		const { absoluteUrl } = await loadSite()
		expect(absoluteUrl("/contact")).toBe("https://andrevital.com/contact")
	})

	it("adds a leading slash when the path is missing one", async () => {
		const { absoluteUrl } = await loadSite()
		expect(absoluteUrl("contact")).toBe("https://andrevital.com/contact")
	})

	it("defaults to the site root", async () => {
		const { absoluteUrl } = await loadSite()
		expect(absoluteUrl()).toBe("https://andrevital.com")
	})
})
