import tw, { styled } from "twin.macro"

export const ProjectJumbotron = styled.div<{ accent: string }>(({ accent }) => [
	tw`min-h-[40vh] flex items-center justify-center`,
	`background: ${accent}`,
])
export const ProjectJumbotronLogo = tw.img`w-[25vw] max-h-[175px]`
export const ProjectContentHolder = tw.div`bg-white text-black`
export const ProjectHeaderSection = tw.section`
	flex items-center justify-between
	py-[7.5vh] px-[8vw]
	text-base
`
export const ProjectHeaderTitle = tw.h1`text-5xl font-semibold`
export const ProjectTagContainer = tw.div`flex items-center gap-3 after:(content-["|"] block ml-3) last:after:hidden`
