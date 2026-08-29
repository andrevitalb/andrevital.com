"use client"

import { motion, useReducedMotion } from "motion/react"
import { introTiming, LogoDraw } from "@/components/logo/LogoDraw"
import { LOGO_LAYOUT_ID, useIntro } from "@/components/logo/LogoIntro"
import { LogoMark } from "@/components/logo/LogoMark"

// docs/design.md: 1.75rem is the mark's docked size, so it is what the full intro
// animates into and what every other state renders at.
const SIZE = "size-7"

export function NavLogo() {
	const { mode, docked, skipped } = useIntro()
	const reducedMotion = useReducedMotion()

	// SSR and the first client render: the plain mark, so the logo is there with no
	// JavaScript at all. Once the intro script has run, CSS hides this copy until
	// hydration decides what to do with it (see app/globals.css).
	if (mode === null) {
		return (
			<span data-logo-pending className={`block ${SIZE}`}>
				<LogoMark id="site-logo" className="size-full" />
			</span>
		)
	}

	if (mode === "full") {
		// The overlay owns the mark until it docks; hold the slot so the bar is stable
		// and the dock has a fixed target to animate into.
		if (!docked) return <span className={`block ${SIZE}`} />

		if (!skipped) {
			return (
				<motion.div
					layoutId={LOGO_LAYOUT_ID}
					className={SIZE}
					transition={{
						duration: introTiming().dock,
						ease: introTiming().dockEase,
					}}
				>
					<LogoDraw id="site-logo" className="size-full" draw={false} />
				</motion.div>
			)
		}
	}

	// R8: on a return visit the mark draws in place. R9: reduced motion never draws.
	if (mode === "inline" && !reducedMotion) {
		return (
			<LogoDraw
				id="site-logo"
				className={SIZE}
				duration={introTiming().inline}
			/>
		)
	}

	return <LogoMark id="site-logo" className={SIZE} />
}
