import type { ReactNode } from "react"

/*
 * A template, not a layout: Next remounts this on every navigation, which is
 * what replays the enter animation per route. A layout persists and would only
 * animate once, on the first paint.
 *
 * Server component. The animation is CSS keyed on the data attribute, so route
 * transitions cost no client JavaScript, and with JS disabled the page simply
 * renders with no animation rather than losing anything.
 */
export default function Template({ children }: { children: ReactNode }) {
	return <div data-route-enter>{children}</div>
}
