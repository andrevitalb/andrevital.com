import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WorkFacts, WorkHeader, WorkHero } from "@/components/work/WorkHeader"
import { Prose } from "@/components/writing/Prose"
import { getAll, getSite } from "@/lib/content"
import { DIRECTORY_GRID } from "@/lib/layout"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"

const site = getSite()

type PageProps = { params: Promise<{ slug: string }> }

// No `dynamicParams = false` here: it answered an unlisted slug with the
// not-found HTML while the client router still resolved this segment, so every
// unmatched entry URL threw a hydration mismatch and re-rendered (React #418).
// The lookup below 404s the same slugs through the same filter, and the build
// output still carries no route for them.

export function generateStaticParams() {
	if (!isVisible("work")) return []
	return getAll("work").map((entry) => ({ slug: entry.slug }))
}

function findEntry(slug: string) {
	if (!isVisible("work")) return undefined
	return getAll("work").find((entry) => entry.slug === slug)
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params
	const entry = findEntry(slug)
	if (!entry) return {}

	return pageMetadata(`/work/${slug}`, {
		siteName: site.name,
		title: entry.title,
		description: entry.summary,
	})
}

export default async function WorkEntryPage({ params }: PageProps) {
	const { slug } = await params
	const entry = findEntry(slug)
	if (!entry) notFound()

	return (
		// Header first in the document, so the h1 leads on every width; the grid
		// lifts the facts into the rail beside it from 760px.
		<article
			className={`mx-auto grid max-w-wide gap-x-10 gap-y-10 px-gutter py-section ${DIRECTORY_GRID}`}
		>
			<div className="min-[760px]:col-start-2">
				<WorkHeader entry={entry} />
			</div>
			<div className="min-[760px]:col-start-1 min-[760px]:row-span-3 min-[760px]:row-start-1 min-[760px]:border-line min-[760px]:border-r min-[760px]:pr-8">
				<WorkFacts entry={entry} />
			</div>
			<div className="min-[760px]:col-start-2">
				<WorkHero entry={entry} />
			</div>
			<div className="min-[760px]:col-start-2">
				<Prose source={entry.content} />
			</div>
		</article>
	)
}
