import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import Head from "next/head"

const About = () => {
	return (
		<div>
			<Head>
				<title>About | André Vital</title>
			</Head>
			<Navigation />
			<Page></Page>
		</div>
	)
}

export default About
