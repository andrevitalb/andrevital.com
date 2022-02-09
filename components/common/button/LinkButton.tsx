import {
	buttonColors,
	ButtonProps,
	buttonSizes,
} from "components/common/button"
import Link from "next/link"
import { ReactNode } from "react"
import tw, { styled } from "twin.macro"

const BaseStyledLinkButton = styled.a(
	({ color = "gray", size = "md" }: ButtonProps) => [
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
} & ButtonProps) => {
	return (
		<Link href={href} passHref>
			<BaseStyledLinkButton {...props}>{children}</BaseStyledLinkButton>
		</Link>
	)
}
