"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { introTiming, LogoDraw } from "@/components/logo/LogoDraw"
import { LOGO_LAYOUT_ID, useIntro } from "@/components/logo/LogoIntro"
import { LogoMark } from "@/components/logo/LogoMark"

// docs/design.md: 1.75rem is the mark's docked height, so it is what the full
// intro animates into and what every other state renders at. A height plus the
// aspect, never `size-*`: the viewBox is landscape now, so a square box would
// letterbox the mark back down to the size it used to look.
//
// Taller on mobile, where the bar carries the mark and two controls rather than
// the mark and five links, so there is room for it to read properly.
const SIZE = "h-9 aspect-logo sm:h-7"

export type NavLogoSlot = "bar" | "sidebar"

// Tailwind's lg. The sidebar is the shell from here up and the bar is gone.
const DESKTOP = "(min-width: 64rem)"

/**
 * Which shell is actually painted.
 *
 * Both marks are mounted at every viewport, because the two shells are swapped
 * with CSS rather than with conditional rendering, and `display: none` does not
 * unmount anything. So the live one has to be chosen at runtime, and it owns two
 * things that cannot exist twice in a document:
 *
 * - `LOGO_LAYOUT_ID`. Two nodes sharing one layoutId makes motion resolve the
 *   dock against the first, which above lg is the hidden bar: the intro's mark
 *   flies into a display:none box and the sidebar's slot holds empty. Measured on
 *   the spike at 38x28, with a clean console and no failing test.
 * - `id="site-logo"`. A duplicate DOM id is invalid, and the three e2e cases that
 *   read the mark's fill and stroke through `#site-logo` would silently start
 *   measuring whichever copy is not on screen.
 *
 * Null until the effect runs, which means neither slot owns either during SSR and
 * the first client render. That is correct rather than merely tolerable: the dock
 * happens roughly two seconds in, and a mark rendered before the media query is
 * read must not claim to be the one on screen.
 */
function useLiveSlot(): NavLogoSlot | null {
	const [slot, setSlot] = useState<NavLogoSlot | null>(null)

	useEffect(() => {
		const query = window.matchMedia(DESKTOP)
		const read = () => setSlot(query.matches ? "sidebar" : "bar")

		read()
		query.addEventListener("change", read)
		return () => query.removeEventListener("change", read)
	}, [])

	return slot
}

export function NavLogo({ slot }: { slot: NavLogoSlot }) {
	const { mode, docked, skipped } = useIntro()
	const reducedMotion = useReducedMotion()
	const isLive = useLiveSlot() === slot
	const id = isLive ? "site-logo" : undefined

	// SSR and the first client render: the plain mark, so the logo is there with no
	// JavaScript at all. Once the intro script has run, CSS hides this copy until
	// hydration decides what to do with it (see app/globals.css).
	if (mode === null) {
		return (
			<span data-logo-pending className={`block ${SIZE}`}>
				<LogoMark id={id} className="size-full" />
			</span>
		)
	}

	if (mode === "full") {
		// The overlay owns the mark until it docks; hold the slot so the bar is stable
		// and the dock has a fixed target to animate into.
		if (!docked) return <span className={`block ${SIZE}`} />

		if (!skipped) {
			// Only the live slot carries the layoutId. The other renders the same
			// mark, at the same size, with nothing for the dock to land on.
			return isLive ? (
				<motion.div
					layoutId={LOGO_LAYOUT_ID}
					className={SIZE}
					transition={{
						duration: introTiming().dock,
						ease: introTiming().dockEase,
					}}
				>
					<LogoDraw id={id} className="size-full" draw={false} />
				</motion.div>
			) : (
				<div className={SIZE}>
					<LogoDraw className="size-full" draw={false} />
				</div>
			)
		}
	}

	// R8: on a return visit the mark draws in place. R9: reduced motion never draws.
	if (mode === "inline" && !reducedMotion) {
		return <LogoDraw id={id} className={SIZE} duration={introTiming().inline} />
	}

	return <LogoMark id={id} className={SIZE} />
}
