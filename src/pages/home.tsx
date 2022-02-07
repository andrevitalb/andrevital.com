import { LinkButton } from "components/common/button/LinkButton"
import {
	Jumbotron,
	JumbotronContent,
	JumbotronContentLayout,
	JumbotronHeader,
	JumbotronText,
} from "components/common/layout/layout.atoms"

const Home = () => {
	return (
		<section className="home">
			<Jumbotron>
				<JumbotronContent>
					<JumbotronContentLayout>
						<div tw="w-full">
							<JumbotronHeader>I'm André Vital.</JumbotronHeader>
						</div>
						<div tw="w-full">
							<JumbotronText>Software Developer</JumbotronText>
							<JumbotronText>Photographer</JumbotronText>
						</div>
						<div tw="w-full">
							<LinkButton
								color="transparent"
								to="/contact"
								title="Contact Me"
							>
								Contact Me
							</LinkButton>
						</div>
					</JumbotronContentLayout>
				</JumbotronContent>
			</Jumbotron>
		</section>
	)
}

export default Home
