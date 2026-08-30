import Link from "next/link"
import { NavLink } from "@/components/nav/NavLink"
import { NavLogo } from "@/components/nav/NavLogo"
import { ThemeToggle } from "@/components/nav/ThemeToggle"
import { visibleSections } from "@/lib/sections"

const SECTION_LABEL = {
	work: "Work",
	craft: "Craft",
	writing: "Writing",
} as const

// Server component: only NavLink (active-state) and ThemeToggle need the client.
export function Nav() {
	const links = [
		...visibleSections().map((section) => ({
			href: `/${section}`,
			label: SECTION_LABEL[section],
		})),
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	]

	return (
		<>
			<a
				href="#main"
				className="fixed top-2 left-2 z-50 -translate-y-[calc(100%+0.5rem)] rounded-sm bg-bg-2 px-3 py-2 text-fg text-small focus:translate-y-0"
			>
				Skip to content
			</a>
			<header className="border-line border-b">
				<div className="mx-auto flex min-h-16 max-w-wide items-center justify-between gap-4 px-gutter py-3">
					<Link
						href="/"
						aria-label="André Vital, home"
						className="flex items-center text-fg"
					>
						<NavLogo />
					</Link>
					{/*
					 * flex-wrap, not flex-nowrap: with all three flaggable sections
					 * visible, "Work Craft Writing About Contact" plus the toggle does
					 * not fit one line at 320px even at zero gap, so avoiding real
					 * horizontal overflow (an explicit test requirement) takes priority
					 * over the single-line ideal in that dense case. The gap wraps
					 * first; the bar itself never does. With the production default
					 * (no sections flagged) this still renders as one line.
					 */}
					<nav
						aria-label="Primary"
						className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1"
					>
						{links.map((link) => (
							<NavLink key={link.href} href={link.href}>
								{link.label}
							</NavLink>
						))}
						<ThemeToggle />
					</nav>
				</div>
			</header>
		</>
	)
}
