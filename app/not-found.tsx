import type { Metadata } from "next"
import Link from "next/link"

// No canonical here on purpose: this page serves every unmatched path, so
// there is no single URL for it to claim. noindex keeps it out of search
// results instead (it would otherwise inherit the root layout's "/"
// canonical and description, which is wrong for a 404: see lib/site.ts).
export const metadata: Metadata = {
	title: "Not found",
	robots: {
		index: false,
		follow: false,
	},
}

// Also serves hidden-section routes (R24), so this must read as a generic
// 404 and never hint that a hidden section exists behind the route.
export default function NotFound() {
	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="max-w-measure">
				<h1 className="font-medium text-display tracking-[-0.025em]">
					Whoops,
				</h1>
				<p className="mt-4 text-fg-2 text-h2">
					I haven&apos;t actually coded this one, my bad :(
				</p>
				<p className="mt-8">
					<Link
						href="/"
						className="text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
					>
						Go back home
					</Link>
				</p>
			</div>
		</div>
	)
}
