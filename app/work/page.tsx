import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { WorkFilter } from "@/components/work/WorkFilter"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"

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

	const entries = getAll("work")

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">Work</h1>
				<p className="mt-4 text-fg-2 text-h2">
					Products, prototypes and tools, most of them shipped with a team.
				</p>
			</div>

			<div className="mt-12">
				{/* useSearchParams reads a value that only exists at request time, so
				    without a boundary it would opt the whole page out of static
				    rendering. Inside one, the shell is prerendered and only the
				    filter waits for the URL. */}
				<Suspense fallback={null}>
					<WorkFilter entries={entries} />
				</Suspense>
			</div>
		</div>
	)
}
