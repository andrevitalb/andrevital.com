import Link from "next/link"
import { DIRECTORY_GRID } from "@/lib/layout"
import type { Post } from "@/lib/schemas"
import { formatDate } from "@/lib/site"

// The ordinal is positional and computed here, never stored: drafts are dropped
// in production and kept in development, so a number in front matter would leave
// gaps in the published list.
export function PostList({ posts }: { posts: Post[] }) {
	if (posts.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-24">
			{posts.map((post, index) => (
				<li key={post.slug}>
					<Link
						href={`/writing/${post.slug}`}
						className={`group grid gap-x-8 gap-y-6 focus-visible:outline-none ${DIRECTORY_GRID}`}
					>
						<div className="flex flex-row justify-between gap-4 font-mono text-fg-2 text-meta uppercase tracking-widest tabular-nums min-[760px]:flex-col min-[760px]:justify-start min-[760px]:border-line min-[760px]:border-r min-[760px]:pr-8">
							<time dateTime={post.date.toISOString()}>
								{formatDate(post.date)}
							</time>
							<span data-post-ordinal>
								[ {String(posts.length - index).padStart(2, "0")} ]
							</span>
						</div>

						<div>
							<span
								data-post-title
								className="block break-words font-medium text-[clamp(2.5rem,1.2rem+4.5vw,5rem)] text-fg leading-[0.9] tracking-[-0.025em] transition-colors duration-(--duration-fast) group-focus-visible:text-accent group-hover:text-accent"
							>
								{post.title}
							</span>

							<div className="mt-8 flex flex-col gap-6 border-line border-t pt-6 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
								<p className="max-w-measure text-body text-fg-2">
									{post.summary}
								</p>
								{post.tags.length > 0 && (
									<p className="flex shrink-0 gap-4 font-mono text-fg-2 text-meta uppercase tracking-widest">
										{post.tags.map((tag) => (
											<span key={tag}>#{tag}</span>
										))}
									</p>
								)}
							</div>
						</div>
					</Link>
				</li>
			))}
		</ul>
	)
}
