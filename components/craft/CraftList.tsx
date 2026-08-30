import Link from "next/link"
import type { Craft } from "@/lib/schemas"

// R16: title and a one-line description per piece, newest first (getAll's order).
// The demo itself lives on the piece page: with a handful of pieces the list is
// a short index, and putting every demo here would mount them all on one page.
export function CraftList({ pieces }: { pieces: Craft[] }) {
	if (pieces.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-px bg-line">
			{pieces.map((piece) => (
				<li key={piece.slug} className="bg-bg">
					<Link
						href={`/craft/${piece.slug}`}
						className="group grid gap-1 py-6 transition-colors duration-[var(--duration-fast)]"
					>
						<span className="font-medium text-fg text-h3 underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-[var(--duration-fast)] group-hover:decoration-accent">
							{piece.title}
						</span>
						<span className="max-w-measure text-fg-2 text-small">
							{piece.summary}
						</span>
						{piece.tags.length > 0 && (
							<span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-fg-2 text-meta uppercase">
								{piece.tags.map((tag) => (
									<span key={tag}>{tag}</span>
								))}
							</span>
						)}
					</Link>
				</li>
			))}
		</ul>
	)
}
