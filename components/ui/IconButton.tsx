"use client"

import type { ReactNode } from "react"

type IconButtonProps = {
	/** Becomes both the accessible name and the tooltip. Name the action. */
	label: string
	onClick?: () => void
	type?: "button" | "submit"
	className?: string
	children: ReactNode
}

/**
 * A square control whose only content is a glyph. 36px is the hit area, which
 * clears the 24px WCAG 2.5.8 minimum with room, while the glyph itself sits at
 * 18px to stay in scale with the nav's 14px text.
 *
 * The cursor comes from the base rules in app/globals.css, not from here.
 */
export function IconButton({
	label,
	onClick,
	type = "button",
	className,
	children,
}: IconButtonProps) {
	return (
		<button
			type={type === "submit" ? "submit" : "button"}
			onClick={onClick}
			aria-label={label}
			title={label}
			className={[
				"grid h-9 w-9 place-items-center rounded-sm border border-line text-fg-2",
				"transition-colors duration-[var(--duration-fast)]",
				"hover:border-fg-2 hover:text-fg active:text-accent",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<span aria-hidden="true" className="contents">
				{children}
			</span>
		</button>
	)
}
