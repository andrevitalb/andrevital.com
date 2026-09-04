import { TextLink } from "@/components/ui/Link"
import { type Experience, formatPeriod, parseEmphasis } from "@/lib/cv"

function Bullet({ text }: { text: string }) {
	return (
		<li>
			{parseEmphasis(text).map((span, index) =>
				span.bold ? (
					<strong
						// Spans have no identity beyond their position in one fixed string.
						// biome-ignore lint/suspicious/noArrayIndexKey: index is the identity
						key={index}
						className="font-medium text-fg"
					>
						{span.text}
					</strong>
				) : (
					// biome-ignore lint/suspicious/noArrayIndexKey: index is the identity
					<span key={index}>{span.text}</span>
				),
			)}
		</li>
	)
}

/*
 * The career as one continuous line, with the periods hanging to its left. The
 * rail is --spacing-rail, the same column the directory grid uses, so the dates
 * land where every other page's metadata does.
 *
 * This component owns the page's only [data-spine] as of the About rework;
 * tests/e2e/pages.spec.ts asserts there is exactly one.
 */
export function CvTimeline({ entries }: { entries: Experience[] }) {
	return (
		<div
			data-spine
			className="pl-6 min-[760px]:ml-rail min-[760px]:pl-8"
		>
			<ul className="m-0 grid list-none gap-14 p-0">
				{entries.map((entry) => (
					<li
						key={`${entry.company}-${entry.start.year}-${entry.start.month}`}
						className="group relative"
					>
						{/* Right-aligned against the spine: the date's right edge is the
						    line, which is what makes the rail read as one column. */}
						<span className="mb-2 block font-mono text-fg-2 text-meta tabular-nums transition-colors duration-(--duration-fast) group-hover:text-fg min-[760px]:absolute min-[760px]:right-[calc(100%+2rem)] min-[760px]:mb-0 min-[760px]:w-rail min-[760px]:text-right">
							{formatPeriod(entry, "short")}
						</span>

						{/* A tick crossing the spine on hover, at the mark's own accent. */}
						<span
							aria-hidden
							className="hidden origin-left scale-x-0 bg-accent transition-transform duration-(--duration-fast) group-hover:scale-x-100 min-[760px]:absolute min-[760px]:-left-8 min-[760px]:top-[0.65rem] min-[760px]:block min-[760px]:h-px min-[760px]:w-4"
						/>

						<h3 className="font-medium text-h3 leading-[1.3] tracking-[-0.008em]">
							{entry.position},{" "}
							{entry.url ? (
								<TextLink href={entry.url} external>
									{entry.company}
								</TextLink>
							) : (
								entry.company
							)}
						</h3>
						<p className="mt-0.5 text-fg-2 text-small">{entry.location}</p>
						<ul className="mt-3 grid list-disc gap-1.5 pl-[1.1rem] text-fg-2 text-small">
							{entry.bullets.map((bullet) => (
								<Bullet key={bullet} text={bullet} />
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}
