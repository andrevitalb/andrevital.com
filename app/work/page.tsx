import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { FILTER_NAV_BOX, WorkFilter } from "@/components/work/WorkFilter"
import { WorkList } from "@/components/work/WorkList"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"
import { kindsPresent, sortByDefaultOrder } from "@/lib/work"

const site = getSite()

// generateMetadata, not a module-level `metadata` export: that is evaluated
// whatever the page then does, so with Work hidden the 404 body would still
// carry the section's title, description and canonical URL. lib/rewrites.ts
// stops the request before this module runs at all; this is the second lock.
export function generateMetadata(): Metadata {
	if (!isVisible("work")) return {}

	return pageMetadata("/work", {
		siteName: site.name,
		title: "Work",
		description: `Client, personal and tool projects built by ${site.name}.`,
	})
}

export default function WorkPage() {
	// KTD3: a hidden section is indistinguishable from an unknown route.
	if (!isVisible("work")) notFound()

	const entries = sortByDefaultOrder(getAll("work"))
	const kinds = kindsPresent(entries)

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">Work</h1>
				<p className="mt-4 text-fg-2 text-h2">
					Products, prototypes and tools, most of them shipped with a team.
				</p>
			</div>

			{/* The list is server-rendered and sits outside the boundary below, so
			    it ships in the static HTML; only the nav waits for the URL, and the
			    `data-active-kind` rule in app/globals.css is what joins the two.
			    Putting the list inside the boundary instead rendered the fallback
			    into the page, so a client without JavaScript got no Work at all and
			    the first card's image preload never reached the HTML. */}
			<div className="work-filter mt-12">
				{kinds.length > 1 && (
					<Suspense fallback={<div className={FILTER_NAV_BOX} />}>
						<WorkFilter kinds={kinds} />
					</Suspense>
				)}
				<WorkList entries={entries} />
			</div>
		</div>
	)
}
