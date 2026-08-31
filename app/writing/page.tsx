import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TextLink } from "@/components/ui/Link"
import { PostList } from "@/components/writing/PostList"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"

const site = getSite()

// generateMetadata, not a module-level `metadata` export: that is evaluated
// whatever the page then does, so with Writing hidden the 404 body still carried
// the section's title, description and canonical URL. lib/rewrites.ts now stops
// the request before it reaches this module at all; this is the second lock.
export function generateMetadata(): Metadata {
	if (!isVisible("writing")) return {}

	return pageMetadata("/writing", {
		siteName: site.name,
		title: "Writing",
		description: `Notes on front-end engineering, tooling and project setup by ${site.name}.`,
	})
}

export default function WritingPage() {
	// KTD3: a hidden section is indistinguishable from an unknown route.
	if (!isVisible("writing")) notFound()

	const posts = getAll("writing")

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">
					Writing
				</h1>
				<p className="mt-4 text-fg-2 text-h2">
					Occasional notes on how things get built.
				</p>
			</div>

			<div className="mt-12 border-line border-t">
				<PostList posts={posts} />
			</div>

			<p className="mt-10 text-small">
				{/* Not a Next <Link>: /feed.xml is a route handler, not a page, so
				    prefetching it would fetch XML as an RSC payload. */}
				<TextLink
					href="/feed.xml"
					variant="quiet"
					className="font-mono text-meta uppercase"
				>
					RSS feed
				</TextLink>
			</p>
		</div>
	)
}
