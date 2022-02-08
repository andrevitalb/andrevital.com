import { Project as ProjectBase } from "components/Project"
import { BaseProject, useProjects } from "contexts/ProjectsContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Project = () => {
	const params = useParams()
	const projects = useProjects()
	const [localProject, setLocalProject] = useState<BaseProject>()

	useEffect(() => {
		setLocalProject(
			projects.find((project) => project.id === params.projectId),
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.projectId])

	return <>{!!localProject && <ProjectBase project={localProject} />}</>
}

export default Project
