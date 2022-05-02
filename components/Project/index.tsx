import { BaseProject } from "contexts/ProjectsContext"
import {
	ProjectContentHolder,
	ProjectHeaderTitle,
	ProjectJumbotron,
	ProjectJumbotronLogo,
	ProjectSection,
	ProjectTag,
	ProjectTagContainer,
} from "./project.atoms"
import { ProjectGalleryWrapper } from "./ProjectGallery"

export const Project = ({
	project,
	prevProjectUrl,
	nextProjectUrl,
}: {
	project: BaseProject
	prevProjectUrl: string
	nextProjectUrl: string
}) => {
	const { id, name, category, tags, accent, galleryUrls } = project

	return (
		<>
			<ProjectJumbotron accent={accent}>
				<ProjectJumbotronLogo
					src={`/images/portfolio/${category}/${id}/logo.svg`}
					alt={name}
				/>
			</ProjectJumbotron>
			<ProjectContentHolder>
				<ProjectSection>
					<ProjectHeaderTitle>{name}</ProjectHeaderTitle>
					<ProjectTagContainer>
						{tags.map((tag) => (
							<ProjectTag key={tag}>{tag}</ProjectTag>
						))}
					</ProjectTagContainer>
				</ProjectSection>
				{galleryUrls.length > 0 && (
					<ProjectSection>
						<ProjectGalleryWrapper
							name={name}
							category={category}
							galleryUrls={galleryUrls}
						/>
					</ProjectSection>
				)}
			</ProjectContentHolder>
		</>
	)
}
