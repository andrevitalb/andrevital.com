import {
	baseButtonStyles,
	buttonColors,
	ButtonProps,
	buttonSizes,
} from "components/common/button"
import Link from "next/link"
import { ReactNode } from "react"
import { styled } from "twin.macro"

export const BaseStyledLinkButton = styled.a(
	({ color = "aquaTransparent", size = "md" }: ButtonProps) => [
		baseButtonStyles,
		buttonColors[color],
		buttonSizes[size],
	],
)

export const LinkButton = ({
	href,
	children,
	...props
}: {
	href: string
	children: ReactNode
} & ButtonProps) => {
	return (
		<Link href={href} passHref>
			{/* 
				This currently has issues due to problems with @types/react.
				Check https://github.com/vercel/next.js/issues/35986 for more details
			*/}
			{/* @ts-ignore */}
			<BaseStyledLinkButton {...props}>{children}</BaseStyledLinkButton>
		</Link>
	)
}
