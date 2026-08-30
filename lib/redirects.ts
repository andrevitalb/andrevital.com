import type { Redirect } from "next/dist/lib/load-custom-routes"
import { isVisible } from "./sections"

export function legacyRedirects(): Redirect[] {
	// KTD3: a hidden section has to be indistinguishable from an unknown route,
	// so a legacy URL pointing into one goes home instead of announcing that the
	// section exists by redirecting to a page that then 404s. Not permanent while
	// the target depends on a flag: a 308 would be cached by the browser and
	// outlive the flag flip.
	const writingVisible = isVisible("writing")

	return [
		{
			source: "/photo/:path*",
			destination: "/",
			permanent: true,
		},
		{
			source: "/develop/:path*",
			destination: isVisible("work") ? "/work" : "/",
			permanent: false,
		},
		{
			source: "/blog",
			destination: writingVisible ? "/writing" : "/",
			permanent: writingVisible,
		},
		{
			source: "/blog/:slug",
			destination: writingVisible ? "/writing/:slug" : "/",
			permanent: writingVisible,
		},
		{
			source: "/docs/en/cv.pdf",
			destination: "/cv.pdf",
			permanent: true,
		},
		{
			source: "/docs/en/CV.pdf",
			destination: "/cv.pdf",
			permanent: true,
		},
	]
}
