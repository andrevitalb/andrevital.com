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

export const Project = ({ project }: { project: BaseProject }) => {
	const { id, name, category, tags, accent } = project

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
			</ProjectContentHolder>
		</>
	)
}
