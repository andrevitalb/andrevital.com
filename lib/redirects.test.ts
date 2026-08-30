import { afterEach, describe, expect, it } from "vitest"
import { legacyRedirects } from "./redirects"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

function setSections(value: string | undefined) {
	if (value === undefined) {
		delete process.env[ENV_KEY]
	} else {
		process.env[ENV_KEY] = value
	}
}

function find(redirects: ReturnType<typeof legacyRedirects>, source: string) {
	const redirect = redirects.find((entry) => entry.source === source)
	if (!redirect) throw new Error(`No redirect found for source ${source}`)
	return redirect
}

describe("legacyRedirects", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("sends /develop to /work when Work is visible, as a non-permanent redirect", () => {
		setSections("work")
		const redirect = find(legacyRedirects(), "/develop/:path*")
		expect(redirect.destination).toBe("/work")
		expect(redirect.permanent).toBe(false)
	})

	it("sends /develop to / when Work is hidden", () => {
		setSections("craft,writing")
		const redirect = find(legacyRedirects(), "/develop/:path*")
		expect(redirect.destination).toBe("/")
		expect(redirect.permanent).toBe(false)
	})

	it("sends /develop to / when no section is visible", () => {
		setSections("")
		const redirect = find(legacyRedirects(), "/develop/:path*")
		expect(redirect.destination).toBe("/")
	})

	it("sends /photo permanently to /", () => {
		const redirect = find(legacyRedirects(), "/photo/:path*")
		expect(redirect.destination).toBe("/")
		expect(redirect.permanent).toBe(true)
	})

	it("sends /blog to /writing and /blog/:slug to /writing/:slug when Writing is visible", () => {
		setSections("writing")
		const redirects = legacyRedirects()
		expect(find(redirects, "/blog").destination).toBe("/writing")
		expect(find(redirects, "/blog").permanent).toBe(true)
		expect(find(redirects, "/blog/:slug").destination).toBe("/writing/:slug")
		expect(find(redirects, "/blog/:slug").permanent).toBe(true)
	})

	it("sends the blog URLs home when Writing is hidden, and not permanently", () => {
		setSections("work")
		const redirects = legacyRedirects()
		// Redirecting to /writing here would 404 on arrival and give away that a
		// hidden section is there, which is what KTD3 rules out.
		expect(find(redirects, "/blog").destination).toBe("/")
		expect(find(redirects, "/blog").permanent).toBe(false)
		expect(find(redirects, "/blog/:slug").destination).toBe("/")
		expect(find(redirects, "/blog/:slug").permanent).toBe(false)
	})

	it("sends both cv.pdf spellings to /cv.pdf", () => {
		const redirects = legacyRedirects()
		expect(find(redirects, "/docs/en/cv.pdf").destination).toBe("/cv.pdf")
		expect(find(redirects, "/docs/en/cv.pdf").permanent).toBe(true)
		expect(find(redirects, "/docs/en/CV.pdf").destination).toBe("/cv.pdf")
		expect(find(redirects, "/docs/en/CV.pdf").permanent).toBe(true)
	})

	it("does not redirect /about or /contact", () => {
		const redirects = legacyRedirects()
		expect(redirects.some((entry) => entry.source === "/about")).toBe(false)
		expect(redirects.some((entry) => entry.source === "/contact")).toBe(false)
	})
})
