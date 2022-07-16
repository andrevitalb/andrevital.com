import tw, { styled } from "twin.macro"

export const AboutBigHeaderOverline = styled.h3`
	${tw`
		text-aqua-300 font-display text-xl font-normal mb-8
		before:(text-aqua-300 font-display text-lg font-normal mr-4 relative bottom-[-1px])
	`}
	&::before {
		counter-increment: section 1;
		content: "0" counter(section) ".";
	}
`
export const AboutBigHeader = tw.h2`
	flex flex-col items-center mb-6
	text-6xl text-gray-100 font-semibold
`

export const AboutHeader = styled.h2`
	${tw`
        flex items-center mb-3 whitespace-nowrap relative
        text-3xl text-gray-100 font-semibold
        before:(text-aqua-300 font-display text-xl font-normal mr-4 relative bottom-[-1px])
        after:(content-[""] h-0.5 w-60 bg-aqua-300 ml-4 relative)
    `}
	&::before {
		counter-increment: section 1;
		content: "0" counter(section) ".";
	}
`

export const AboutText = tw.p`text-gray-200 text-lg mb-4`
export const TextHighlightLink = tw.a`
	text-aqua-300 cursor-pointer inline-block
	after:(
		content-[""] block h-0.5 w-0
		relative bottom-0.5
		bg-aqua-300 opacity-75
	)
	hover:after:w-full
`
export const TechStackList = tw.ul`grid grid-cols-2 md:grid-cols-3 list-none text-gray-100 mb-4`
export const TechStackBullet = styled.li`
	${tw`
		flex items-center relative
		pl-6
		before:(
			content-["▹"]
			block absolute
			text-aqua-300 left-0 top-0
		)
	`}
	strong {
		${tw`text-aqua-300`}
	}
`
