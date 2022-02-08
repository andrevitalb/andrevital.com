import { createContext, ReactNode, useContext, useState } from "react"
import { projectData } from "services/projectData"

export interface BaseProject {
	id: string
	name: string
	description?: string
	category: string
	tags: string[]
	externalUrl?: string
	imageUrls: string[]
	accent: string
}

const ProjectsContext = createContext<BaseProject[]>([])

export const useProjects = (): BaseProject[] => {
	return useContext(ProjectsContext)
}

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
	const [projects] = useState<BaseProject[]>(projectData)

	return (
		<ProjectsContext.Provider value={projects}>
			{children}
		</ProjectsContext.Provider>
	)
}
