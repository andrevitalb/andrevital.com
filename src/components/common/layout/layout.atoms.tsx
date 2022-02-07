import styled from "@emotion/styled"
import tw from "twin.macro"

export const Jumbotron = styled.section`
	${tw`bg-cover bg-center`}
	background-image: url('/assets/images/bg.jpg');
`
export const JumbotronContent = tw.div`min-h-screen flex items-center text-center`
export const JumbotronContentLayout = tw.div`flex w-full justify-center`
export const JumbotronHeader = tw.h1`text-white text-8xl`
export const JumbotronText = tw.p`uppercase text-gray-200 text-2xl inline-block px-4 border-gray-300 border-r-2 last:border-r-0`
