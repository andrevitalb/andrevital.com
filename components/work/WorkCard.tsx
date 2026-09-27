import Image from "next/image"
import Link from "next/link"
import { DIRECTORY_GRID } from "@/lib/layout"
import type { Work } from "@/lib/schemas"
import { KIND_LABEL } from "@/lib/work"

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
			className="group grid items-baseline gap-y-8 focus-visible:outline-none"
		>
			<div className={`grid gap-6 ${DIRECTORY_GRID}`}>
				<div className="grid content-start gap-1 font-mono font-light text-fg-2 text-[11px] tracking-widest uppercase">
					<span>{KIND_LABEL[entry.kind]}</span>
					<span>{entry.role}</span>
					<span>{entry.period}</span>
				</div>

				<div className="grid gap-3">
					<h2 className="font-medium text-display text-fg leading-[1.05] tracking-tight underline decoration-2 decoration-transparent underline-offset-[6px] transition-colors duration-(--duration-fast) group-focus-visible:decoration-accent group-hover:decoration-accent">
						{entry.title}
					</h2>
					<p className="max-w-measure text-fg-2 text-small">{entry.summary}</p>
				</div>
			</div>

			<Image
				src={entry.hero}
				alt=""
				width={1200}
				height={630}
				sizes="(min-width: 760px) 49rem, 100vw"
				priority={priority}
				className="aspect-video w-full object-cover"
			/>
		</Link>
	)
}
