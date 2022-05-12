import { Project as ProjectProps } from "lib/hooks/useProject"
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

export const Project = ({ project }: { project: ProjectProps }) => {
	const { name, category, tags, accentColor, galleryAssets, logo } = project

	return (
		<>
			<ProjectJumbotron accent={accentColor}>
				<ProjectJumbotronLogo src={logo.url} alt={name} />
			</ProjectJumbotron>
			<ProjectContentHolder>
				<ProjectSection>
					<ProjectHeaderTitle>{name}</ProjectHeaderTitle>
					<ProjectTagContainer>
						{tags.map(({ id, value }) => (
							<ProjectTag key={id}>{value}</ProjectTag>
						))}
					</ProjectTagContainer>
				</ProjectSection>
				<ProjectSection>
					<ProjectGalleryWrapper
						name={name}
						category={category}
						galleryUrls={galleryAssets}
					/>
				</ProjectSection>
			</ProjectContentHolder>
		</>
	)
}
