// Lifted out of Nav in U4b. It has to be the first focusable element in the
// document, and the bar it used to live in is no longer first: above lg the
// sidebar is, and below lg the bar is. Rendering it in app/layout.tsx is what
// keeps it ahead of both.
export function SkipLink() {
	return (
		<a
			href="#main"
			className="fixed top-2 left-2 z-50 -translate-y-[calc(100%+0.5rem)] rounded-sm bg-bg-2 px-3 py-2 text-fg text-small focus:translate-y-0"
		>
			Skip to content
		</a>
	)
}
