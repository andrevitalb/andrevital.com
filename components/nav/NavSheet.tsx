import Link from "next/link"
import { NavByline } from "@/components/nav/NavByline"
import { NavSheetAutoClose } from "@/components/nav/NavSheetAutoClose"
import { ThemeToggle } from "@/components/nav/ThemeToggle"

export type NavSheetLink = {
	href: string
	label: string
}

/**
 * The mobile navigation: a text "Menu" that opens a full-screen sheet with the
 * links set in display type.
 *
 * A native <details> disclosure, not a <dialog>. This was a <dialog> first, and
 * that was wrong: a closed dialog is display:none and only showModal() can open
 * it, so with JavaScript off the entire mobile nav was unreachable. <details>
 * opens on its own, which means the navigation itself needs no client JavaScript,
 * has no control that can be dead, and needs no duplicate set of links in a
 * <noscript>. The theme toggle in the base row is the one client component here,
 * and it is the same instance the bar drops below sm, so the bundle is unchanged;
 * with scripting off it renders its inert placeholder and every link still works.
 *
 * The trade is that a disclosure does not trap focus the way a modal dialog does,
 * so a keyboard user can tab past the last link into the page behind the sheet.
 * For a three to five item navigation that is the cheaper problem, and it is the
 * one that does not break with scripting off.
 *
 * The summary carries both labels and CSS picks one, so the same control opens
 * and closes the sheet and there is no second button to keep in sync. It, the
 * mark and the theme toggle are all painted above the panel rather than inside
 * it, so the whole bar stays put and only the field behind it changes. See
 * app/globals.css.
 */
export function NavSheet({
	links,
	name,
}: {
	links: NavSheetLink[]
	name: string
}) {
	return (
		<details data-nav-sheet className="sm:hidden">
			{/*
			 * No aria-label. One reading "Site navigation" over visible text reading
			 * "Menu" is WCAG 2.5.3 Label in Name, which Lighthouse flags as
			 * label-content-name-mismatch: a voice-control user saying the word they
			 * can see does not hit the control. The two spans below are toggled with
			 * display, which takes the hidden one out of the accessibility tree, so
			 * the accessible name is "Menu" closed and "Close" open, matching what is
			 * on screen in both states.
			 */}
			<summary className="text-fg-2 text-small transition-colors duration-[var(--duration-fast)] hover:text-fg">
				<span data-nav-sheet-closed>Menu</span>
				<span data-nav-sheet-open>Close</span>
			</summary>

			{/* Inside the <details>, because it closes the sheet by walking up to
			    it. Renders nothing; see the component for why the route change is
			    what it listens to rather than each link's own click. */}
			<NavSheetAutoClose />

			<div data-nav-sheet-panel>
				{/* Reserves the bar the panel slides under. The bar's own mark and
				    controls paint above the panel, so there is no second copy of the
				    mark here to redraw at a different size. */}
				<div aria-hidden="true" className="min-h-16 shrink-0" />

				{/* Bottom-anchored. Top-aligned left ~200px of dead air under the last
				    link, which reads as missing content rather than as space. */}
				<nav aria-label="Primary, mobile" className="mt-auto px-gutter">
					<ul>
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="block py-3 font-medium text-display text-fg tracking-[-0.025em]"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* The logo's diagonal cut, at page scale, as the rule the sheet sits
				    on. It no longer draws itself: the panel's own reveal is that
				    stroke now, and a second one would say the same thing twice. */}
				<div aria-hidden="true" data-nav-sheet-cut />

				<div className="flex shrink-0 items-center justify-between px-gutter pb-5">
					<span className="font-mono text-fg-2 text-meta uppercase">Theme</span>
					<ThemeToggle />
				</div>

				{/* The site's copyright, which U4b's sidebar carries from lg up and the
				    deleted footer used to carry everywhere. This sheet is the only
				    place it exists below sm, and between sm and lg the site carries
				    none at all: the bar has no foot to put one at. Recorded rather
				    than papered over; tests/e2e/shell.spec.ts asserts it.

				    The rule runs the panel's full width, like the sidebar's. */}
				<div className="shrink-0 border-line border-t px-gutter pt-4 pb-8">
					<NavByline name={name} />
				</div>
			</div>

			{/* The cut itself, drawn along the panel's leading edge. Outside the
			    panel because a clip-path clips its own descendants, so a line inside
			    it would be cut off by the very edge it draws. */}
			<div aria-hidden="true" data-nav-sheet-edge />
		</details>
	)
}
