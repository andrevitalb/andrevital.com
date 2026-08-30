import Image from "next/image"
import Link from "next/link"
import type { Work } from "@/lib/schemas"

export const KIND_LABEL = {
	client: "Client",
	personal: "Personal",
	tool: "Tool",
} as const

// R13: the summary card. The hero is decorative here, the link's own text names
// the entry, so alt is empty rather than a duplicate of the title.
//
// `priority` on the first card only: lazy-loading it made the hero the page's
// Largest Contentful Paint and delayed its discovery until after hydration,
// which cost 2.9s LCP and a Lighthouse performance 95. Every card below it
// stays lazy.
export function WorkCard({
	entry,
	priority = false,
}: {
	entry: Work
	priority?: boolean
}) {
	return (
		<Link
			href={`/work/${entry.slug}`}
			className="group grid gap-3 focus-visible:outline-none"
		>
			<div className="overflow-hidden rounded-md border border-line bg-bg-2">
				<Image
					src={entry.hero}
					alt=""
					width={1200}
					height={630}
					sizes="(min-width: 760px) 30rem, 100vw"
					priority={priority}
					className="aspect-[16/9] w-full object-cover transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:scale-[1.02]"
				/>
			</div>
			<div>
				<h2 className="font-medium text-fg text-h3 underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-[var(--duration-fast)] group-hover:decoration-accent group-focus-visible:decoration-accent">
					{entry.title}
				</h2>
				<p className="mt-1 max-w-measure text-fg-2 text-small">
					{entry.summary}
				</p>
				<p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-fg-2 text-meta uppercase">
					<span>{KIND_LABEL[entry.kind]}</span>
					<span>{entry.period}</span>
				</p>
			</div>
		</Link>
	)
}
