"use client"

import { useTheme } from "next-themes"

// next-themes leaves resolvedTheme undefined until it has read the persisted
// or system preference on the client. Rendering a theme-dependent label
// before that would hydration-mismatch, so the placeholder below stands in,
// at the same fixed dimensions, until resolvedTheme is known.
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	if (!resolvedTheme) {
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
	const label = isDark ? "Switch to light theme" : "Switch to dark theme"

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={label}
			className="h-8 w-16 rounded-sm border border-line text-fg-2 text-small transition-colors duration-[var(--duration-fast)] hover:text-fg"
		>
			{isDark ? "Dark" : "Light"}
		</button>
	)
}
