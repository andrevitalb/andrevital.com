import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CraftList } from "@/components/craft/CraftList"
import { DrawRule } from "@/components/motion/DrawRule"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"

const site = getSite()

// generateMetadata, not a module-level `metadata` export: that is evaluated
// whatever the page then does, so with Craft hidden the 404 body would still
// carry the section's title, description and canonical URL. lib/rewrites.ts
// stops the request before this module runs at all; this is the second lock.
export function generateMetadata(): Metadata {
	if (!isVisible("craft")) return {}

	return pageMetadata("/craft", {
		siteName: site.name,
		title: "Craft",
		description: `Small, finished interaction pieces built by ${site.name}.`,
	})
}

export default function CraftPage() {
	// KTD3: a hidden section is indistinguishable from an unknown route.
	if (!isVisible("craft")) notFound()

	const pieces = getAll("craft")

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			{/* "Craft" stays the h1 (smoke.spec.ts pins it); the headline below is the
			    visual one, which is what lets an index page carry a line that is not
			    its own section name. */}
			<header className="mb-24 pl-6">
				<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
					Craft
				</h1>
				<p className="mt-8 max-w-measure font-light text-display leading-tight tracking-tight">
					Structural motions &amp; typographic mechanics.
				</p>
				<DrawRule className="mt-8 max-w-[4rem]" />
			</header>

			<div className="pl-6">
				<CraftList pieces={pieces} />
			</div>
		</div>
	)
}
