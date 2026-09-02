// The site's one copyright line, since U4b deletes the footer. It renders at the
// foot of the sidebar from lg up and at the foot of the mobile sheet below sm,
// which are the two shells that have a foot. The bar between them carries none: a
// copyright in a top bar is a copyright in the wrong place.
//
// Text only. The rule above it belongs to whichever shell is drawing it, because
// in both it runs the full width of that shell rather than the width of this line,
// and a rule inset from the edges reads as a stray dash rather than as structure.
export function NavByline({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("")

	return (
		<p className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
			{initials} @ {new Date().getFullYear()}
		</p>
	)
}
