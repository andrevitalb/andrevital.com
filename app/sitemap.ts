import type { MetadataRoute } from "next"
import { visibleSections } from "@/lib/sections"
import { absoluteUrl } from "@/lib/site"

// Only routes that actually exist: /about isn't shipped until U5, so it
// isn't listed here yet either. No lastModified: a build-time `new Date()`
// would mark every page as modified on every deploy, which is worse than
// omitting the field.
export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"/",
		"/contact",
		...visibleSections().map((section) => `/${section}`),
	]

	return routes.map((route) => ({
		url: absoluteUrl(route),
	}))
}
