import Link from "next/link"
import { NavLink } from "@/components/nav/NavLink"
import { NavLogo } from "@/components/nav/NavLogo"
import { NavSheet } from "@/components/nav/NavSheet"
import { ThemeToggle } from "@/components/nav/ThemeToggle"
import { visibleSections } from "@/lib/sections"

const SECTION_LABEL = {
	work: "Work",
	craft: "Craft",
	writing: "Writing",
} as const

// Server component: only NavLink (active-state) and ThemeToggle need the client.
// NavSheet is a <details> disclosure, so it needs neither.
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
					 * Two navigations, one per breakpoint, rather than one that wraps.
					 *
					 * The text row used to be flex-wrap because with every section visible
					 * "Work Craft Writing About Contact" plus the toggle does not fit one
					 * line at 320px. It wrapped even with three, which orphaned the toggle
					 * onto a second line under the links and left the mark misaligned
					 * beside them: 269px of content in 280px of bar, so it read as an
					 * accident rather than a layout. Below sm the links move into
					 * NavSheet and the bar carries the mark and two controls, which fits
					 * with room at 320px and stays fixed however many sections are on.
					 */}
					<div className="flex items-center gap-4">
						<nav
							aria-label="Primary"
							className="hidden items-center justify-end gap-x-4 sm:flex"
						>
							{links.map((link) => (
								<NavLink key={link.href} href={link.href}>
									{link.label}
								</NavLink>
							))}
						</nav>
						<ThemeToggle />
						<NavSheet links={links} />
					</div>
				</div>
			</header>
		</>
	)
}
