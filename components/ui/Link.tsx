import NextLink from "next/link"
import type { ReactNode } from "react"

export type TextLinkVariant = "primary" | "secondary" | "quiet"

/*
 * The hierarchy the site did not have. Before this, one class string was pasted
 * eleven times across eight files, so a primary path and a social handle
 * rendered identically.
 *
 * primary:   a destination the page wants taken. The accent underline is what
 *            finally puts the brand colour on a page that is not a nav target.
 * secondary: a supporting destination. This is the site's original and only
 *            style, kept as the middle rung so nothing regresses.
 * quiet:     navigation and tertiary links such as socials.
 *
 * Exported so callers and tests assert against these values rather than keeping
 * a second copy of them.
 */
export const LINK_CLASS: Record<TextLinkVariant, string> = {
	primary:
		"text-fg underline decoration-2 decoration-accent underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-[var(--duration-fast)] hover:underline-offset-[6px]",
	secondary:
		"text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent",
	quiet:
		"text-fg-2 no-underline transition-colors duration-[var(--duration-fast)] hover:text-fg",
}

type TextLinkProps = {
	href: string
	variant?: TextLinkVariant
	/** Opens in a new tab with the safe rel. Use for anything off this origin. */
	external?: boolean
	/**
	 * The accessible name, when the visible text is broken up for typographic
	 * reasons. Contact sets the address on two lines, and the name computed from
	 * two block children is "contact@ andrevital.com", with a space in the middle
	 * of an email address.
	 */
	"aria-label"?: string
	className?: string
	children: ReactNode
}

/**
 * Every text link on the site. Only same-origin route hrefs go through
 * next/link: a `mailto:` or an off-site URL would otherwise be prefetched as an
 * RSC payload.
 */
export function TextLink({
	href,
	variant = "secondary",
	external = false,
	"aria-label": ariaLabel,
	className,
	children,
}: TextLinkProps) {
	const classes = [LINK_CLASS[variant], className].filter(Boolean).join(" ")
	const isRoute = href.startsWith("/") && !external

	if (isRoute) {
		return (
			<NextLink href={href} className={classes} aria-label={ariaLabel}>
				{children}
			</NextLink>
		)
	}

	return (
		<a
			href={href}
			className={classes}
			aria-label={ariaLabel}
			target={external ? "_blank" : undefined}
			rel={external ? "noreferrer noopener" : undefined}
		>
			{children}
		</a>
	)
}
