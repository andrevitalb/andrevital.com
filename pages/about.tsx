import { AboutInfo } from "components/About/AboutInfo"
import { CV } from "components/About/CV"
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
			<Page>
				<AboutInfo />
				<CV />
			</Page>
		</div>
	)
}

export default About
