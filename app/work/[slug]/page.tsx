import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { WorkHeader } from "@/components/work/WorkHeader"
import { Prose } from "@/components/writing/Prose"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { pageMetadata } from "@/lib/site"

const site = getSite()

type PageProps = { params: Promise<{ slug: string }> }

// KTD10: only the slugs listed here exist in the build. `dynamicParams = false`
// is what makes that true rather than aspirational -- with the default, a draft
// or hidden-section slug would still be rendered on demand at request time.
export const dynamicParams = false

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
