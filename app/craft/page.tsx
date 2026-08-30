import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CraftList } from "@/components/craft/CraftList"
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
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">Craft</h1>
				<p className="mt-4 text-fg-2 text-h2">
					Small interaction pieces, each one finished and running on its own
					page.
				</p>
			</div>

			<div className="mt-12 border-line border-t">
				<CraftList pieces={pieces} />
			</div>
		</div>
	)
}
