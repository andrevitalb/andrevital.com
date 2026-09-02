import Link from "next/link"
import type { NavLinkItem } from "@/components/nav/links"
import { NavByline } from "@/components/nav/NavByline"
import { NavLink } from "@/components/nav/NavLink"
import { NavLogo } from "@/components/nav/NavLogo"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

/**
 * The desktop navigation, from lg up. The bar is gone entirely there; this
 * carries the mark, the theme toggle, the links and the byline.
 *
 * A server component, like Nav: only NavLink and ThemeToggle cross into the
 * client, which is what keeps navigating this site free of JavaScript.
 *
 * A <header>, because above lg it is the page's banner: the bar it replaces was
 * one, and a div would have left the mark, the home link and the theme toggle
 * outside every landmark on every desktop page. Both headers are in the DOM at
 * once and only one is ever exposed, exactly like the two Primary navigations.
 * app/globals.css scopes its `header { position: relative }` rule away from this
 * one, which is unlayered and would otherwise beat the `fixed` utility.
 *
 * Fixed rather than a flex sibling of the page. A sidebar column would have put
 * `header` and `main` inside a wrapper div, and the return-visit stagger in
 * app/globals.css selects `body > :is(header, main)`: the animation would have
 * stopped matching, silently, with nothing to fail. Fixed plus `lg:pl-sidebar`
 * on the body leaves the document's own structure exactly as it was.
 */
export function SidebarNav({
	links,
	name,
}: {
	links: NavLinkItem[]
	name: string
}) {
	return (
		<header
			data-sidebar
			className="fixed inset-y-0 left-0 z-30 hidden w-sidebar flex-col overflow-y-auto border-line border-r px-gutter py-6 lg:flex"
		>
			{/* The row the bar used to be. The mark keeps its own link home, so
			    deleting the bar costs no route. */}
			<div className="flex items-center justify-between gap-4">
				<Link
					href="/"
					aria-label={`${name}, home`}
					className="flex items-center text-fg"
				>
					<NavLogo slot="sidebar" />
				</Link>
				<ThemeToggle />
			</div>

			{/* The links sit low rather than under the mark. That is the whole shape
			    of the comp: the column is mostly air and they land near the optical
			    centre of a tall page instead of at the top of it. */}
			<nav aria-label="Primary" className="mt-[40vh]">
				<ul className="grid gap-5">
					{links.map((link) => (
						<li key={link.href}>
							<NavLink href={link.href} variant="sidebar">
								{link.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className="mt-auto pt-6">
				<NavByline name={name} />
			</div>
		</header>
	)
}
