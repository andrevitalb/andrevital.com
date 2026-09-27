import type { ReactNode } from "react"
import { DIRECTORY_GRID } from "@/lib/layout"

/**
 * A Work entry and a Craft piece: the facts down a rail on the left, the title
 * and everything after it in the wide column. The header comes first in the
 * document, so the h1 leads at every width; from 760px the grid lifts the rail
 * beside it and the rail's own edge is the page's spine.
 */
export function EntryLayout({
	header,
	rail,
	children,
}: {
	header: ReactNode
	rail: ReactNode
	children: ReactNode
}) {
	return (
		<article
			className={`mx-auto grid max-w-wide gap-10 px-gutter py-section ${DIRECTORY_GRID}`}
		>
			<div className="min-[760px]:col-start-2">{header}</div>
			<div className="min-[760px]:col-start-1 min-[760px]:row-span-2 min-[760px]:row-start-1 min-[760px]:border-line min-[760px]:border-r min-[760px]:pr-8">
				<div className="grid content-start gap-8 min-[760px]:sticky min-[760px]:top-12">
					{rail}
				</div>
			</div>
			<div className="grid content-start gap-10 min-[760px]:col-start-2">
				{children}
			</div>
		</article>
	)
}

export function RailFacts({
	facts,
}: {
	facts: { label: string; value: ReactNode }[]
}) {
	return (
		<dl className="grid grid-cols-2 gap-x-8 gap-y-6 min-[760px]:grid-cols-1">
			{facts.map((fact) => (
				<div key={fact.label}>
					<dt className="font-mono text-fg-2 text-meta uppercase tracking-widest">
						{fact.label}
					</dt>
					<dd className="mt-1 text-fg text-small">{fact.value}</dd>
				</div>
			))}
		</dl>
	)
}

export function EntryTitle({
	title,
	summary,
}: {
	title: string
	summary: string
}) {
	return (
		<header className="max-w-measure">
			<h1 className="font-medium text-display leading-[1.05] tracking-tight">
				{title}
			</h1>
			<p className="mt-6 text-body text-fg-2">{summary}</p>
		</header>
	)
}
