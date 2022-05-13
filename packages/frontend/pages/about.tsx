import { AboutInfo } from "components/About/AboutInfo"
import { CV } from "components/About/CV"
import { GetInTouch } from "components/About/GetInTouch"
import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import { getJobsData } from "lib/asyncDataGetters/getJobsData"
import { Job } from "lib/hooks/useJobs"
import Head from "next/head"

const About = ({ jobs }: { jobs: Job[] }) => {
	return (
		<div>
			<Head>
				<title>About | André Vital</title>
			</Head>
			<Navigation />
			<Page>
				<AboutInfo />
				<CV jobs={jobs} />
				<GetInTouch />
			</Page>
		</div>
	)
}

export const getStaticProps = async () => {
	const jobs = await getJobsData()
	return {
		props: { jobs },
	}
}

export default About
