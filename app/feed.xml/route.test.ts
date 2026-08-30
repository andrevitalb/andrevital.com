import { afterEach, describe, expect, it, vi } from "vitest"
import type { Post } from "@/lib/schemas"

const { getAll, getSite } = vi.hoisted(() => ({
	getAll: vi.fn(),
	getSite: vi.fn(),
}))

vi.mock("@/lib/content", () => ({ getAll, getSite }))

import { GET } from "./route"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

const site = {
	name: "André Vital",
	positioning: "Senior front-end engineer",
	aboutStatement: "",
	email: "contact@example.com",
	bio: [],
	socials: [],
}

const posts: Post[] = [
	{
		title: "Tabs & spaces <forever>",
		slug: "tabs-and-spaces",
		summary: 'He said "no".',
		date: new Date("2024-02-03T00:00:00.000Z"),
		status: "published",
		tags: ["tooling"],
	},
	{
		title: "Setting up a multi-package project",
		slug: "setting-up-a-multi-package-project",
		summary: "A walk through wiring a yarn workspaces monorepo.",
		date: new Date("2023-04-10T00:00:00.000Z"),
		status: "published",
		tags: ["git", "project-setup"],
	},
]

function parse(xml: string): Document {
	const document = new DOMParser().parseFromString(xml, "application/xml")
	expect(document.querySelector("parsererror")).toBeNull()
	return document
}

async function feed(): Promise<{
	response: Response
	xml: string
	document: Document
}> {
	getSite.mockReturnValue(site)
	getAll.mockReturnValue(posts)
	const response = GET()
	// Read once: a Response body is a stream and does not rewind.
	const xml = await response.text()
	return { response, xml, document: parse(xml) }
}

describe("GET /feed.xml", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
		vi.clearAllMocks()
	})

	it("is a 404 with an empty body when Writing is hidden", async () => {
		delete process.env[ENV_KEY]
		getSite.mockReturnValue(site)
		getAll.mockReturnValue(posts)

		const response = GET()

		expect(response.status).toBe(404)
		expect(await response.text()).toBe("")
		// Nothing about the section leaks, not even the fact that posts exist.
		expect(getAll).not.toHaveBeenCalled()
	})

	it("serves valid RSS as application/rss+xml", async () => {
		process.env[ENV_KEY] = "writing"
		const { response, document } = await feed()

		expect(response.status).toBe(200)
		expect(response.headers.get("content-type")).toBe(
			"application/rss+xml; charset=utf-8",
		)
		expect(document.documentElement.tagName).toBe("rss")
		expect(document.documentElement.getAttribute("version")).toBe("2.0")
		expect(document.querySelector("channel > title")?.textContent).toBe(
			"André Vital · Writing",
		)
		expect(document.querySelector("channel > link")?.textContent).toBe(
			"https://andrevital.com/writing",
		)
	})

	it("carries one item per post, in order, with absolute links", async () => {
		process.env[ENV_KEY] = "writing"
		const { document } = await feed()

		const items = [...document.querySelectorAll("item")]
		expect(items).toHaveLength(posts.length)
		expect(
			items.map((item) => item.querySelector("link")?.textContent),
		).toEqual([
			"https://andrevital.com/writing/tabs-and-spaces",
			"https://andrevital.com/writing/setting-up-a-multi-package-project",
		])
		expect(items[1]?.querySelector("pubDate")?.textContent).toBe(
			"Mon, 10 Apr 2023 00:00:00 GMT",
		)
		expect(
			[...(items[1]?.querySelectorAll("category") ?? [])].map(
				(category) => category.textContent,
			),
		).toEqual(["git", "project-setup"])
	})

	it("escapes markup and quotes rather than emitting them raw", async () => {
		process.env[ENV_KEY] = "writing"
		const { xml } = await feed()

		// The parse in `feed` already proves the document is well-formed; this
		// pins the escaping itself, which is what would break it.
		expect(xml).toContain("Tabs &amp; spaces &lt;forever&gt;")
		expect(xml).toContain("He said &quot;no&quot;.")
		expect(xml).not.toContain("<forever>")
	})

	it("takes getAll's draft filtering rather than overriding it", async () => {
		process.env[ENV_KEY] = "writing"
		await feed()

		// AE4 lives in lib/content (drafts are dropped when NODE_ENV is
		// production). All the route has to do is not opt out of it.
		expect(getAll).toHaveBeenCalledWith("writing")
	})
})
