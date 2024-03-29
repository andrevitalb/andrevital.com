import { Project as ProjectProps } from "lib/hooks/useProject"
import { useState } from "react"
import useOnclickOutside from "react-cool-onclickoutside"
import PortfolioItem from "./PortfolioItem"
import PortfolioModal from "./PortfolioModal"
import {
	PortfolioContainer,
	PortfolioModalCloseButton,
	PortfolioModalContainer,
	PortfolioModalNavButton,
} from "./portfolio.atoms"

const PortfolioList = ({ portfolio }: { portfolio: ProjectProps[] }) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [showPrevNav, setShowPrevNav] = useState<boolean>(false)
	const [showNextNav, setShowNextNav] = useState<boolean>(false)
	const [activeProject, setActiveProject] = useState<string>("")
	const registerRef = useOnclickOutside(() => hideModal())

	const hideModal = () => setModalOpen(false)

	const handleShowNavs = (id: string) => {
		const projectPosition = portfolio.findIndex(
			({ projectId }) => projectId === id,
		)

		if (projectPosition === 0) setShowPrevNav(false)
		else if (projectPosition === portfolio.length - 1) setShowNextNav(false)
		else {
			setShowPrevNav(true)
			setShowNextNav(true)
		}
	}

	const handlePrevClick = () => changeActiveProject("prev")
	const handleNextClick = () => changeActiveProject("next")

	const getWantedId = (direction: string) => {
		const projectPosition = portfolio.findIndex(
			({ projectId }) => projectId === activeProject,
		)
		const wantedId =
			direction === "prev" ? projectPosition - 1 : projectPosition + 1
		return portfolio[wantedId]?.projectId
	}

	const changeActiveProject = (projectId: string) => {
		setModalOpen(true)
		const desiredId = !["prev", "next"].includes(projectId)
			? projectId
			: getWantedId(projectId)
		handleShowNavs(desiredId)
		setActiveProject(desiredId)
	}

	return (
		<>
			<PortfolioContainer>
				{portfolio.map(({ id, projectId, name, tags, thumbnail }) => (
					<PortfolioItem
						key={`item-${+id}`}
						projectId={projectId}
						name={name}
						tags={tags}
						imgSrc={thumbnail.formats.small.url}
						handleClick={changeActiveProject}
					/>
				))}
			</PortfolioContainer>
			<PortfolioModalContainer open={modalOpen}>
				{portfolio.map((project) => (
					<PortfolioModal
						key={`modal-${+project.id}`}
						active={activeProject === project.projectId}
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
