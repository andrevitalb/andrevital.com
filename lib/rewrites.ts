import type { Rewrite } from "next/dist/lib/load-custom-routes"
import { isVisible, SECTIONS } from "./sections"

// Next builds its routes from the filesystem, so a flagged-off section still has
// a page module and still answers on its URL. Letting that page render and call
// notFound() is not enough, on two counts measured against a real build:
//
//   - a page's module-level `metadata` export is evaluated whatever the page
//     then does, so the 404 body carried the section's title, description and
//     canonical URL, which is exactly the tell KTD3 rules out; and
//   - notFound() thrown while prerendering emits an `__next_error__` shell whose
//     <body> is empty and which links no stylesheet, so a cold load was a blank
//     white page instead of app/not-found.tsx.
//
// Rewriting to a path that does not exist hands the request to Next's own 404
// instead, which is byte for byte what an unknown route returns. The in-page
// notFound() guards stay as the second line of defence, and are still what keeps
// generateStaticParams from emitting routes for a hidden section.
const NOWHERE = "/_hidden-section"

export function hiddenSectionRewrites(): Rewrite[] {
	const rewrites: Rewrite[] = SECTIONS.filter(
		(section) => !isVisible(section),
	).flatMap((section) => [
		{ source: `/${section}`, destination: NOWHERE },
		{ source: `/${section}/:path*`, destination: NOWHERE },
	])

	// The feed is Writing's, but it has no /writing prefix for the rules above to
	// catch, so it needs saying separately.
	if (!isVisible("writing")) {
		rewrites.push({ source: "/feed.xml", destination: NOWHERE })
	}

	return rewrites
}
