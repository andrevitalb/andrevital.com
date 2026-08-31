import type { Metadata } from "next"
import { CutLine } from "@/components/motion/CutLine"
import { TextLink } from "@/components/ui/Link"

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
		<div className="mx-auto flex min-h-[calc(100svh-var(--nav-height))] max-w-wide flex-col items-center justify-center px-gutter py-section text-center">
			{/*
			 * The mark fails to assemble. It is `</>` rotated 90 degrees, drawn stroke
			 * by stroke and then cut by a diagonal; here the glyph has slipped apart
			 * along that cut. Two copies of the figures, each clipped to one side of
			 * the line and pushed along it in opposite directions. See app/globals.css
			 * for the geometry, which is derived from --cut-rise rather than measured.
			 *
			 * Decoration, so aria-hidden and not the heading. The h1 below is what a
			 * screen reader lands on, and both e2e specs assert that it reads
			 * "Whoops," at more than 24px.
			 */}
			<div data-slip aria-hidden>
				<span data-slip-half="above">404</span>
				<span data-slip-half="below">404</span>
				<CutLine over />
			</div>

			<h1 className="mt-14 font-medium text-display tracking-[-0.025em]">
				Whoops,
			</h1>
			<p className="mt-4 text-fg-2 text-h2">
				I haven&apos;t actually coded this one, my bad :(
			</p>
			<p className="mt-10">
				<TextLink href="/" variant="primary">
					Go back home
				</TextLink>
			</p>
		</div>
	)
}
