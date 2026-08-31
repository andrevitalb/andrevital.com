import Link from "next/link"
import type { Post } from "@/lib/schemas"
import { formatDate } from "@/lib/site"

/*
 * The index is the composition (U3). R18's title, date and tags are unchanged;
 * what changed is the weight they carry. There is one published post, so a list
 * of small stacked rows leaves a single entry floating under a large heading,
 * and that is the same "one template with different strings" problem the audit
 * found, at one page's scale.
 *
 * So the titles run at display scale and the page heading does not: the entries
 * are the visual headline and the h1 is the document heading, the split U2b
 * settled on Home. The metadata sits in the mono column of the same 11rem
 * directory grid About's career uses, against the same drawn spine, with no
 * per-row rule.
 *
 * The ordinal is positional and computed here rather than stored. Drafts are
 * dropped in production and kept in development, so a number carried in front
 * matter would leave gaps in the published list.
 */
export function PostList({ posts }: { posts: Post[] }) {
	if (posts.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul data-spine className="grid gap-14 pl-6 min-[640px]:pl-8">
			{posts.map((post, index) => (
				<li key={post.slug}>
					<Link
						href={`/writing/${post.slug}`}
						className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 min-[640px]:grid-cols-[11rem_minmax(0,1fr)]"
					>
						<span className="grid gap-1 font-mono text-fg-2 text-meta tabular-nums">
							<span>{String(posts.length - index).padStart(2, "0")}</span>
							<time dateTime={post.date.toISOString()}>
								{formatDate(post.date)}
							</time>
						</span>

						<span className="grid gap-3">
							<span
								data-post-title
								className="font-medium text-display text-fg leading-[1.05] tracking-[-0.025em] underline decoration-2 decoration-transparent underline-offset-[6px] transition-colors duration-[var(--duration-fast)] group-hover:decoration-accent"
							>
								{post.title}
							</span>
							<span className="max-w-measure text-fg-2 text-small">
								{post.summary}
							</span>
							<span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-fg-2 text-meta uppercase">
								{post.tags.map((tag) => (
									<span key={tag}>{tag}</span>
								))}
							</span>
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}
