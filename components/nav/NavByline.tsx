// The site's one copyright line, since U4b deletes the footer. It renders in the
// sidebar from lg up and at the foot of the mobile sheet below sm, which are the
// two shells that have a foot. The bar between them carries none: a copyright in
// a top bar is a copyright in the wrong place.
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
