"use client"

import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { IconButton } from "@/components/ui/IconButton"

// A `mounted` flag, not a check on `resolvedTheme`: next-themes resolves
// `resolvedTheme` during the client's FIRST render (via its own pre-hydration
// script), so checking it here still hydration-mismatches (server renders the
// placeholder, client's first pass already renders the real button). The
// `mounted` state only flips true in a useEffect, which runs after hydration
// has already reconciled, so both the server and the client's first render
// agree on the placeholder.
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		// Same 36px box as the real button so the nav does not reflow on mount. A
		// div rather than a disabled button: with no accessible name there is
		// nothing useful to announce, and a focusable dead control is worse than
		// no control.
		return (
			<div
				aria-hidden="true"
				className="h-9 w-9 rounded-sm border border-line"
			/>
		)
	}

	const isDark = resolvedTheme === "dark"
	const nextTheme = isDark ? "light" : "dark"

	/*
	 * The swap is wiped in along the mark's diagonal, the same stroke the nav
	 * sheet opens with. See the ::view-transition rules in app/globals.css.
	 *
	 * flushSync is not optional: startViewTransition snapshots the page, runs the
	 * callback, snapshots it again, and animates between the two. A React state
	 * update scheduled inside that callback would land after the second snapshot,
	 * so the transition would be between two identical frames.
	 *
	 * Both fallbacks land on the plain swap, which is what shipped before this and
	 * is correct on its own: a browser with no startViewTransition, and a visitor
	 * who asked for less motion. A full-page value change is exactly the kind of
	 * large-scale motion that preference exists for.
	 */
	const swap = () => {
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches

		if (reduced || !document.startViewTransition) {
			setTheme(nextTheme)
			return
		}

		document.startViewTransition(() => flushSync(() => setTheme(nextTheme)))
	}

	// The label names the ACTION. The old button showed the target theme's name
	// as visible text, which read equally well as a statement of the current
	// state. An icon plus an action label cannot be misread that way.
	return (
		<IconButton label={`Switch to ${nextTheme} theme`} onClick={swap}>
			{isDark ? (
				<SunIcon size={18} weight="light" />
			) : (
				<MoonIcon size={18} weight="light" />
			)}
		</IconButton>
	)
}
