import { createContext, ReactNode, useContext, useState } from "react"
import { projectData } from "services/projectData"

export interface GalleryItemType {
	id: string
	assetUrl: string
	thumbnailUrl?: string
	artist?: string
	size?: string
}

export interface BaseProject {
	id: string
	name: string
	description?: string
	category: string
	tags: string[]
	externalUrl?: string
	galleryUrls: GalleryItemType[]
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
