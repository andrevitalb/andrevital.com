import type { MetadataRoute } from "next"
import { getAll } from "@/lib/content"
import { isVisible, visibleSections } from "@/lib/sections"
import { absoluteUrl } from "@/lib/site"

// Only routes that actually exist. No lastModified: a build-time `new Date()`
// would mark every page as modified on every deploy, which is worse than
// omitting the field.
export default function sitemap(): MetadataRoute.Sitemap {
	// AE4: drafts are already filtered out of getAll in a production build, so a
	// draft post has no route here for the same reason it has no page.
	const posts = isVisible("writing")
		? getAll("writing").map((post) => `/writing/${post.slug}`)
		: []
	const work = isVisible("work")
		? getAll("work").map((entry) => `/work/${entry.slug}`)
		: []

	const routes = [
		"/",
		"/about",
		"/contact",
		...visibleSections().map((section) => `/${section}`),
		...work,
		...posts,
	]

	return routes.map((route) => ({
		url: absoluteUrl(route),
	}))
}
