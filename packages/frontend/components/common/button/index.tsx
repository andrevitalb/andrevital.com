import tw, { css, styled, TwStyle } from "twin.macro"

type Sizes = "md"
type Colors = "gray" | "transparent" | "aqua" | "aquaTransparent"

export interface ButtonProps {
	size?: Sizes
	color?: Colors
}

export const buttonColors: Record<Colors, TwStyle> = {
	gray: tw`bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200`,
	transparent: tw`bg-transparent border-4 border-white text-white hover:(border-gray-200 text-gray-200)`,
	aqua: tw`bg-aqua-300 border-4 border-aqua-300 text-blue-300 hover:(bg-transparent text-aqua-300)`,
	aquaTransparent: tw`bg-transparent border-4 border-aqua-300 text-aqua-300 hover:(bg-aqua-300 bg-opacity-[.125])`,
}

export const buttonSizes: Record<Sizes, TwStyle> = {
	md: tw`py-4 px-12 text-base md:px-16`,
}

export const baseButtonStyles = tw`
	inline-block no-underline
	font-semibold font-display
	disabled:(opacity-50 cursor-default)
`

export const conditionalButtonStyles = ({
	color = "aquaTransparent",
	size = "md",
}: ButtonProps) => css`
	${baseButtonStyles}
	${buttonColors[color]}
  ${buttonSizes[size]}
`

export const Button = styled.button<ButtonProps>(
	({ color = "aquaTransparent", size = "md" }: ButtonProps) => [
		conditionalButtonStyles({ color, size }),
	],
)
