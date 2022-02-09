import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import { Project as ProjectBase } from "components/Project"
import { BaseProject, useProjects } from "contexts/ProjectsContext"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Project = () => {
	const router = useRouter()
	const projects = useProjects()
	const [localProject, setLocalProject] = useState<BaseProject>()

	useEffect(() => {
		setLocalProject(
			projects.find((project) => project.id === router.query.projectId),
		)
	}, [projects, router.query.projectId])

	return (
		<div>
			<Head>
				<title>
					{!!localProject ? localProject.name : "Project"} | André
					Vital
				</title>
			</Head>
			<Navigation />
			<Page>
				{!!localProject && <ProjectBase project={localProject} />}
			</Page>
		</div>
	)
}

export default Project
