import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WorkHeader } from "@/components/work/WorkHeader"
import { Prose } from "@/components/writing/Prose"
import { getAll, getSite } from "@/lib/content"
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
		<article className="mx-auto max-w-wide px-gutter py-section">
			<WorkHeader entry={entry} />

			<div className="mt-12">
				<Prose source={entry.content} />
			</div>
		</article>
	)
}
