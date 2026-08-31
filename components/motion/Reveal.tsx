import type { ComponentProps, ElementType, ReactNode } from "react"

type RevealTag = "div" | "li" | "section" | "p"

type RevealProps = {
	as?: RevealTag
	className?: string
	children: ReactNode
} & Omit<ComponentProps<"div">, "children" | "className">

/**
 * Enter on scroll. A server component carrying one attribute: the animation is a
 * CSS scroll-driven timeline in app/globals.css, so this ships no JavaScript and
 * no observer.
 *
 * That is not just cheaper, it is the only version that can be correct here. The
 * motion-based one serialised `opacity: 0` into the server HTML, so any visitor
 * whose bundle never arrived got permanently invisible content, which breaks the
 * site's no-JS contract. CSS cannot fail that way: with JavaScript off, or in a
 * browser without scroll-driven animations, the element simply renders.
 *
 * The trade is that a scroll timeline scrubs rather than fires once, so scrolling
 * back up reverses it. The range is set to finish early (see globals.css) so that
 * only happens when the element is nearly off screen again.
 */
export function Reveal({
	as = "div",
	className,
	children,
	...rest
}: RevealProps) {
	const Tag = as as ElementType

	return (
		<Tag data-reveal className={className} {...rest}>
			{children}
		</Tag>
	)
}
