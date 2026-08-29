"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

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
		return (
			<button
				type="button"
				disabled
				aria-hidden="true"
				tabIndex={-1}
				className="h-8 w-16 rounded-sm border border-line"
			/>
		)
	}

	const isDark = resolvedTheme === "dark"
	const nextTheme = isDark ? "light" : "dark"
	const label = `Switch to ${nextTheme} theme`
	// Visible text names the action (the theme it switches to), matching the
	// accessible name, so WCAG 2.5.3 Label in Name holds.
	const visibleLabel = nextTheme === "light" ? "Light" : "Dark"

	return (
		<button
			type="button"
			onClick={() => setTheme(nextTheme)}
			aria-label={label}
			className="h-8 w-16 rounded-sm border border-line text-fg-2 text-small transition-colors duration-[var(--duration-fast)] hover:text-fg"
		>
			{visibleLabel}
		</button>
	)
}
