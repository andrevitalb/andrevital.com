import {
	baseButtonStyles,
	buttonColors,
	ButtonProps,
	buttonSizes,
} from "components/common/button"
import Link from "next/link"
import { ReactNode } from "react"
import { styled } from "twin.macro"

export const BaseStyledLinkButton = styled.a<ButtonProps>(
	({ color = "aquaTransparent", size = "md" }) => [
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
		<Link href={href} passHref legacyBehavior>
			<BaseStyledLinkButton {...props}>{children}</BaseStyledLinkButton>
		</Link>
	)
}
