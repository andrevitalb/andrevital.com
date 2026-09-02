"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Closes the sheet when the route changes.
 *
 * The sheet is a native <details> in a server component, and Nav lives in
 * app/layout.tsx, which persists across an App Router navigation. Nothing was
 * setting `open` back to false, so tapping a link navigated the page underneath
 * a sheet that stayed open over it.
 *
 * The bug only exists BECAUSE of client-side routing: with JavaScript off a tap
 * is a full document load and the fresh document's <details> is closed, so a
 * no-JS visitor never saw it. That is also why fixing it with client JavaScript
 * costs the no-JS contract nothing. The sheet still opens, closes and navigates
 * with no script at all; this only cleans up after the router.
 *
 * Keyed on the pathname rather than on each link's onClick, so it also covers
 * back and forward, which move the route with no click on anything in here.
 *
 * NOT a client boundary around NavSheet itself. The sheet stays a server
 * component with no props crossing, which is what keeps the navigation itself
 * free of client JavaScript and unable to have a dead control.
 *
 * usePathname is read as an effect dependency and never rendered. The Next docs
 * warn that rendering it can hydrate-mismatch in an app with rewrites in
 * next.config, which this one has (lib/rewrites.ts hides the flagged-off
 * sections). Nothing here derives markup from it, so there is nothing to
 * mismatch.
 */
export function NavSheetAutoClose() {
	const pathname = usePathname()
	const anchor = useRef<HTMLSpanElement>(null)

	// The body reads nothing from pathname, so the rule sees the dependency as
	// unnecessary. Dropping it runs this once on mount and never closes the sheet
	// again, which is the bug itself; interaction.spec.ts holds that.
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not an input
	useEffect(() => {
		const details = anchor.current?.closest("details")
		if (details) details.open = false
	}, [pathname])

	return <span ref={anchor} hidden />
}
