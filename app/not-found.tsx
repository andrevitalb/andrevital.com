import Link from "next/link"

// Also serves hidden-section routes (R24), so this must read as a generic
// 404 and never hint that a hidden section exists behind the route.
export default function NotFound() {
	return (
		<div className="mx-auto max-w-measure px-gutter py-section">
			<h1 className="font-medium text-display tracking-[-0.025em]">Whoops,</h1>
			<p className="mt-4 text-fg-2 text-h2">
				I haven&apos;t actually coded this one, my bad :(
			</p>
			<p className="mt-8">
				<Link
					href="/"
					className="text-accent underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:underline"
				>
					Go back home
				</Link>
			</p>
		</div>
	)
}
