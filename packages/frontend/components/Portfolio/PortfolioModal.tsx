import { Project } from "lib/hooks/useProject"
import { Key } from "react"
import { Return } from "react-cool-onclickoutside"
import { getMediumFormatImage } from "util/getSelectFormatImage"
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
	projectId,
	name,
	description,
	thumbnail,
	category,
	tags,
	externalUrl,
	active,
	onClickOutside,
}: Project & {
	active: boolean
	onClickOutside: Return
	key: Key
}) => {
	return (
		<PortfolioModalBase active={active} ref={onClickOutside}>
			<div>
				<PortfolioModalImage
					src={getMediumFormatImage(thumbnail.formats).url}
					alt={name}
				/>
			</div>
			<div>
				<PortfolioModalContent>
					<PortfolioModalHeader>
						<PortfolioModalTitle>{name}</PortfolioModalTitle>
						<PorfolioModalTagContainer>
							{tags.map(({ id, value }) => (
								<PortfolioModalTag key={id}>{value}</PortfolioModalTag>
							))}
						</PorfolioModalTagContainer>
					</PortfolioModalHeader>
					<PortfolioModalDescription>{description}</PortfolioModalDescription>
				</PortfolioModalContent>
				<PortfolioModalCtaContainer>
					<PortfolioModalInternalCta href={`/${category}/${projectId}`}>
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
