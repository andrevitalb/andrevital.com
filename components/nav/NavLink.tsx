"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

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
			className={`${VARIANT[variant]} transition-colors duration-[var(--duration-fast)] ${
				isActive ? "text-accent" : "text-fg-2 hover:text-fg"
			}`}
		>
			{children}
		</Link>
	)
}
