import tw, { css, styled } from "twin.macro"

export const AboutBigHeaderOverline = styled.h3`
	${tw`text-aqua-300 font-display text-xl font-normal mb-8`}
	&::before {
		counter-increment: section 1;
		content: "0" counter(section) ".";
		${tw`text-aqua-300 font-display text-lg font-normal mr-4 relative bottom-[-1px]`}
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
  `}
	&::before {
		counter-increment: section 1;
		content: "0" counter(section) ".";
		${tw`text-aqua-300 font-display text-xl font-normal mr-4 relative bottom-[-1px]`}
	}
	&::after {
		${tw`content-[""] h-0.5 w-60 bg-aqua-300 ml-4 relative`}
	}
`

export const AboutText = tw.p`text-gray-200 text-lg mb-4`
export const textHighlightLinkStyles = css`
	${tw`text-aqua-300 cursor-pointer inline-block`}
	&:hover::after {
		${tw`w-full`}
	}
	&::after {
		${tw`
      content-[""] block h-0.5 w-0
      relative bottom-0.5
      bg-aqua-300 opacity-75
    `}
	}
`
export const TextHighlightLink = styled.a`
	${textHighlightLinkStyles}
`
export const TechStackList = styled.ul`
	${tw`grid grid-cols-2 md:grid-cols-3 list-none text-gray-100 mb-4`}
	li {
		&:nth-child(1) {
			order: 1;
		}
		&:nth-child(2) {
			order: 4;
		}
		&:nth-child(3) {
			order: 7;
		}
		&:nth-child(4) {
			order: 2;
		}
		&:nth-child(5) {
			order: 5;
		}
		&:nth-child(6) {
			order: 8;
		}
		&:nth-child(7) {
			order: 3;
		}
		&:nth-child(8) {
			order: 6;
		}
		&:nth-child(9) {
			order: 9;
		}
	}
`

export const TechStackBullet = styled.li`
	${tw`
		flex items-center relative
		pl-6
	`}
	&::before {
		${tw`
      content-["▹"]
			block absolute
			text-aqua-300 left-0 top-0
    `}
	}
	strong {
		${tw`text-aqua-300`}
	}
`
