import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DrawRule } from "@/components/motion/DrawRule"
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
			{/*
			 * The h1 is the document heading and the post titles are the visual one,
			 * the split U2b settled on Home. It is deliberate that this reads small:
			 * with one published post, a display-scale "Writing" over a small list is
			 * the shape that leaves the entry floating, and the entries are what the
			 * page is for. See components/writing/PostList.tsx.
			 */}
			<div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
				<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
					Writing
				</h1>
				{/* Not a Next <Link>: /feed.xml is a route handler, not a page, so
				    prefetching it would fetch XML as an RSC payload. */}
				<TextLink
					href="/feed.xml"
					variant="quiet"
					className="font-mono text-meta uppercase tracking-[0.12em]"
				>
					RSS feed
				</TextLink>
			</div>

			{/* A standfirst, not a subtitle. At --text-h2 it competed with the entries
			    that are supposed to carry the page. */}
			<p className="mt-3 max-w-measure text-fg-2 text-small">
				Occasional notes on how things get built.
			</p>

			<DrawRule className="mt-8" />

			<div className="mt-14">
				<PostList posts={posts} />
			</div>
		</div>
	)
}
