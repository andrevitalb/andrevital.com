import { FILTER_NAV_BOX, WorkFilter } from "@/components/work/WorkFilter"
import { WorkList } from "@/components/work/WorkList"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"
import { kindsPresent, sortByDefaultOrder } from "@/lib/work"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

const site = getSite()

export function generateMetadata(): Metadata {
	if (!isVisible("work")) return {}

	return pageMetadata("/work", {
		siteName: site.name,
		title: "Work",
		description: `Client, personal and tool projects built by ${site.name}.`,
	})
}

export default function WorkPage() {
	if (!isVisible("work")) notFound()

	const entries = sortByDefaultOrder(getAll("work"))
	const kinds = kindsPresent(entries)

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<h1 className="mb-10 pl-12 font-mono text-fg-2 text-meta uppercase tracking-[0.12em] min-[760px]:pl-6">
				Work
			</h1>

			<div className="work-filter grid pl-6 min-[760px]:grid-cols-[10rem_minmax(0,1fr)]">
				{kinds.length > 1 && (
					<Suspense fallback={<div className={FILTER_NAV_BOX} />}>
						<WorkFilter kinds={kinds} />
					</Suspense>
				)}
				<div data-spine className="pl-6">
					<WorkList entries={entries} />
				</div>
			</div>
		</div>
	)
}
