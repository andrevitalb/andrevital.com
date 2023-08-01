import tw, { styled } from "twin.macro"

export const Page = styled.div`
	${tw`w-full h-full min-h-screen md:(ml-[100px] w-[calc(100% - 100px)])`}
	counter-reset: section 0;
`

export const PageContentWrapper = tw.div`max-h-[calc(100vh - 100px)] overflow-y-scroll md:(max-h-screen overflow-y-auto)`

export const Jumbotron = styled.section`
	${tw`bg-cover bg-center`}
	background-image: url('/images/bg.jpg');
`
export const JumbotronContent = tw.div`min-h-screen flex items-center text-center`
export const JumbotronContentLayout = tw.div`flex flex-col w-full justify-center items-center`
export const JumbotronHeader = tw.h1`text-white text-6xl md:text-8xl font-semibold`
export const JumbotronText = styled.p`
	${tw`uppercase text-gray-100 text-lg md:text-2xl inline-block px-4 border-gray-100 border-r-2`}
	&:last-child {
		${tw`border-r-0`}
	}
`
