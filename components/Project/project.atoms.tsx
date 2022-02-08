import tw, { styled } from "twin.macro"

export const ProjectJumbotron = styled.div<{ accent: string }>(({ accent }) => [
	tw`min-h-[40vh] flex items-center justify-center`,
	`background: ${accent}`,
])
export const ProjectJumbotronLogo = tw.img`w-[25vw] max-h-[175px]`
export const ProjectHeaderSection = tw.section`
	flex items-center justify-between
	pt-[10vh] px-[8vw] pb-[5vh]
	text-base
`
export const ProjectHeaderTitle = tw.h1`text-5xl mb-4`
export const ProjectTagContainer = tw.div`flex items-center gap-3 after:(content-["|"] block ml-3) last:after:hidden`
