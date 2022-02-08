import { BaseProject } from "contexts/ProjectsContext"
import {
	ProjectHeaderSection,
	ProjectHeaderTitle,
	ProjectJumbotron,
	ProjectJumbotronLogo,
	ProjectTagContainer,
} from "./project.atoms"

export const Project = ({ project }: { project: BaseProject }) => {
	const { id, name, category, tags, accent } = project

	return (
		<section className="bg-white">
			<ProjectJumbotron accent={accent}>
				<ProjectJumbotronLogo
					src={`/assets/images/portfolio/${category}/${id}/logo.svg`}
					alt={name}
				/>
			</ProjectJumbotron>
			<ProjectHeaderSection>
				<ProjectHeaderTitle>{name}</ProjectHeaderTitle>
				<ProjectTagContainer>
					{tags.map((tag) => (
						<p key={tag}>{tag}</p>
					))}
				</ProjectTagContainer>
			</ProjectHeaderSection>
		</section>
	)
}
