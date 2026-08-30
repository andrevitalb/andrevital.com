import Link from "next/link"
import type { Post } from "@/lib/schemas"
import { formatDate } from "@/lib/site"

// R18: title, date and tags, in date order. The ordering itself is getAll's,
// which sorts every collection newest first.
export function PostList({ posts }: { posts: Post[] }) {
	if (posts.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-px bg-line">
			{posts.map((post) => (
				<li key={post.slug} className="bg-bg">
					<Link
						href={`/writing/${post.slug}`}
						className="group grid gap-1 py-6 transition-colors duration-[var(--duration-fast)]"
					>
						<span className="font-medium text-fg text-h3 underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-[var(--duration-fast)] group-hover:decoration-accent">
							{post.title}
						</span>
						<span className="max-w-measure text-fg-2 text-small">
							{post.summary}
						</span>
						<span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-fg-2 text-meta">
							<time dateTime={post.date.toISOString()}>
								{formatDate(post.date)}
							</time>
							{post.tags.map((tag) => (
								<span key={tag} className="uppercase">
									{tag}
								</span>
							))}
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}
