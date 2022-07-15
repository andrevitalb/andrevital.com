import { Page, PageContentWrapper } from "components/common/layout/layout.atoms"
import { Project as ProjectBase } from "components/Project"
import { getProjectData } from "lib/asyncDataGetters/getProjectData"
import { getProjectPathsParams } from "lib/asyncDataGetters/getProjectPathsParams"
import { Project as ProjectProps } from "lib/hooks/useProject"
import Head from "next/head"

const Project = ({ project }: { project: ProjectProps }) => {
	return (
		<div>
			<Head>
				<title>{project.name} | André Vital</title>
			</Head>
			<Page>
				<PageContentWrapper>
					<ProjectBase project={project} />
				</PageContentWrapper>
			</Page>
		</div>
	)
}

export const getStaticPaths = async () => {
	const paths = await getProjectPathsParams()

	return {
		paths: paths.map((params) => ({
			params,
		})),
		fallback: false,
	}
}

export const getStaticProps = async ({
	params: { projectId },
}: {
	params: { projectId: string }
}) => {
	const project = await getProjectData(projectId)
	return {
		props: { project },
	}
}

export default Project
