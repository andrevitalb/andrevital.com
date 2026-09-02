import Image from "next/image"
import Link from "next/link"
import { DIRECTORY_GRID } from "@/lib/layout"
import type { Work } from "@/lib/schemas"
import { KIND_LABEL } from "@/lib/work"

/*
 * R13: the summary row. It used to be a 30rem thumbnail in a bordered frame, two
 * up, which was never a register violation (--radius-md is sanctioned on media)
 * but was the single most generic shape a portfolio can take. It is the site's
 * directory grid now, the same one About's career and the Writing index use: kind
 * and period in the mono column, the entry itself in the wide one.
 *
 * The frame is gone with it. Both Stitch comps dropped it independently, and an
 * unframed band at the content column's width reads as the work rather than as a
 * thumbnail of the work. docs/design.md records the call.
 *
 * The hero is decorative here: the link's own text names the entry, so alt is
 * empty rather than a duplicate of the title.
 *
 * `priority` on the first row only. Lazy-loading it made the hero the page's
 * Largest Contentful Paint and delayed its discovery until after hydration, which
 * cost 2.9s LCP and a Lighthouse performance 95. Every row below it stays lazy.
 */
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
			className={`group grid items-baseline gap-x-8 gap-y-3 focus-visible:outline-none ${DIRECTORY_GRID}`}
		>
			<div className="grid content-start gap-1 font-mono text-fg-2 text-meta uppercase">
				<span>{KIND_LABEL[entry.kind]}</span>
				<span>{entry.period}</span>
			</div>

			<div className="grid gap-6">
				<div className="grid gap-3">
					<h2 className="font-medium text-display text-fg leading-[1.05] tracking-[-0.025em] underline decoration-2 decoration-transparent underline-offset-[6px] transition-colors duration-[var(--duration-fast)] group-focus-visible:decoration-accent group-hover:decoration-accent">
						{entry.title}
					</h2>
					<p className="max-w-measure text-fg-2 text-small">{entry.summary}</p>
					<p className="font-mono text-fg-2 text-meta uppercase">{entry.role}</p>
				</div>

				{/* The wide column: the page's width less the mono column and its gap. */}
				<Image
					src={entry.hero}
					alt=""
					width={1200}
					height={630}
					sizes="(min-width: 760px) 49rem, 100vw"
					priority={priority}
					className="aspect-[16/9] w-full object-cover"
				/>
			</div>
		</Link>
	)
}
