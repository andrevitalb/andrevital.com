import Link from "next/link"
import { CutLine } from "@/components/motion/CutLine"
import { DIRECTORY_GRID } from "@/lib/layout"
import type { Craft } from "@/lib/schemas"
import { formatDate } from "@/lib/site"

// R16: the demo itself lives on the piece page. Mounting every demo here would
// run them all on one page; the stage says the piece moves without running it.
export function CraftList({ pieces }: { pieces: Craft[] }) {
	if (pieces.length === 0) {
		return <p className="text-fg-2">Nothing published yet.</p>
	}

	return (
		<ul className="grid gap-32">
			{pieces.map((piece, index) => (
				<li key={piece.slug}>
					<Link
						href={`/craft/${piece.slug}`}
						className="group grid gap-6 focus-visible:outline-none"
					>
						<div
							className={`grid items-baseline gap-x-8 gap-y-2 border-line border-t pt-6 ${DIRECTORY_GRID}`}
						>
							<time
								dateTime={piece.date.toISOString()}
								className={`font-mono text-meta uppercase tracking-widest ${
									index === 0 ? "text-accent" : "text-fg-2"
								}`}
							>
								{formatDate(piece.date)}
							</time>
							<div className="grid gap-3">
								<h2 className="font-medium text-fg text-h2 tracking-tight transition-colors duration-(--duration-base) group-focus-visible:text-accent group-hover:text-accent">
									{piece.title}
								</h2>
								<p className="max-w-measure text-body text-fg-2">
									{piece.summary}
								</p>
							</div>
						</div>

						<div className="relative aspect-video w-full border border-line bg-bg-2">
							<CutLine over />
						</div>

						{piece.tags.length > 0 && (
							<p className="font-mono text-fg-2 text-meta uppercase tracking-widest">
								{piece.tags.join(" / ")}
							</p>
						)}
					</Link>
				</li>
			))}
		</ul>
	)
}
