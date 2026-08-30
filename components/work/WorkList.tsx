import { WorkCard } from "@/components/work/WorkCard"
import type { Work } from "@/lib/schemas"

export function WorkList({ entries }: { entries: Work[] }) {
	if (entries.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-10 min-[760px]:grid-cols-2">
			{entries.map((entry, index) => (
				<li key={entry.slug}>
					<WorkCard entry={entry} priority={index === 0} />
				</li>
			))}
		</ul>
	)
}
