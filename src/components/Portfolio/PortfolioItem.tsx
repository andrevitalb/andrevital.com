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
	id,
	name,
	tags,
	imgSrc,
	handleClick,
}: {
	id: string
	name: string
	tags: string[]
	imgSrc: string
	handleClick: (id: string) => void
}) => {
	const setCurrentProjectActive = () => handleClick(id)

	return (
		<PortfolioItemBase onClick={setCurrentProjectActive}>
			<PortfolioImageContainer>
				<PortfolioImage src={imgSrc} alt={name} />
			</PortfolioImageContainer>
			<PortfolioItemContent>
				<PortfolioItemTitle>{name}</PortfolioItemTitle>
				<PortfolioItemTagContainer>
					{tags.map((tag: string) => (
						<PortfolioItemTag key={tag}>{tag}</PortfolioItemTag>
					))}
				</PortfolioItemTagContainer>
			</PortfolioItemContent>
		</PortfolioItemBase>
	)
}

export default PortfolioItem
