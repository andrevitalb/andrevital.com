"use client"

import { motion } from "motion/react"
import { useId } from "react"
import {
	LOGO_LETTER_FILL,
	LOGO_PARTS,
	LOGO_VIEW_BOX,
	LOGO_WEAVES,
} from "@/components/logo/LogoMark"
import { type Bezier, duration, easing } from "@/lib/motion"

// Draw order from the approved probe: left letterform, right letterform, then the
// diagonal cut (R7). Shares of the total draw time follow the token ratio in
// docs/design.md (600 + 600 + 300ms).
const DRAW_ORDER = [
	{ part: "letter-b", share: 0.4 },
	{ part: "letter-a", share: 0.4 },
	{ part: "cut", share: 0.2 },
] as const

// The stroke only exists while the mark draws itself; it fades out as the fill
// arrives, so the end state matches LogoMark exactly.
const STROKE_WIDTH = 14

export type IntroTiming = {
	draw: number
	pop: number
	dock: number
	inline: number
	dockEase: Bezier
}

let cached: IntroTiming | null = null

/**
 * Timings the intro choreography runs on, in seconds. Read once and kept: the
 * tokens cannot change at runtime, and `getComputedStyle` in a render body forces
 * a synchronous style recalc on every render.
 */
export function introTiming(): IntroTiming {
	if (cached) return cached

	const timing: IntroTiming = {
		draw: duration("--duration-draw") * 2 + duration("--duration-cut"),
		pop: duration("--duration-pop"),
		dock: duration("--duration-dock"),
		inline: duration("--duration-draw-inline"),
		dockEase: easing("--ease-in-out-quart"),
	}
	if (typeof window !== "undefined") cached = timing
	return timing
}

type LogoDrawProps = {
	id?: string
	className?: string
	/** false renders the finished mark with no animation (post-dock, post-skip). */
	draw?: boolean
	/** Total time for the three strokes, in seconds. */
	duration?: number
}

// Variants rather than plain objects: motion only propagates variant labels to
// children, and every polygon in the mark animates as part of one sequence.
const PART_VARIANTS = {
	undrawn: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 },
	drawn: { pathLength: 1, fillOpacity: 1, strokeOpacity: 0 },
}

export function LogoDraw({
	id,
	className,
	draw = true,
	duration = 1.5,
}: LogoDrawProps) {
	const reactId = useId()
	const pop = introTiming().pop

	let elapsed = 0
	const strokeTiming = new Map<string, { delay: number; duration: number }>()
	for (const step of DRAW_ORDER) {
		const stepDuration = duration * step.share
		strokeTiming.set(step.part, { delay: elapsed, duration: stepDuration })
		elapsed += stepDuration
	}

	const popTransition = { delay: duration, duration: pop }

	return (
		<motion.svg
			id={id}
			viewBox={LOGO_VIEW_BOX}
			className={className}
			aria-hidden
			initial={draw ? "undrawn" : false}
			animate="drawn"
		>
			<defs>
				{LOGO_WEAVES.map((weave, index) => (
					<clipPath key={weave.points} id={`${reactId}-weave-${index}`}>
						<rect {...weave.rect} />
					</clipPath>
				))}
			</defs>
			{LOGO_PARTS.map((logoPart) => (
				<motion.polygon
					key={logoPart.part}
					data-logo-part={logoPart.part}
					variants={PART_VARIANTS}
					points={logoPart.points}
					fill={logoPart.fill}
					stroke={logoPart.fill}
					strokeWidth={STROKE_WIDTH}
					strokeLinejoin="round"
					transition={{
						pathLength: {
							...strokeTiming.get(logoPart.part),
							ease: "easeInOut",
						},
						fillOpacity: popTransition,
						strokeOpacity: popTransition,
					}}
				/>
			))}
			{LOGO_WEAVES.map((weave, index) => (
				<g key={weave.points} clipPath={`url(#${reactId}-weave-${index})`}>
					<motion.polygon
						points={weave.points}
						variants={PART_VARIANTS}
						fill={LOGO_LETTER_FILL}
						transition={popTransition}
					/>
				</g>
			))}
		</motion.svg>
	)
}
