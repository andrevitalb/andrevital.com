import { LinkButton } from "components/common/button/LinkButton"
import {
	AboutBigHeader,
	AboutBigHeaderOverline,
	AboutText,
} from "./about.atoms"

export const GetInTouch = () => {
	return (
		<section tw="flex justify-center items-center h-full w-full py-[100px] mb-8 md:mb-[100px]">
			<div tw="max-w-[90vw] md:max-w-[30vw] p-6 md:py-0 text-center">
				<div tw="flex flex-col justify-center items-center">
					<AboutBigHeaderOverline>
						What's next?
					</AboutBigHeaderOverline>
					<AboutBigHeader>Get In Touch</AboutBigHeader>
					<AboutText>
						Although I'm not currently looking for any new
						opportunities, my inbox is always open. Whether you have
						a question or just want to say hi, I'll try my best to
						get back to you!
					</AboutText>
					<LinkButton href="/contact" tw="max-w-max mt-4">
						Say Hi
					</LinkButton>
				</div>
			</div>
		</section>
	)
}
