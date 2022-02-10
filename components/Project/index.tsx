import { BaseProject } from "contexts/ProjectsContext"
import {
	ProjectContentHolder,
	ProjectHeaderSection,
	ProjectHeaderTitle,
	ProjectJumbotron,
	ProjectJumbotronLogo,
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
				<ProjectHeaderSection>
					<ProjectHeaderTitle>{name}</ProjectHeaderTitle>
					<ProjectTagContainer>
						{tags.map((tag) => (
							<ProjectTag key={tag}>{tag}</ProjectTag>
						))}
					</ProjectTagContainer>
				</ProjectHeaderSection>
			</ProjectContentHolder>
		</>
	)
}
