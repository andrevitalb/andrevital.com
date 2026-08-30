"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type NavLinkProps = {
	href: string
	children: ReactNode
}

// Split out from Nav so the rest of the nav can stay a server component:
// usePathname needs a client boundary, and this is the smallest one.
export function NavLink({ href, children }: NavLinkProps) {
	const pathname = usePathname()
	const isActive = pathname === href

	return (
		<Link
			href={href}
			aria-current={isActive ? "page" : undefined}
			className={`text-small transition-colors duration-[var(--duration-fast)] ${
				isActive ? "text-accent" : "text-fg-2 hover:text-fg"
			}`}
		>
			{children}
		</Link>
	)
}
