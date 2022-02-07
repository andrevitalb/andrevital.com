import { NavLink } from "react-router-dom"
import tw, { css, styled } from "twin.macro"

const transitionStyles = css`
	${tw`transition-all duration-300`}
`

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
			h-full min-w-[100px]
		)
	`}
`
export const NavLinkContainer = styled.div`
	${tw`
		w-full
		flex flex-row md:(flex-col justify-evenly)
		justify-center items-center
	`}
	${transitionStyles}
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
			${tw`font-semibold`}
		}
	}
	&.active,
	&:hover {
		i {
			${tw`
				opacity-100 md:opacity-0
			`}
		}
		p {
			${tw`opacity-0 md:opacity-100`}
		}
	}
`

export const NavLinkIcon = styled.i`
	${tw`text-xl`}
	${transitionStyles}
`
export const NavLinkText = tw.p`opacity-0 absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2`
export const NavSocialLinkContainer = tw.div`hidden md:flex flex-col justify-center items-center`
export const NavSocialLink = styled.a`
	${tw`py-1 text-gray-300 hover:text-white`}
	${transitionStyles}
`
