import type { Redirect } from "next/dist/lib/load-custom-routes"
import { isVisible } from "./sections"

export function legacyRedirects(): Redirect[] {
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
			destination: "/writing",
			permanent: true,
		},
		{
			source: "/blog/:slug",
			destination: "/writing/:slug",
			permanent: true,
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
