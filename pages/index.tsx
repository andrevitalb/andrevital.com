import { LinkButton } from "components/common/button/LinkButton"
import {
	Jumbotron,
	JumbotronContent,
	JumbotronContentLayout,
	JumbotronHeader,
	JumbotronText,
} from "components/common/layout/layout.atoms"
import Head from "next/head"

export default function Home() {
	return (
		<div>
			<Head>
				<title>André Vital | Software Developer / Photographer</title>
			</Head>
			<main>
				<section>
					<Jumbotron>
						<JumbotronContent>
							<JumbotronContentLayout>
								<div tw="w-full">
									<JumbotronHeader>
										I'm André Vital.
									</JumbotronHeader>
								</div>
								<div tw="w-full">
									<JumbotronText>
										Software Developer
									</JumbotronText>
									<JumbotronText>Photographer</JumbotronText>
								</div>
								<div tw="w-full">
									<LinkButton
										color="transparent"
										to="/contact"
										title="Contact Me"
										tw="text-lg"
									>
										Contact Me
									</LinkButton>
								</div>
							</JumbotronContentLayout>
						</JumbotronContent>
					</Jumbotron>
				</section>
			</main>
		</div>
	)
}
