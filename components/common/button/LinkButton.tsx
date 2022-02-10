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
			<BaseStyledLinkButton {...props}>{children}</BaseStyledLinkButton>
		</Link>
	)
}
