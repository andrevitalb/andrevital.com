import Link from "next/link"
import { LogoMark } from "@/components/logo/LogoMark"

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
 * opens on its own, which means this component ships no client JavaScript, has no
 * control that can be dead, and needs no duplicate set of links in a <noscript>.
 *
 * The trade is that a disclosure does not trap focus the way a modal dialog does,
 * so a keyboard user can tab past the last link into the page behind the sheet.
 * For a three to five item navigation that is the cheaper problem, and it is the
 * one that does not break with scripting off.
 *
 * The summary carries both labels and CSS picks one, so the same control opens
 * and closes the sheet and there is no second button to keep in sync. It is
 * painted above the sheet rather than inside it, which is why it can stay put in
 * the bar while the panel covers the page. See app/globals.css.
 */
export function NavSheet({ links }: { links: NavSheetLink[] }) {
	return (
		<details data-nav-sheet className="sm:hidden">
			<summary
				aria-label="Site navigation"
				className="text-fg-2 text-small transition-colors duration-[var(--duration-fast)] hover:text-fg"
			>
				<span data-nav-sheet-closed>Menu</span>
				<span data-nav-sheet-open>Close</span>
			</summary>

			<div data-nav-sheet-panel>
				<div className="flex min-h-16 items-center px-gutter py-3">
					<LogoMark className="aspect-logo h-9" />
				</div>

				<nav aria-label="Primary, mobile" className="px-gutter">
					<ul>
						{links.map((link, index) => (
							<li
								key={link.href}
								data-nav-sheet-item
								style={{ "--sheet-index": index } as React.CSSProperties}
							>
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

				{/* The logo's diagonal cut, at page scale. Draws across the sheet as it
				    opens, so the mark's own language reaches the one surface on mobile
				    that had no identity at all. */}
				<div aria-hidden="true" data-nav-sheet-cut />
			</div>
		</details>
	)
}
