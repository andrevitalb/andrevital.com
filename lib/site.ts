import type { Metadata } from "next"

const DEFAULT_SITE_URL = "https://andrevital.com"

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "")

export function absoluteUrl(path = "/"): string {
	if (path === "/") return SITE_URL

	const normalized = path.startsWith("/") ? path : `/${path}`
	return `${SITE_URL}${normalized}`
}

type PageMetadataOptions = {
	siteName: string
	description: string
	title?: string
	/** Set only by post pages, which are OpenGraph articles rather than websites. */
	publishedTime?: string
}

// Every route must build its OWN full metadata through this helper rather
// than relying on inheriting a field from the root layout: Next replaces
// `alternates`, `openGraph` and `twitter` wholesale per segment rather than
// deep-merging them, so a route that only overrides `title` silently keeps
// the root layout's canonical and description. See docs/design.md.
export function pageMetadata(
	path: string,
	{ siteName, description, title, publishedTime }: PageMetadataOptions,
): Metadata {
	const url = absoluteUrl(path)

	return {
		...(title ? { title } : {}),
		description,
		alternates: {
			canonical: path,
		},
		openGraph: {
			...(publishedTime
				? { type: "article" as const, publishedTime }
				: { type: "website" as const }),
			url,
			siteName,
			...(title ? { title } : {}),
			description,
		},
		twitter: {
			card: "summary_large_image",
			...(title ? { title } : {}),
			description,
		},
	}
}

// Always UTC. Front matter dates are bare `YYYY-MM-DD`, which zod coerces to
// UTC midnight, so formatting in the build machine's local zone would render
// the previous day anywhere west of Greenwich.
const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
})

export function formatDate(date: Date): string {
	return DATE_FORMAT.format(date)
}
