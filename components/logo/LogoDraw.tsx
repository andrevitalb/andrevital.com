"use client"

import { motion } from "motion/react"
import { useId } from "react"
import {
	LOGO_PARTS,
	LOGO_VIEW_BOX,
	LOGO_WEAVES,
} from "@/components/logo/LogoMark"

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

// Fallbacks are for jsdom, where custom properties do not resolve. In a browser
// these always come from the tokens in app/globals.css (docs/design.md "Motion").
const FALLBACK_MS = {
	"--duration-draw": 600,
	"--duration-cut": 300,
	"--duration-pop": 200,
	"--duration-dock": 500,
	"--duration-draw-inline": 700,
} as const

/**
 * Reads a duration token as seconds, which is what motion wants. Both units have
 * to be handled: the tokens are authored in ms, and the build's CSS minifier
 * rewrites them to seconds (`600ms` becomes `.6s`).
 */
export function parseDuration(raw: string, fallbackMs: number) {
	const parsed = Number.parseFloat(raw)
	if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs / 1000
	return raw.trim().endsWith("ms") ? parsed / 1000 : parsed
}

function seconds(token: keyof typeof FALLBACK_MS) {
	const fallback = FALLBACK_MS[token]
	if (typeof window === "undefined") return fallback / 1000
	const raw = getComputedStyle(document.documentElement).getPropertyValue(token)
	return parseDuration(raw, fallback)
}

type Bezier = [number, number, number, number]

// --ease-in-out-quart, the dock easing in docs/design.md.
const FALLBACK_EASE: Bezier = [0.65, 0, 0.35, 1]

/** Pulls the four control points out of a `cubic-bezier(...)` token. */
export function parseCubicBezier(raw: string, fallback: Bezier): Bezier {
	const points = raw.match(/-?[\d.]+/g)?.map(Number)
	if (points?.length !== 4 || !points.every(Number.isFinite)) return fallback
	return points as Bezier
}

function bezier(token: string) {
	if (typeof window === "undefined") return FALLBACK_EASE
	const raw = getComputedStyle(document.documentElement).getPropertyValue(token)
	return parseCubicBezier(raw, FALLBACK_EASE)
}

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
		draw: seconds("--duration-draw") * 2 + seconds("--duration-cut"),
		pop: seconds("--duration-pop"),
		dock: seconds("--duration-dock"),
		inline: seconds("--duration-draw-inline"),
		dockEase: bezier("--ease-in-out-quart"),
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
						fill="currentColor"
						transition={popTransition}
					/>
				</g>
			))}
		</motion.svg>
	)
}
