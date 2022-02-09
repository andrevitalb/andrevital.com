import tw, { styled, TwStyle } from "twin.macro"

type Sizes = "md"
type Colors = "gray" | "transparent"

export interface ButtonProps {
	size?: Sizes
	color?: Colors
}

export const buttonColors: Record<Colors, TwStyle> = {
	gray: tw`bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300`,
	transparent: tw`bg-transparent border-4 border-white text-white hover:(border-gray-300 text-gray-300)`,
}

export const buttonSizes: Record<Sizes, TwStyle> = {
	md: tw`py-4 px-12 text-base md:px-16`,
}

export const Button = styled.button(
	({ color = "gray", size = "md" }: ButtonProps) => [
		tw`
            py-4 px-12 text-base font-semibold inline-block no-underline
            font-bold text-white
            disabled:opacity-50 disabled:cursor-default
        `,
		buttonColors[color],
		buttonSizes[size],
	],
)
