import { BaseProject, useProjects } from "contexts/ProjectsContext"
import isEmpty from "lodash/isEmpty"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import {
	PortfolioContainer,
	PortfolioModalCloseButton,
	PortfolioModalContainer,
	PortfolioModalNavButton,
} from "./portfolio.atoms"
import PortfolioItem from "./PortfolioItem"
import PortfolioModal from "./PortfolioModal"

const PortfolioList = () => {
	const location = useLocation()
	const projects = useProjects()
	const [projectCategory, setProjectCategory] = useState<string>(
		location.pathname.split("/")[1],
	)
	const [localProjects, setLocalProjects] = useState<BaseProject[]>([])
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [showPrevNav, setShowPrevNav] = useState<boolean>(false)
	const [showNextNav, setShowNextNav] = useState<boolean>(false)
	const [activeProject, setActiveProject] = useState<string>("")

	const filteredProjects = () =>
		!isEmpty(projects)
			? projects.filter(
					({ category }: { category: string }) =>
						category === projectCategory,
			  )
			: []

	useEffect(() => {
		setProjectCategory(location.pathname.split("/")[1])
		setLocalProjects(filteredProjects())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	const hideModal = () => setModalOpen(false)

	const handleShowNavs = (id: string) => {
		const projectPosition = localProjects.findIndex(
			(project) => project.id === id,
		)
		const totalProjects = localProjects.length

		if (projectPosition === 0) setShowPrevNav(false)
		else if (projectPosition === totalProjects - 1) setShowNextNav(false)
		else {
			setShowPrevNav(true)
			setShowNextNav(true)
		}
	}

	const handlePrevClick = () => changeActiveProject("prev")
	const handleNextClick = () => changeActiveProject("next")

	const changeActiveProject = (id: string) => {
		setModalOpen(true)
		handleShowNavs(id)
		setActiveProject(id)
	}

	return (
		<>
			<PortfolioContainer>
				{localProjects.map(({ id, name, tags }) => (
					<PortfolioItem
						key={id}
						id={id}
						name={name}
						tags={tags}
						imgSrc={`/assets/images/portfolio/${projectCategory}/${id}/thumbnail.jpg`}
						handleClick={changeActiveProject}
					/>
				))}
			</PortfolioContainer>
			<PortfolioModalContainer open={modalOpen} onClick={hideModal}>
				{localProjects.map((project) => (
					<PortfolioModal
						key={project.id}
						active={activeProject === project.id}
						{...project}
					/>
				))}
				<PortfolioModalCloseButton title="Cerrar" onClick={hideModal}>
					<i className="fal fa-times" />
				</PortfolioModalCloseButton>
				<PortfolioModalNavButton
					action="prev"
					title="Previous"
					show={modalOpen && showPrevNav}
					onClick={handlePrevClick}
				>
					<i className="fal fa-chevron-left" />
				</PortfolioModalNavButton>
				<PortfolioModalNavButton
					action="next"
					title="Next"
					show={modalOpen && showNextNav}
					onClick={handleNextClick}
				>
					<i className="fal fa-chevron-right" />
				</PortfolioModalNavButton>
			</PortfolioModalContainer>
		</>
	)
}

export default PortfolioList
