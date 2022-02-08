import { BaseProject } from "contexts/ProjectsContext"
import { ProjectJumbotron, ProjectJumbotronLogo } from "./project.atoms"

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
			<section className="project__content">
				<section className="project__section project__section--header">
					<h1 className="project__title">{name}</h1>
					<div className="project__tags">
						<div className="project__tag-container">
							{tags.map((tag) => (
								<div key={tag} className="project__tag">
									<p className="project__tag__text">{tag}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</section>
		</section>
	)
}
