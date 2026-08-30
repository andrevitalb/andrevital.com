"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { KIND_LABEL } from "@/components/work/WorkCard"
import { WorkList } from "@/components/work/WorkList"
import type { Work } from "@/lib/schemas"

// R12: client and personal before tool, each group keeping getAll's date order.
const KIND_ORDER = ["client", "personal", "tool"] as const

export function sortByDefaultOrder(entries: Work[]): Work[] {
	return [...entries].sort(
		(a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
	)
}

/**
 * The list is rendered whole and filtered in the browser: the entries are the
 * same handful on every request, so filtering them here keeps /work a static
 * page instead of making it dynamic to read one search param on the server.
 * An unknown ?tag= falls through to the full list rather than an empty one.
 */
export function WorkFilter({ entries }: { entries: Work[] }) {
	const tag = useSearchParams().get("tag")
	const ordered = sortByDefaultOrder(entries)
	const kinds = KIND_ORDER.filter((kind) =>
		ordered.some((entry) => entry.kind === kind),
	)
	const active = kinds.find((kind) => kind === tag)
	const shown = active
		? ordered.filter((entry) => entry.kind === active)
		: ordered

	return (
		<>
			{kinds.length > 1 && (
				<nav aria-label="Filter by kind" className="mb-10 flex gap-4">
					{[undefined, ...kinds].map((kind) => (
						<Link
							key={kind ?? "all"}
							href={kind ? `/work?tag=${kind}` : "/work"}
							aria-current={active === kind ? "true" : undefined}
							className={`font-mono text-meta uppercase underline decoration-1 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent ${
								active === kind
									? "text-fg decoration-accent"
									: "text-fg-2 decoration-line"
							}`}
						>
							{kind ? KIND_LABEL[kind] : "All"}
						</Link>
					))}
				</nav>
			)}
			<WorkList entries={shown} />
		</>
	)
}
