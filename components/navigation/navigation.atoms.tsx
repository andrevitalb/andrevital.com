import {
	absolutePositionCenter,
	baseTransition,
} from "components/common/mixins"
import tw, { styled } from "twin.macro"

export const StyledHeader = styled.header`
	top: unset;
	bottom: 0;
	min-width: unset;
	${tw`
		fixed z-10
		bg-black
		h-auto min-h-[80px] w-full
		md:(
			top-0 left-0 bottom-auto
			h-full w-auto min-w-[100px]
		)
	`}
`
export const NavLinkContainer = styled.div`
	${tw`
		w-full
		flex flex-row md:(flex-col justify-evenly)
		justify-center items-center
	`}
	${baseTransition()}
`

export const StyledNavLink = tw.a`
	text-white text-sm uppercase
	block relative
	text-center no-underline
	py-5 w-full
`

export const NavLinkContent = tw.div`flex flex-grow flex-nowrap`

export const NavLinkIcon = styled.i<{ isNavItemActive: boolean }>(
	({ isNavItemActive }) => [
		tw`text-xl group-hover:(opacity-100 md:opacity-0)`,
		baseTransition(),
		isNavItemActive && tw`font-semibold opacity-100`,
	],
)
export const NavLinkText = styled.p<{ isNavItemActive: boolean }>(
	({ isNavItemActive }) => [
		tw`opacity-0 group-hover:(opacity-0 md:opacity-100)`,
		baseTransition(),
		absolutePositionCenter,
		isNavItemActive && tw`opacity-0`,
	],
)
export const NavSocialLinkContainer = tw.div`hidden md:flex flex-col justify-center items-center`
export const NavSocialLink = styled.a`
	${tw`py-1 text-gray-200 hover:text-white`}
	${baseTransition()}
`
