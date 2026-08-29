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
}

// Every route must build its OWN full metadata through this helper rather
// than relying on inheriting a field from the root layout: Next replaces
// `alternates`, `openGraph` and `twitter` wholesale per segment rather than
// deep-merging them, so a route that only overrides `title` silently keeps
// the root layout's canonical and description. See docs/design.md.
export function pageMetadata(
	path: string,
	{ siteName, description, title }: PageMetadataOptions,
): Metadata {
	const url = absoluteUrl(path)

	return {
		...(title ? { title } : {}),
		description,
		alternates: {
			canonical: path,
		},
		openGraph: {
			type: "website",
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
