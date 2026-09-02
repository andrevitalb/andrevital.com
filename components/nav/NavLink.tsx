"use client"

import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { duration, easing } from "@/lib/motion"

type NavLinkProps = {
	href: string
	variant?: "bar" | "sidebar"
	children: ReactNode
}

// The bar sets its links in the body face at --text-small; the sidebar sets them
// in mono at --text-meta, which is the register the site already uses for
// furniture (labels, dates, the byline). Same active rule in both.
const VARIANT = {
	bar: "text-small",
	sidebar: "font-mono text-meta uppercase tracking-[0.12em]",
} as const

/**
 * The travelling mark for the current page (U4c).
 *
 * One accent hairline in the sidebar's gutter, rendered by whichever link is
 * active and carrying a shared layoutId, so a navigation MOVES it rather than
 * fading one out and another in. That is the dock's own idea at nav scale: a
 * single object travelling to where it now belongs, which is this site's motion
 * language rather than a sidebar indicator borrowed from somewhere else.
 *
 * Sidebar only, and that is load-bearing rather than cosmetic. Both shells are in
 * the DOM at every viewport, so a tick in the bar's variant too would put two
 * elements on one layoutId, which motion resolves to the first and paints
 * nowhere: the exact failure U4b spent a task fixing on the mark itself.
 *
 * Under reduced motion it is still rendered and still marks the page; it simply
 * arrives instead of travelling. It is in the server HTML either way, since a
 * client component still server-renders, so the current page is marked with no
 * JavaScript at all.
 */
function ActiveMark() {
	const reducedMotion = useReducedMotion()
	const className =
		"pointer-events-none absolute top-1/2 -left-4 mt-[-0.5px] h-px w-3 bg-accent"

	if (reducedMotion) return <span aria-hidden className={className} />

	return (
		<motion.span
			aria-hidden
			layoutId="nav-active"
			className={className}
			transition={{
				duration: duration("--duration-base"),
				ease: easing("--ease-standard"),
			}}
		/>
	)
}

// Split out from Nav so the rest of the nav can stay a server component:
// usePathname needs a client boundary, and this is the smallest one.
export function NavLink({ href, variant = "bar", children }: NavLinkProps) {
	const pathname = usePathname()
	// Prefix aware, so /work/an-entry lights Work. An exact match left every
	// child route with no lit item at all, which Unit 4 is about to ship four of.
	// "/" is exact or it matches everything.
	const isActive =
		href === "/"
			? pathname === "/"
			: pathname === href || pathname.startsWith(`${href}/`)

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={`relative ${VARIANT[variant]} transition-colors duration-[var(--duration-fast)] ${
				isActive ? "text-accent" : "text-fg-2 hover:text-fg"
			}`}
		>
			{isActive && variant === "sidebar" ? <ActiveMark /> : null}
			{children}
		</Link>
	)
}
