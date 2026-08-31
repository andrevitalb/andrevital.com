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
 * The career as one continuous line (U3). Before this it was six rows each closed
 * by its own full-width hairline, which is a table: fourteen years rendered as
 * repeated separators, with the rules carrying more weight than the roles.
 *
 * `data-spine` draws a single hairline down the left edge for the full height of
 * the list, and it draws itself in on scroll, which is the logo's stroke-drawing
 * language at list scale. See app/globals.css. The rows keep the 11rem grid that
 * docs/design.md documents as the directory row and simply stop being fenced.
 */
export function CvTimeline({ entries }: { entries: Experience[] }) {
	return (
		<ul
			data-spine
			className="m-0 grid list-none gap-10 p-0 pl-6 min-[640px]:pl-8"
		>
			{entries.map((entry) => (
				<li
					key={`${entry.company}-${entry.start.year}-${entry.start.month}`}
					className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 min-[640px]:grid-cols-[11rem_minmax(0,1fr)]"
				>
					<span className="font-mono text-fg-2 text-meta tabular-nums">
						{formatPeriod(entry, "short")}
					</span>
					<div>
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
					</div>
				</li>
			))}
		</ul>
	)
}
