import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import { Project as ProjectBase } from "components/Project"
import { useProject } from "lib/hooks/useProject"
import Head from "next/head"
import { useRouter } from "next/router"

const Project = () => {
	const router = useRouter()
	const project = useProject(
		Array.isArray(router.query.projectId)
			? router.query.projectId[0]
			: router.query.projectId,
	)

	return (
		<div>
			<Head>
				<title>
					{!!project ? project.name : "Project"} | André Vital
				</title>
			</Head>
			<Navigation />
			<Page>{!!project && <ProjectBase project={project} />}</Page>
		</div>
	)
}

export default Project
