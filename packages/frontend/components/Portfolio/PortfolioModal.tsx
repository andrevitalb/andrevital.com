import { BaseProject } from "contexts/ProjectsContext"
import { Return } from "react-cool-onclickoutside"
import {
	PorfolioModalTagContainer,
	PortfolioModal as PortfolioModalBase,
	PortfolioModalContent,
	PortfolioModalCtaContainer,
	PortfolioModalDescription,
	PortfolioModalExternalCta,
	PortfolioModalHeader,
	PortfolioModalImage,
	PortfolioModalInternalCta,
	PortfolioModalTag,
	PortfolioModalTitle,
} from "./portfolio.atoms"

const PortfolioModal = ({
	id,
	name,
	description,
	category,
	tags,
	externalUrl,
	active,
	onClickOutside,
}: BaseProject & {
	active: boolean
	onClickOutside: Return
}) => {
	return (
		<PortfolioModalBase active={active} ref={onClickOutside}>
			<div>
				<PortfolioModalImage
					src={`/images/portfolio/${category}/${id}/thumbnail.jpg`}
					alt={name}
				/>
			</div>
			<div>
				<PortfolioModalContent>
					<PortfolioModalHeader>
						<PortfolioModalTitle>{name}</PortfolioModalTitle>
						<PorfolioModalTagContainer>
							{tags.map((tag) => (
								<PortfolioModalTag key={tag}>
									{tag}
								</PortfolioModalTag>
							))}
						</PorfolioModalTagContainer>
					</PortfolioModalHeader>
					<PortfolioModalDescription>
						{description}
					</PortfolioModalDescription>
				</PortfolioModalContent>
				<PortfolioModalCtaContainer>
					<PortfolioModalInternalCta href={`/${category}/${id}`}>
						View project
					</PortfolioModalInternalCta>
					{!!externalUrl && (
						<PortfolioModalExternalCta
							href={externalUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							Go to site
						</PortfolioModalExternalCta>
					)}
				</PortfolioModalCtaContainer>
			</div>
		</PortfolioModalBase>
	)
}

export default PortfolioModal
