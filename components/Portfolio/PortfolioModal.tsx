import { BaseProject } from "contexts/ProjectsContext"
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
}: BaseProject & { active: boolean }) => {
	return (
		<PortfolioModalBase active={active}>
			<div>
				<PortfolioModalImage
					src={`/assets/images/portfolio/${category}/${id}/thumbnail.jpg`}
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
					<PortfolioModalInternalCta
						to={`/${category}/${encodeURIComponent(id)}`}
					>
						View project
					</PortfolioModalInternalCta>
					<PortfolioModalExternalCta
						href={externalUrl}
						target="_blank"
						rel="noreferrer"
					>
						Go to site
					</PortfolioModalExternalCta>
				</PortfolioModalCtaContainer>
			</div>
		</PortfolioModalBase>
	)
}

export default PortfolioModal
