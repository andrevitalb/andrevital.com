"use client"

import { motion } from "motion/react"
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"
import {
	INTRO_ATTRIBUTE,
	INTRO_DONE,
	type IntroMode,
} from "@/components/logo/intro-mode"
import { introTiming, LogoDraw } from "@/components/logo/LogoDraw"

export const LOGO_LAYOUT_ID = "logo-mark"

type IntroState = {
	/** null until the client has read the attribute: SSR and first render agree on it. */
	mode: IntroMode | null
	/** The hero mark has handed the logo back to the nav. */
	docked: boolean
	/** The visitor cut the intro short, so the dock animation is skipped too. */
	skipped: boolean
}

const PENDING: IntroState = { mode: null, docked: false, skipped: false }

const IntroContext = createContext<IntroState>(PENDING)

export function useIntro() {
	return useContext(IntroContext)
}

const SKIP_EVENTS = ["pointerdown", "keydown", "wheel"] as const

export function LogoIntro({ children }: { children: ReactNode }) {
	const [state, setState] = useState<IntroState>(PENDING)

	useEffect(() => {
		const root = document.documentElement
		const mode: IntroMode =
			root.getAttribute(INTRO_ATTRIBUTE) === "full" ? "full" : "inline"

		if (mode !== "full") {
			setState({ mode, docked: true, skipped: false })
			return
		}

		setState({ mode, docked: false, skipped: false })

		// The page behind the veil keeps its place in the accessibility tree and stays
		// focusable on purpose (KTD4 amended 2026-08-29). Marking it inert emptied the
		// tree for the whole intro, and it buys nothing: the veil absorbs pointer
		// input, and any key press ends the intro before it can reach anything.
		let timer = 0

		const release = () => {
			window.clearTimeout(timer)
			for (const event of SKIP_EVENTS) window.removeEventListener(event, skip)
		}

		const finish = (skipped: boolean) => {
			release()
			// Drops the veil, which fades out over the page already painted behind it.
			root.setAttribute(INTRO_ATTRIBUTE, INTRO_DONE)
			setState({ mode: "full", docked: true, skipped })
		}

		const skip = () => finish(true)

		const { draw, pop } = introTiming()
		timer = window.setTimeout(() => finish(false), (draw + pop) * 1000)
		for (const event of SKIP_EVENTS) {
			window.addEventListener(event, skip, { passive: true })
		}

		return release
	}, [])

	const running = state.mode === "full" && !state.docked

	return (
		<IntroContext value={state}>
			{running ? (
				<div
					data-intro-overlay
					aria-hidden
					className="fixed inset-0 z-50 grid place-items-center"
				>
					<motion.div layoutId={LOGO_LAYOUT_ID} className="size-32">
						<LogoDraw className="size-full" duration={introTiming().draw} />
					</motion.div>
				</div>
			) : null}
			{children}
		</IntroContext>
	)
}
