import tw, { styled } from "twin.macro"

export const ProjectJumbotron = styled.div<{ accent: string }>(({ accent }) => [
	tw`min-h-[40vh] flex items-center justify-center`,
	`background: ${accent}`,
])
export const ProjectJumbotronLogo = tw.img`w-[25vw] max-h-[175px]`
export const ProjectContentHolder = tw.div`bg-white text-black`
export const ProjectSection = tw.section`
	flex items-center justify-between
	py-[7.5vh] px-[8vw]
`
export const ProjectHeaderTitle = tw.h1`text-5xl font-semibold`
export const ProjectTagContainer = tw.div`flex items-center`
export const ProjectTag = tw.p`text-xl px-4 border-r-2 border-gray-300 last:border-r-0`
