import { WorkCard } from "@/components/work/WorkCard"
import type { Work } from "@/lib/schemas"

export function WorkList({ entries }: { entries: Work[] }) {
	if (entries.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-10 min-[760px]:grid-cols-2">
			{/* priority on the first row of the unfiltered list, which is what a
			    visitor arriving at /work sees. On a filtered deep link the preload
			    can land on a row the filter then hides; that costs one small image
			    and is the price of filtering in CSS over re-rendering the list. */}
			{entries.map((entry, index) => (
				// data-kind is what the filter rule in app/globals.css hides on. The
				// row carries it rather than the card so the grid cell goes with it.
				<li key={entry.slug} data-kind={entry.kind}>
					<WorkCard entry={entry} priority={index === 0} />
				</li>
			))}
		</ul>
	)
}
