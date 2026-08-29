const DEFAULT_SITE_URL = "https://andrevital.com"

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "")

export function absoluteUrl(path = "/"): string {
	if (path === "/") return SITE_URL

	const normalized = path.startsWith("/") ? path : `/${path}`
	return `${SITE_URL}${normalized}`
}
