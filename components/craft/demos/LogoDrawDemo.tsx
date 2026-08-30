"use client"

import { useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"
import { LogoDraw } from "@/components/logo/LogoDraw"
import { LogoMark } from "@/components/logo/LogoMark"

// R17: the first piece is U4's choreography, so it costs no new animation code.
// The demo is LogoDraw with the two controls a piece page owes a visitor that
// the intro cannot: run it again, and run it slowly enough to see the order.
const BASE_DURATION = 1.5
const SPEEDS = [0.5, 1, 2] as const

const CONTROL =
	"rounded-sm border border-line px-3 py-1 font-mono text-meta uppercase transition-colors duration-[var(--duration-fast)] hover:text-fg"

export function LogoDrawDemo() {
	const reducedMotion = useReducedMotion()
	const [speed, setSpeed] = useState<number>(1)
	// Remount counter. Nothing in LogoDraw's API restarts a finished sequence, and
	// a fresh mount is how motion replays one; the speed goes in the same key so
	// changing it shows its effect straight away instead of on the next replay.
	const [run, setRun] = useState(0)
	// The server cannot know the visitor's motion preference, and an undrawn
	// LogoDraw renders as nothing, so rendering one on the server would both ship
	// an empty frame to a visitor without JavaScript and disagree with the first
	// client render for a visitor with it.
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	// R9: a visitor who asked for less motion gets the static mark, and the draw
	// only on the replay they press themselves. LogoMark rather than a LogoDraw
	// that is told not to draw, which is the same call NavLogo makes: pathLength
	// leaves a dash pattern on the shapes even when nothing animates.
	const drawing = mounted && (run > 0 || !reducedMotion)

	return (
		<div className="grid gap-6">
			<div className="mx-auto flex aspect-square w-full max-w-56 items-center justify-center text-fg">
				{drawing ? (
					<LogoDraw
						key={`${run}-${speed}`}
						className="size-full"
						duration={BASE_DURATION / speed}
					/>
				) : (
					<LogoMark className="size-full" />
				)}
			</div>

			<div className="flex flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onClick={() => setRun((previous) => previous + 1)}
					className={`${CONTROL} text-fg-2`}
				>
					Replay
				</button>
				<fieldset className="flex flex-wrap items-center gap-2 border-0 p-0">
					<legend className="sr-only">Speed</legend>
					{SPEEDS.map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => setSpeed(option)}
							aria-pressed={speed === option}
							className={`${CONTROL} ${
								speed === option ? "text-fg" : "text-fg-2"
							}`}
						>
							{option}×
						</button>
					))}
				</fieldset>
			</div>
		</div>
	)
}
