import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
	if (!isVisible("writing")) return []
	return getAll("writing").map((post) => ({ slug: post.slug }))
}

function findPost(slug: string) {
	if (!isVisible("writing")) return undefined
	return getAll("writing").find((post) => post.slug === slug)
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params
	const post = findPost(slug)
	if (!post) return {}

	return pageMetadata(`/writing/${slug}`, {
		siteName: site.name,
		title: post.title,
		description: post.summary,
		publishedTime: post.date.toISOString(),
	})
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params
	const post = findPost(slug)
	if (!post) notFound()

	return (
		<article className="mx-auto max-w-wide px-gutter py-section">
			<header className="max-w-measure">
				<p className="font-mono text-fg-2 text-meta uppercase">
					<time dateTime={post.date.toISOString()}>
						{formatDate(post.date)}
					</time>
					{post.tags.map((tag) => (
						<span key={tag}>
							{" · "}
							{tag}
						</span>
					))}
				</p>
				<h1 className="mt-3 font-medium text-display leading-[1.1] tracking-[-0.025em]">
					{post.title}
				</h1>
				<p className="mt-4 text-fg-2 text-h2">{post.summary}</p>
			</header>

			<hr className="mt-10 max-w-measure border-line" />

			<div className="mt-10">
				<Prose source={post.content} />
			</div>
		</article>
	)
}
