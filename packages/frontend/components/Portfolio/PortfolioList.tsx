import { BaseProject, useProjects } from "contexts/ProjectsContext"
import isEmpty from "lodash/isEmpty"
import { useEffect, useState } from "react"
import useOnclickOutside from "react-cool-onclickoutside"
import {
	PortfolioContainer,
	PortfolioModalCloseButton,
	PortfolioModalContainer,
	PortfolioModalNavButton,
} from "./portfolio.atoms"
import PortfolioItem from "./PortfolioItem"
import PortfolioModal from "./PortfolioModal"

const PortfolioList = ({ projectCategory }: { projectCategory: string }) => {
	const projects = useProjects()
	const [localProjects, setLocalProjects] = useState<BaseProject[]>([])
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [showPrevNav, setShowPrevNav] = useState<boolean>(false)
	const [showNextNav, setShowNextNav] = useState<boolean>(false)
	const [activeProject, setActiveProject] = useState<string>("")
	const registerRef = useOnclickOutside(() => hideModal())

	const filteredProjects = () =>
		!isEmpty(projects)
			? projects.filter(
					({ category }: { category: string }) =>
						category === projectCategory,
			  )
			: []

	useEffect(() => {
		setLocalProjects(filteredProjects())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectCategory])

	const hideModal = () => setModalOpen(false)

	const handleShowNavs = (id: string) => {
		const projectPosition = localProjects.findIndex(
			(project) => project.id === id,
		)

		if (projectPosition === 0) setShowPrevNav(false)
		else if (projectPosition === localProjects.length - 1)
			setShowNextNav(false)
		else {
			setShowPrevNav(true)
			setShowNextNav(true)
		}
	}

	const handlePrevClick = () => changeActiveProject("prev")
	const handleNextClick = () => changeActiveProject("next")

	const getWantedId = (direction: string) => {
		const projectPosition = localProjects.findIndex(
			({ id }) => id === activeProject,
		)
		const wantedId =
			direction === "prev" ? projectPosition - 1 : projectPosition + 1
		return localProjects[wantedId]?.id
	}

	const changeActiveProject = (id: string) => {
		setModalOpen(true)
		const desiredId = !["prev", "next"].includes(id) ? id : getWantedId(id)
		handleShowNavs(desiredId)
		setActiveProject(desiredId)
	}

	return (
		<>
			<PortfolioContainer>
				{localProjects.map(({ id, name, tags, category }) => (
					<PortfolioItem
						key={id}
						id={id}
						name={name}
						tags={tags}
						imgSrc={`/images/portfolio/${category}/${id}/thumbnail.jpg`}
						handleClick={changeActiveProject}
					/>
				))}
			</PortfolioContainer>
			<PortfolioModalContainer open={modalOpen}>
				{localProjects.map((project) => (
					<PortfolioModal
						key={project.id}
						active={activeProject === project.id}
						onClickOutside={registerRef}
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
					ref={registerRef}
				>
					<i className="fal fa-chevron-left" />
				</PortfolioModalNavButton>
				<PortfolioModalNavButton
					action="next"
					title="Next"
					show={modalOpen && showNextNav}
					onClick={handleNextClick}
					ref={registerRef}
				>
					<i className="fal fa-chevron-right" />
				</PortfolioModalNavButton>
			</PortfolioModalContainer>
		</>
	)
}

export default PortfolioList
