import type { MetadataRoute } from "next"
import { visibleSections } from "@/lib/sections"
import { absoluteUrl } from "@/lib/site"

// Only routes that actually exist. No lastModified: a build-time `new Date()`
// would mark every page as modified on every deploy, which is worse than
// omitting the field.
export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"/",
		"/about",
		"/contact",
		...visibleSections().map((section) => `/${section}`),
	]

	return routes.map((route) => ({
		url: absoluteUrl(route),
	}))
}
