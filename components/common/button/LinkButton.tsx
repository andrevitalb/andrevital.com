import {
	buttonColors,
	ButtonProps,
	buttonSizes,
} from "components/common/button"
import Link from "next/link"
import { HTMLAttributes, ReactNode } from "react"
import tw, { styled } from "twin.macro"

export const BaseStyledLinkButton = styled.a(
	({ color = "aquaTransparent", size = "md" }: ButtonProps) => [
		tw`
			font-semibold text-white
			inline-block no-underline
			disabled:cursor-default
		`,
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
} & ButtonProps &
	HTMLAttributes<HTMLAnchorElement>) => {
	return (
		<Link href={href} passHref>
			<BaseStyledLinkButton {...props}>{children}</BaseStyledLinkButton>
		</Link>
	)
}
