import {
	absolutePositionCenter,
	baseTransition,
} from "components/common/mixins"
import { Link } from "react-router-dom"
import tw, { css, styled } from "twin.macro"

export const PortfolioContainer = tw.div`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

// PortfolioItem elements
export const PortfolioItem = styled.div`
	${tw`col-span-1 min-h-[300px] relative cursor-pointer overflow-hidden`}
	&:hover {
		div:first-child::after {
			transform: translateX(0);
		}
		div:last-child {
			left: 50%;
		}
	}
`
export const PortfolioImageContainer = styled.div`
	${tw`w-full h-full`}
	${baseTransition()}
    &::after {
		content: "";
		${tw`top-0 left-0 w-full h-full absolute`}
		${baseTransition()}
		transform: translateX(-100%);
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 2;
	}
`
export const PortfolioImage = styled.img`
	${tw`w-full h-full object-cover hover:scale-105`}
	${baseTransition()}
`
export const PortfolioItemContent = styled.div`
	${tw`w-full text-center`}
	${baseTransition()}
	${absolutePositionCenter}
	left: -50%;
	z-index: 4;
`
export const PortfolioItemTitle = tw.h3`text-white text-3xl`
export const PortfolioItemTagContainer = tw.p`text-lg`
export const PortfolioItemTag = tw.span`py-0.5 px-2 border-white border-r-2 last:border-r-0`

// PortfolioModal elements
export const PortfolioModalContainer = styled.div<{ open: boolean }>(
	({ open }) => [
		tw`fixed top-0 h-full left-0 w-full md:(left-[100px] w-[calc(100%-100px)])`,
		baseTransition(".5s"),
		`
            opacity: 0;
            background-color: rgba(0, 0, 0, .75);
            z-index: -1;
        `,
		open &&
			`
            opacity: 1;
            z-index: 10;
            pointer-events: all;
        `,
	],
)

export const PortfolioModal = styled.div<{ active: boolean }>(({ active }) => [
	tw`w-[75vw] md:w-[50vw] absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-full bg-white`,
	baseTransition(),
	active && tw`-translate-y-1/2`,
])

const basePortfolioModalButtonStyles = css`
	${tw`
        absolute p-4 cursor-pointer 
        text-white text-2xl
        border-none bg-transparent
    `}
	${baseTransition()}
    outline: none;
`

export const PortfolioModalCloseButton = styled.button`
	${basePortfolioModalButtonStyles}
	${tw`top-0 right-0 hover:scale-125`}
`

export const PortfolioModalNavButton = styled.button<{
	action: string
	show: boolean
}>(({ action, show }) => [
	basePortfolioModalButtonStyles,
	tw`top-1/2 -translate-y-1/2`,
	!show && tw`hidden`,
	action === "prev" && tw`left-0 hover:-translate-x-2 md:left-3`,
	action === "next" && tw`right-0 hover:translate-x-2 md:right-3`,
])

export const PortfolioModalImage = tw.img`w-full`
export const PortfolioModalContent = tw.div`p-8`
export const PortfolioModalHeader = tw.div`flex flex-wrap md:block justify-between content-center mb-4`
export const PortfolioModalTitle = tw.h3`flex-grow text-3xl`
export const PorfolioModalTagContainer = tw.h4`gap-x-2 md:text-right flex-grow`
export const PortfolioModalTag = tw.span`inline-block`
export const PortfolioModalDescription = tw.p`text-xl mb-4`
export const PortfolioModalCtaContainer = tw.div`flex flex-wrap`

const basePortfolioModalCtaStyles = css`
	${tw`
        flex flex-grow
        justify-center items-center
        text-white font-semibold text-lg
        text-center no-underline uppercase
        py-6 px-12
        bg-black hover:bg-gray-400
    `}
	letter-spacing: 2px;
	${baseTransition()}
`

export const PortfolioModalInternalCta = styled(Link)`
	${basePortfolioModalCtaStyles}
`
export const PortfolioModalExternalCta = styled.a`
	${basePortfolioModalCtaStyles}
`
