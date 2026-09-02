// The site's one copyright line, since U4b deletes the footer. It renders in the
// sidebar above lg and at the foot of the mobile sheet below sm, so the fact
// survives at both shells and belongs to neither.
//
// The rule sits above it and there is none under it: the byline is the last thing
// in its column, so a second rule would be closing a section that has already
// ended.
export function NavByline({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("")

	return (
		<p className="border-line border-t pt-4 font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
			{initials} @ {new Date().getFullYear()}
		</p>
	)
}
