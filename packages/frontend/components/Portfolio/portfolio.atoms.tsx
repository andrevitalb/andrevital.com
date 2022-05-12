import { baseTransition } from "components/common/mixins"
import Link from "next/link"
import { ReactNode } from "react"
import tw, { css, styled } from "twin.macro"

export const PortfolioContainer = tw.div`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

// PortfolioItem elements
export const PortfolioItem = tw.div`col-span-1 min-h-[300px] relative cursor-pointer overflow-hidden`
export const PortfolioImageContainer = styled.div`
	${tw`
		w-full h-full 
		after:(
			content-[""]
			w-full h-full
			bg-aqua-300
			absolute top-0 left-0
			z-[2] -translate-x-full
		)
		group-hover:after:translate-x-0
	`}
	${baseTransition()}
    &::after {
		${baseTransition()}
	}
`
export const PortfolioImage = styled.img`
	${tw`w-full h-full object-cover group-hover:scale-105`}
	${baseTransition()}
`
export const PortfolioItemContent = styled.div`
	${tw`
		w-full text-center text-blue-300
		absolute top-1/2 -left-1/2 
		-translate-x-1/2 -translate-y-1/2
		z-[4] 
		group-hover:left-1/2
	`}
	${baseTransition()}
`
export const PortfolioItemTitle = tw.h3`text-3xl font-semibold`
export const PortfolioItemTagContainer = tw.p`text-lg font-light mt-2`
export const PortfolioItemTag = tw.span`py-0.5 px-2 border-gray-300 border-r-2 last:border-r-0`

// PortfolioModal elements
export const PortfolioModalContainer = styled.div<{ open: boolean }>(
	({ open }) => [
		tw`
			fixed top-0 left-0 
			h-full w-full 
			opacity-0 z-[-1]
			bg-black bg-opacity-75 
			md:(ml-[100px] w-[calc(100% - 100px)])
		`,
		baseTransition(".5s"),
		open && tw`opacity-100 z-10 pointer-events-auto`,
	],
)

export const PortfolioModal = styled.div<{ active: boolean }>(({ active }) => [
	tw`
		w-[75vw] md:w-[50vw] 
		bg-white text-black
		absolute top-1/2 left-1/2
		-translate-x-1/2 translate-y-full
	`,
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
export const PortfolioModalHeader = tw.div`flex flex-col flex-wrap md:flex-row justify-between content-center mb-4`
export const PortfolioModalTitle = tw.h3`flex-grow text-3xl mb-3 md:mb-0`
export const PorfolioModalTagContainer = tw.h4`flex items-center justify-center gap-x-3 md:justify-end flex-grow`
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
        bg-black hover:bg-gray-300
    `}
	letter-spacing: 2px;
	${baseTransition()}
`

export const PortfolioModalInternalCta = ({
	href,
	children,
	...props
}: {
	href: string
	children: ReactNode
}) => {
	return (
		<Link href={href} passHref>
			{/* 
				This currently has issues due to problems with @types/react.
				Check https://github.com/vercel/next.js/issues/35986 for more details
			*/}
			{/* @ts-ignore */}
			<InternalCtaBase {...props}>{children}</InternalCtaBase>
		</Link>
	)
}

const InternalCtaBase = styled.a`
	${basePortfolioModalCtaStyles}
`
export const PortfolioModalExternalCta = styled.a`
	${basePortfolioModalCtaStyles}
`
