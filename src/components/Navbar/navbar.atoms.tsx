import {
	absolutePositionCenter,
	baseTransition,
} from "components/common/mixins"
import { NavLink } from "react-router-dom"
import tw, { styled } from "twin.macro"

export const StyledHeader = styled.header`
	top: unset;
	bottom: 0;
	min-width: unset;
	${tw`
		fixed z-10
		bg-gray-500
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

export const StyledNavLink = styled(NavLink)`
	${tw`
		text-white text-sm uppercase
		block relative
		text-center no-underline
		py-5 w-full
	`}
	&.active {
		i {
			${tw`font-semibold opacity-100`}
		}
		p {
			${tw`opacity-0 `}
		}
	}
	&:hover {
		i {
			${tw`opacity-100 md:opacity-0`}
		}
		p {
			${tw`opacity-0 md:opacity-100`}
		}
	}
`

export const NavLinkIcon = styled.i`
	${tw`text-xl`}
	${baseTransition()}
`
export const NavLinkText = styled.p`
	${tw`opacity-0`}
	${baseTransition()}
	${absolutePositionCenter}
`
export const NavSocialLinkContainer = tw.div`hidden md:flex flex-col justify-center items-center`
export const NavSocialLink = styled.a`
	${tw`py-1 text-gray-300 hover:text-white`}
	${baseTransition()}
`
