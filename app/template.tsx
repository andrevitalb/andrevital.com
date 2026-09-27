import type { ReactNode } from "react"

/*
 * A template, not a layout: Next remounts this on every navigation, which is
 * what replays the enter animation per route. A layout persists and would only
 * animate once, on the first paint.
 *
 * Server component. The animation is CSS keyed on the data attributes, so route
 * transitions cost no client JavaScript, and with JS disabled the page simply
 * renders with no animation rather than losing anything.
 *
 * The curtain and its edge are siblings of the page, fixed to the viewport, so
 * the wipe never depends on how far down the page the router restored scroll.
 */
export default function Template({ children }: { children: ReactNode }) {
	return (
		<>
			<div data-route-enter>{children}</div>
			<div data-route-curtain aria-hidden="true" />
			<div data-route-edge aria-hidden="true" />
		</>
	)
}
