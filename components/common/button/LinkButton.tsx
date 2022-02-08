import {
	buttonColors,
	ButtonProps,
	buttonSizes,
} from "components/common/button"
import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"

export const LinkButton = styled(Link)(
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
