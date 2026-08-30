import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DemoFrame } from "@/components/craft/DemoFrame"
import { Prose } from "@/components/writing/Prose"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { formatDate, pageMetadata } from "@/lib/site"

const site = getSite()

type PageProps = { params: Promise<{ slug: string }> }

// KTD10: only the slugs listed here exist in the build. `dynamicParams = false`
// is what makes that true rather than aspirational -- with the default, a draft
// or hidden-section slug would still be rendered on demand at request time.
export const dynamicParams = false

export function generateStaticParams() {
	if (!isVisible("craft")) return []
	return getAll("craft").map((piece) => ({ slug: piece.slug }))
}

function findPiece(slug: string) {
	if (!isVisible("craft")) return undefined
	return getAll("craft").find((piece) => piece.slug === slug)
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params
	const piece = findPiece(slug)
	if (!piece) return {}

	return pageMetadata(`/craft/${slug}`, {
		siteName: site.name,
		title: piece.title,
		description: piece.summary,
	})
}

export default async function CraftPiecePage({ params }: PageProps) {
	const { slug } = await params
	const piece = findPiece(slug)
	if (!piece) notFound()

	return (
		<article className="mx-auto max-w-wide px-gutter py-section">
			<header className="max-w-measure">
				<p className="font-mono text-fg-2 text-meta uppercase">
					<time dateTime={piece.date.toISOString()}>
						{formatDate(piece.date)}
					</time>
					{piece.tags.map((tag) => (
						<span key={tag}>
							{" · "}
							{tag}
						</span>
					))}
				</p>
				<h1 className="mt-3 font-medium text-display leading-[1.1] tracking-[-0.025em]">
					{piece.title}
				</h1>
				<p className="mt-4 text-fg-2 text-h2">{piece.summary}</p>
			</header>

			{piece.demo && (
				<div className="mt-10">
					<DemoFrame demo={piece.demo} title={piece.title} />
				</div>
			)}

			<div className="mt-10">
				<Prose source={piece.content} />
			</div>

			{piece.source && (
				<p className="mt-10 text-small">
					<a
						href={piece.source}
						className="font-mono text-fg-2 text-meta uppercase underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
					>
						Source
					</a>
				</p>
			)}
		</article>
	)
}
