import { afterEach, describe, expect, it, vi } from "vitest"
import { pageMetadata } from "./site"

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

describe("pageMetadata", () => {
	it("builds a route-specific canonical, not the site root", () => {
		const metadata = pageMetadata("/contact", {
			siteName: "André Vital",
			description: "Reach André Vital by email or on social.",
		})
		expect(metadata.alternates?.canonical).toBe("/contact")
	})

	it("builds a route-specific description", () => {
		const metadata = pageMetadata("/contact", {
			siteName: "André Vital",
			description: "Reach André Vital by email or on social.",
		})
		expect(metadata.description).toBe(
			"Reach André Vital by email or on social.",
		)
	})

	it("carries the title through to openGraph and twitter when given", () => {
		const metadata = pageMetadata("/contact", {
			siteName: "André Vital",
			title: "Contact",
			description: "Reach André Vital by email or on social.",
		})
		expect(metadata.title).toBe("Contact")
		expect(metadata.openGraph?.title).toBe("Contact")
		expect(
			metadata.twitter && "title" in metadata.twitter && metadata.twitter.title,
		).toBe("Contact")
	})

	it("omits the title key entirely when none is given, so a parent title template is not clobbered", () => {
		const metadata = pageMetadata("/", {
			siteName: "André Vital",
			description: "André Vital's portfolio.",
		})
		expect("title" in metadata).toBe(false)
	})

	it("sets a summary_large_image twitter card and the site name on openGraph", () => {
		const metadata = pageMetadata("/contact", {
			siteName: "André Vital",
			description: "Reach André Vital by email or on social.",
		})
		expect(
			metadata.twitter && "card" in metadata.twitter && metadata.twitter.card,
		).toBe("summary_large_image")
		expect(metadata.openGraph?.siteName).toBe("André Vital")
	})

	it("builds an absolute openGraph url for the route", () => {
		const metadata = pageMetadata("/contact", {
			siteName: "André Vital",
			description: "Reach André Vital by email or on social.",
		})
		expect(
			metadata.openGraph &&
				"url" in metadata.openGraph &&
				metadata.openGraph.url,
		).toBe("https://andrevital.com/contact")
	})
})
