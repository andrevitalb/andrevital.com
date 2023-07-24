import { InternalLinkButton } from "components/common/button/LinkButton"
import {
	Jumbotron,
	JumbotronContent,
	JumbotronContentLayout,
	JumbotronHeader,
	JumbotronText,
} from "components/common/layout/layout.atoms"

export const HomeBanner = () => {
	return (
		<Jumbotron>
			<JumbotronContent>
				<JumbotronContentLayout>
					<div tw="w-full">
						<JumbotronHeader>I'm André Vital.</JumbotronHeader>
					</div>
					<div tw="w-full mt-2 mb-4">
						<JumbotronText>Software Developer</JumbotronText>
						<JumbotronText>Photographer</JumbotronText>
					</div>
					<div tw="w-full">
						<InternalLinkButton href="/contact" tw="text-lg mt-2">
							Contact Me
						</InternalLinkButton>
					</div>
				</JumbotronContentLayout>
			</JumbotronContent>
		</Jumbotron>
	)
}
