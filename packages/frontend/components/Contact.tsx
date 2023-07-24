import { TextHighlightLink } from "components/About/about.atoms"
import tw, { styled } from "twin.macro"
import { baseTransition } from "./common/mixins"

export const Contact = () => {
	return (
		<div tw="flex flex-col items-center justify-center text-center w-10/12 md:w-full h-screen mx-auto">
			<h2 tw="text-5xl font-bold mb-4">Wanna reach out?</h2>
			<h3 tw="text-3xl">
				Usually, the fastest way to get to me is through{" "}
				<TextHighlightLink href="mailto:contact@andrevital.com">
					my email
				</TextHighlightLink>
				.
			</h3>
			<i tw="text-gray-200 text-lg">
				(It's contact@andrevital.com, if for any reason you just want the email)
			</i>
			<h4 tw="text-2xl mt-10">You could also try some other options:</h4>
			<ul tw="flex flex-wrap items-center justify-center md:justify-between py-4">
				<SocialItemWrapper className="group">
					<SocialItemLink
						href="https://github.com/andrevitalb"
						target="_blank"
						rel="noreferrer noopener"
					>
						<SocialItemIcon className="fab fa-github" />
						@andrevitalb
					</SocialItemLink>
				</SocialItemWrapper>
				<SocialItemWrapper className="group">
					<SocialItemLink
						href="https://linkedin.com/in/andrevitalb"
						target="_blank"
						rel="noreferrer noopener"
					>
						<SocialItemIcon className="fab fa-linkedin" />
						@andrevitalb
					</SocialItemLink>
				</SocialItemWrapper>
				<SocialItemWrapper className="group">
					<SocialItemLink
						href="https://instagram.com/im_andrevital"
						target="_blank"
						rel="noreferrer noopener"
					>
						<SocialItemIcon className="fab fa-instagram" />
						@im_andrevital
					</SocialItemLink>
				</SocialItemWrapper>
				<SocialItemWrapper className="group">
					<SocialItemLink
						href="https://twitter.com/andrevitalb"
						target="_blank"
						rel="noreferrer noopener"
					>
						<SocialItemIcon className="fab fa-twitter" />
						@andrevitalb
					</SocialItemLink>
				</SocialItemWrapper>
			</ul>
		</div>
	)
}

const SocialItemWrapper = styled.li`
	${tw`
    cursor-pointer rounded-md
    p-4 mx-2 text-gray-200
  `}
	${baseTransition(".15s")}
`
const SocialItemIcon = styled.i`
	${tw`text-3xl mb-1 group-hover:text-aqua-300`}
	${baseTransition(".15s")}
`
const SocialItemLink = styled.a`
	${tw`flex flex-col items-center group-hover:text-aqua-300`}
	${baseTransition(".15s")}
`
