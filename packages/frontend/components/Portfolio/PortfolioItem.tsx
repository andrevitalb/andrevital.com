import { Tag } from "lib/fragments/tag.fragment"
import { Key } from "react"
import {
	PortfolioImage,
	PortfolioImageContainer,
	PortfolioItem as PortfolioItemBase,
	PortfolioItemContent,
	PortfolioItemTag,
	PortfolioItemTagContainer,
	PortfolioItemTitle,
} from "./portfolio.atoms"

const PortfolioItem = ({
	projectId,
	name,
	tags,
	imgSrc,
	handleClick,
}: {
	projectId: string
	name: string
	tags: Tag[]
	imgSrc: string
	handleClick: (projectId: string) => void
	key: Key
}) => {
	const setCurrentProjectActive = () => handleClick(projectId)

	return (
		<PortfolioItemBase onClick={setCurrentProjectActive} className="group">
			<PortfolioImageContainer>
				<PortfolioImage src={imgSrc} alt={name} />
			</PortfolioImageContainer>
			<PortfolioItemContent>
				<PortfolioItemTitle>{name}</PortfolioItemTitle>
				<PortfolioItemTagContainer>
					{tags.map(({ id, value }) => (
						<PortfolioItemTag key={id}>{value}</PortfolioItemTag>
					))}
				</PortfolioItemTagContainer>
			</PortfolioItemContent>
		</PortfolioItemBase>
	)
}

export default PortfolioItem
