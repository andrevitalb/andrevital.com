import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { absoluteUrl } from "@/lib/site"

// Hand-rolled rather than a feed library: RSS 2.0 is a fixed shape, this is the
// whole of it, and the alternative is a dependency for thirty lines of string.
export const dynamic = "force-static"

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
}

function escapeXml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => ESCAPES[character])
}

export function GET(): Response {
	const site = getSite()

	// KTD3: with Writing hidden the feed must be indistinguishable from an
	// unknown route, so it is an empty 404 rather than an empty feed.
	if (!isVisible("writing")) {
		return new Response(null, { status: 404 })
	}

	// getAll already drops drafts in a production build and sorts newest first.
	const posts = getAll("writing")

	const items = posts
		.map((post) => {
			const url = absoluteUrl(`/writing/${post.slug}`)
			return `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${escapeXml(url)}</link>
			<guid isPermaLink="true">${escapeXml(url)}</guid>
			<description>${escapeXml(post.summary)}</description>
			<pubDate>${post.date.toUTCString()}</pubDate>
${post.tags.map((tag) => `			<category>${escapeXml(tag)}</category>`).join("\n")}
		</item>`
		})
		.join("\n")

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(`${site.name} · Writing`)}</title>
		<link>${escapeXml(absoluteUrl("/writing"))}</link>
		<description>${escapeXml(site.positioning)}</description>
		<language>en</language>
		<atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`

	return new Response(xml, {
		headers: { "content-type": "application/rss+xml; charset=utf-8" },
	})
}
