export type Bezier = [number, number, number, number]

// Authored in ms in app/globals.css. The build's CSS minifier rewrites them to
// seconds (600ms becomes .6s), so both units have to be handled.
const FALLBACK_MS = {
	"--duration-fast": 150,
	"--duration-base": 240,
	"--duration-slow": 400,
	"--duration-draw": 600,
	"--duration-cut": 300,
	"--duration-pop": 200,
	"--duration-dock": 500,
	"--duration-draw-inline": 700,
	"--duration-stagger": 60,
	"--duration-route": 420,
	"--duration-sweep": 500,
} as const

export type DurationToken = keyof typeof FALLBACK_MS

// Not `as const`: a readonly tuple is not assignable to Bezier, and easing()
// hands these to parseCubicBezier as a mutable fallback.
const FALLBACK_EASE = {
	"--ease-out-expo": [0.16, 1, 0.3, 1],
	"--ease-standard": [0.2, 0, 0, 1],
	"--ease-in-out-quart": [0.65, 0, 0.35, 1],
} satisfies Record<string, Bezier>

export type EasingToken = keyof typeof FALLBACK_EASE

/** Reads a duration token as seconds, which is what motion wants. */
export function parseDuration(raw: string, fallbackMs: number) {
	const parsed = Number.parseFloat(raw)
	if (!Number.isFinite(parsed) || parsed <= 0) return fallbackMs / 1000
	return raw.trim().endsWith("ms") ? parsed / 1000 : parsed
}

/** Pulls the four control points out of a cubic-bezier(...) token. */
export function parseCubicBezier(raw: string, fallback: Bezier): Bezier {
	const points = raw.match(/-?[\d.]+/g)?.map(Number)
	if (points?.length !== 4 || !points.every(Number.isFinite)) return fallback
	return points as Bezier
}

function readProperty(token: string) {
	if (typeof window === "undefined") return ""
	return getComputedStyle(document.documentElement).getPropertyValue(token)
}

/**
 * Seconds for a duration token. The fallbacks are for jsdom and for the server,
 * where custom properties do not resolve; in a browser these always come from
 * app/globals.css.
 */
export function duration(token: DurationToken) {
	return parseDuration(readProperty(token), FALLBACK_MS[token])
}

/** Control points for an easing token, with the same fallback rationale. */
export function easing(token: EasingToken): Bezier {
	// Copied per call rather than shared: motion is free to keep the array, and a
	// shared fallback would then be mutable across every consumer.
	const fallback = FALLBACK_EASE[token]
	return parseCubicBezier(readProperty(token), [...fallback] as Bezier)
}
