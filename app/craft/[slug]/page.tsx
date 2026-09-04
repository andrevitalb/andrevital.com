import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DemoFrame } from "@/components/craft/DemoFrame"
import { TextLink } from "@/components/ui/Link"
import { Prose } from "@/components/writing/Prose"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { formatDate, pageMetadata } from "@/lib/site"

const site = getSite()

type PageProps = { params: Promise<{ slug: string }> }

// No `dynamicParams = false` here: it answered an unlisted slug with the
// not-found HTML while the client router still resolved this segment, so every
// unmatched entry URL threw a hydration mismatch and re-rendered (React #418).
// The lookup below 404s the same slugs through the same filter, and the build
// output still carries no route for them.

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
					<TextLink
						href={piece.source}
						external
						className="font-mono text-meta uppercase"
					>
						Source
					</TextLink>
				</p>
			)}
		</article>
	)
}
