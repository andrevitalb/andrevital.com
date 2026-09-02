import Link from "next/link"
import { navLinks } from "@/components/nav/links"
import { NavLink } from "@/components/nav/NavLink"
import { NavLogo } from "@/components/nav/NavLogo"
import { NavSheet } from "@/components/nav/NavSheet"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

// Server component: only NavLink (active-state) and ThemeToggle need the client.
// NavSheet is a <details> disclosure, so it needs neither.
//
// Below lg only (U4b). From lg up the whole bar is gone and SidebarNav is the
// navigation: hidden rather than unmounted, because the swap is a media query,
// which is why NavLogo has to decide at runtime which copy of the mark is live.
export function Nav({ name }: { name: string }) {
	const links = navLinks()

	return (
		<header className="border-line border-b lg:hidden">
			<div className="mx-auto flex min-h-16 max-w-wide items-center justify-between gap-4 px-gutter py-3">
				{/* data-nav-bar-item lifts it above the open sheet panel, so the
				    mark holds its place instead of being covered and redrawn
				    inside the sheet at a second size. See app/globals.css. */}
				<Link
					href="/"
					data-nav-bar-item
					aria-label={`${name}, home`}
					className="flex items-center text-fg"
				>
					<NavLogo slot="bar" />
				</Link>
				{/*
				 * The bar's own text row, which is the shell between sm and lg: below sm
				 * the links are in the sheet, above lg they are in the sidebar. Three
				 * navigations across two breakpoints, rather than one that wraps.
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
					{/* Below sm the toggle moves into the sheet's base row. A
					    bordered icon chip sitting immediately beside the bare word
					    "Menu" put two control languages in 280px of bar, and it is
					    the least-used control on the site, so it is the one that
					    gives way. Like the two navigations, both instances are in
					    the DOM and only one is ever visible, so any selector for
					    the toggle has to be scoped. */}
					<span className="hidden sm:block">
						<ThemeToggle />
					</span>
					<NavSheet links={links} name={name} />
				</div>
			</div>
		</header>
	)
}
