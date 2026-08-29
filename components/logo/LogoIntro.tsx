"use client"

import { motion } from "motion/react"
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
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

/**
 * Everything the intro holds out of reach while the mark draws: the overlay's own
 * siblings, which is the rest of the page. Reading them off the overlay rather than
 * from a `body > ...` selector keeps this working wherever the tree is mounted.
 * Custom elements are skipped so dev-tooling portals stay usable.
 */
function pageContent(overlay: HTMLElement) {
	return Array.from(overlay.parentElement?.children ?? []).filter(
		(node): node is HTMLElement =>
			node instanceof HTMLElement &&
			node !== overlay &&
			!node.tagName.includes("-"),
	)
}

export function LogoIntro({ children }: { children: ReactNode }) {
	const [state, setState] = useState<IntroState>(PENDING)
	const overlayRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = document.documentElement
		const overlay = overlayRef.current
		const mode: IntroMode =
			root.getAttribute(INTRO_ATTRIBUTE) === "full" ? "full" : "inline"

		if (mode !== "full" || !overlay) {
			setState({ mode: "inline", docked: true, skipped: false })
			return
		}

		setState({ mode, docked: false, skipped: false })

		// The attribute, not the property: jsdom has no `inert` property to set, and
		// an attribute is what a unit test and a browser inspector can both see.
		const content = pageContent(overlay)
		for (const node of content) node.setAttribute("inert", "")

		const { draw, pop } = introTiming()
		let timer = 0

		const release = () => {
			window.clearTimeout(timer)
			for (const event of SKIP_EVENTS) window.removeEventListener(event, skip)
			for (const node of content) node.removeAttribute("inert")
		}

		const finish = (skipped: boolean) => {
			release()
			// Drops the veil, which fades out over the page already painted behind it.
			root.setAttribute(INTRO_ATTRIBUTE, INTRO_DONE)
			setState({ mode: "full", docked: true, skipped })
		}

		const skip = () => finish(true)

		timer = window.setTimeout(() => finish(false), (draw + pop) * 1000)
		for (const event of SKIP_EVENTS) {
			window.addEventListener(event, skip, { passive: true })
		}

		return release
	}, [])

	const running = state.mode === "full" && !state.docked

	return (
		<IntroContext value={state}>
			{/* Always mounted, so the effect can find the page around it on first commit. */}
			<div
				ref={overlayRef}
				aria-hidden
				className={
					running ? "fixed inset-0 z-50 grid place-items-center" : "hidden"
				}
			>
				{running ? (
					<motion.div layoutId={LOGO_LAYOUT_ID} className="size-32">
						<LogoDraw className="size-full" duration={introTiming().draw} />
					</motion.div>
				) : null}
			</div>
			{children}
		</IntroContext>
	)
}
