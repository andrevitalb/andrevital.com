import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DemoFrame } from "@/components/craft/DemoFrame"
import {
	EntryLayout,
	EntryTitle,
	RailFacts,
} from "@/components/layout/EntryLayout"
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

	const facts = [
		{
			label: "Date",
			value: (
				<time dateTime={piece.date.toISOString()}>
					{formatDate(piece.date)}
				</time>
			),
		},
		...(piece.tags.length > 0
			? [
					{
						label: "Tags",
						value: (
							<span className="grid gap-1 font-mono text-meta uppercase">
								{piece.tags.map((tag) => (
									<span key={tag}>{tag}</span>
								))}
							</span>
						),
					},
				]
			: []),
	]

	return (
		<EntryLayout
			header={<EntryTitle title={piece.title} summary={piece.summary} />}
			rail={<RailFacts facts={facts} />}
		>
			{piece.demo && <DemoFrame demo={piece.demo} title={piece.title} />}
			<Prose source={piece.content} />
			{piece.source && (
				<p className="max-w-measure border-line border-t pt-8">
					<TextLink
						href={piece.source}
						external
						className="font-mono text-meta uppercase"
					>
						Source
					</TextLink>
				</p>
			)}
		</EntryLayout>
	)
}
