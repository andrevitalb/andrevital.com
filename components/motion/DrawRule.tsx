"use client"

import { motion, useReducedMotion } from "motion/react"
import { duration, easing } from "@/lib/motion"

/**
 * A hairline that draws itself in when it scrolls into view. This is the logo's
 * stroke-drawing language at rule scale, which is what stops the choreography
 * being a one-off intro and makes it the site's vocabulary.
 *
 * scaleX rather than width: width is a layout property, so animating it forces
 * layout on every frame.
 */
export function DrawRule({ className }: { className?: string }) {
	const reduce = useReducedMotion()

	return (
		<motion.hr
			className={["border-line border-t", className].filter(Boolean).join(" ")}
			style={{ transformOrigin: "left" }}
			initial={reduce ? false : { scaleX: 0 }}
			whileInView={{ scaleX: 1 }}
			viewport={{ once: true, amount: 1 }}
			transition={{
				duration: duration("--duration-draw"),
				ease: easing("--ease-out-expo"),
			}}
		/>
	)
}
