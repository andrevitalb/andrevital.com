import tw, { styled } from "twin.macro"

export const ProjectJumbotron = styled.div<{ accent: string }>(({ accent }) => [
	tw`min-h-[40vh] flex items-center justify-center`,
	`background: ${accent}`,
])
export const ProjectJumbotronLogo = tw.img`max-w-[80vw] md:max-w-[25vw] max-h-[175px] h-full`
export const ProjectContentHolder = tw.div`bg-white text-black`
export const ProjectSection = tw.section`
	flex items-center justify-center md:justify-between flex-wrap
	py-[7.5vh] px-[8vw]
`
export const ProjectHeaderTitle = tw.h1`text-5xl font-semibold mb-2 md:mb-0 `
export const ProjectTagContainer = tw.div`flex flex-wrap items-center justify-center`
export const ProjectTag = styled.p`
	${tw`text-xl px-4 my-1 border-r-2 border-gray-300`}
	&:last-child {
		${tw`border-r-0`}
	}
`
export const ProjectThumbnail = styled.img`
	${tw`block transition-all duration-[400ms]`}
	&:hover {
		${tw`scale-[1.20]`}
	}
`
