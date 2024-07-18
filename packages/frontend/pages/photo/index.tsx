import { Page, PageContentWrapper } from "components/common/layout/layout.atoms"
import { NoContent } from "components/NoContent"
import PortfolioList from "components/Portfolio/PortfolioList"
import { getPortfolioData } from "lib/asyncDataGetters/getPortfolioData"
import { Project as ProjectProps } from "lib/hooks/useProject"
import Head from "next/head"
import { stringCapitalizer } from "util/stringCapitalizer"

const category = "photo"

const PhotoPortfolio = ({
	category,
	portfolio,
}: {
	category: string
	portfolio: ProjectProps[]
}) => {
	return (
		<div>
			<Head>
				<title>{`${stringCapitalizer(category)} | André Vital`}</title>
			</Head>
			<Page>
				<PageContentWrapper>
					{!!portfolio.length ? (
						<PortfolioList portfolio={portfolio} />
					) : (
						<NoContent />
					)}
				</PageContentWrapper>
			</Page>
		</div>
	)
}

export const getStaticProps = async () => {
	const portfolio = await getPortfolioData(category)
	return {
		props: { category, portfolio },
	}
}

export default PhotoPortfolio
