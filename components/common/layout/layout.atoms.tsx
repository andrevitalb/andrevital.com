import tw, { styled } from "twin.macro"

export const Jumbotron = styled.section`
	${tw`bg-cover bg-center`}
	background-image: url('/assets/images/bg.jpg');
`
export const JumbotronContent = tw.div`min-h-screen flex items-center text-center`
export const JumbotronContentLayout = tw.div`flex flex-col w-full justify-center items-center`
export const JumbotronHeader = tw.h1`text-white text-8xl font-semibold`
export const JumbotronText = tw.p`uppercase text-gray-200 text-2xl inline-block px-4 border-gray-300 border-r-2 last:border-r-0`
