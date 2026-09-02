import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { DrawRule } from "@/components/motion/DrawRule"
import { FILTER_NAV_BOX, WorkFilter } from "@/components/work/WorkFilter"
import { WorkList } from "@/components/work/WorkList"
import { getAll, getSite } from "@/lib/content"
import { DIRECTORY_GRID } from "@/lib/layout"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"
import { kindsPresent, sortByDefaultOrder } from "@/lib/work"

const site = getSite()

// The page's bands, the same grid About's are on.
const BAND = `grid gap-x-8 gap-y-4 ${DIRECTORY_GRID}`

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
			{/* One spine for the page, at About's indent so the two rails land on the
			    same line. The masthead, the filter and every row hang off it. */}
			<div data-spine className="grid gap-16 pl-6 min-[760px]:pl-8">
				<div className={BAND}>
					{/*
					 * "Work" is the document heading and stays the h1; the visual
					 * headline is the line below it. Same inversion as the Writing
					 * index, and the reason an index page can carry a headline that is
					 * not its own section name.
					 *
					 * The comp's eyebrow read WORK INDEX. The second word is dropped:
					 * the sidebar says WORK, the URL says /work, and putting "index"
					 * inside the h1 would rename it, which smoke.spec.ts pins.
					 */}
					<div className="grid content-start gap-4">
						<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
							Work
						</h1>
						{/* The eyebrow's rule, in the eyebrow's column. In the wide one it
						    read as a separator above the headline rather than as furniture
						    belonging to the label. */}
						<DrawRule className="max-w-[4rem]" />
					</div>

					<div className="grid gap-5">
						<p className="font-medium text-display leading-[1.05] tracking-[-0.03em]">
							Selected projects
						</p>
						{/* A standfirst, not a subtitle, at the Writing index's scale. At
						    --text-h2 it competed with the rows that carry the page. */}
						<p className="max-w-measure text-fg-2 text-small">
							Products, prototypes and tools, most of them shipped with a team.
						</p>
					</div>
				</div>

				{/* The list is server-rendered and sits outside the boundary below, so
				    it ships in the static HTML; only the nav waits for the URL, and the
				    `data-active-kind` rule in app/globals.css is what joins the two.
				    Putting the list inside the boundary instead rendered the fallback
				    into the page, so a client without JavaScript got no Work at all and
				    the first row's image preload never reached the HTML. */}
				<div className="work-filter">
					{kinds.length > 1 && (
						<Suspense fallback={<div className={FILTER_NAV_BOX} />}>
							<WorkFilter kinds={kinds} />
						</Suspense>
					)}
					<WorkList entries={entries} />
				</div>
			</div>
		</div>
	)
}
