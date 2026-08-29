import type { MetadataRoute } from "next"
import { visibleSections } from "@/lib/sections"
import { absoluteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"/",
		"/about",
		"/contact",
		...visibleSections().map((section) => `/${section}`),
	]

	return routes.map((route) => ({
		url: absoluteUrl(route),
		lastModified: new Date(),
	}))
}
