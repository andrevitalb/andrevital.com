"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ComponentProps, ElementType, ReactNode } from "react"
import { duration, easing } from "@/lib/motion"

type RevealTag = "div" | "li" | "section" | "p"

type RevealProps = {
	as?: RevealTag
	/** Multiplies --duration-stagger to sequence siblings. */
	delayIndex?: number
	className?: string
	children: ReactNode
} & Omit<ComponentProps<"div">, "children" | "className">

/**
 * Enter on scroll, once. `viewport.once` is deliberate: content that re-animates
 * every time it scrolls back into view is distracting rather than expressive.
 *
 * Under reduced motion this renders a plain element with no animation at all
 * rather than a faster one, and it never starts hidden, so nothing can strand
 * content at opacity 0 if an observer never fires.
 */
export function Reveal({
	as = "div",
	delayIndex = 0,
	className,
	children,
	...rest
}: RevealProps) {
	const reduce = useReducedMotion()

	if (reduce) {
		const Plain = as as ElementType
		return (
			<Plain className={className} {...rest}>
				{children}
			</Plain>
		)
	}

	const Tag = motion[as] as ElementType

	return (
		<Tag
			className={className}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.35 }}
			transition={{
				duration: duration("--duration-slow"),
				delay: delayIndex * duration("--duration-stagger"),
				ease: easing("--ease-out-expo"),
			}}
			{...rest}
		>
			{children}
		</Tag>
	)
}
