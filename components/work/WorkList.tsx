import type { CSSProperties } from "react"
import { WorkCard } from "@/components/work/WorkCard"
import type { Work } from "@/lib/schemas"

export function WorkList({ entries }: { entries: Work[] }) {
	if (entries.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-16">
			{entries.map((entry, index) => (
				<li
					key={entry.slug}
					data-kind={entry.kind}
					style={{ "--row-name": `work-${entry.slug}` } as CSSProperties}
				>
					<WorkCard entry={entry} priority={index === 0} />
				</li>
			))}
		</ul>
	)
}
