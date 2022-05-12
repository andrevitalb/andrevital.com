import { Page } from "components/common/layout/layout.atoms"
import { EmptyPortfolio } from "components/EmptyPortfolio"
import { Navigation } from "components/navigation"
import PortfolioList from "components/Portfolio/PortfolioList"
import { getPortfolioData } from "lib/asyncDataGetters/getPortfolioData"
import { Project as ProjectProps } from "lib/hooks/useProject"
import Head from "next/head"
import { stringCapitalizer } from "util/stringCapitalizer"

const baseCategories = ["develop", "photo"]

const Portfolio = ({
	category,
	portfolio,
}: {
	category: string
	portfolio: ProjectProps[]
}) => {
	return (
		<div>
			<Head>
				<title>{stringCapitalizer(category)} | André Vital</title>
			</Head>
			<Navigation />
			<Page>
				{portfolio.length > 0 ? (
					<PortfolioList portfolio={portfolio} />
				) : (
					<EmptyPortfolio />
				)}
			</Page>
		</div>
	)
}

export const getStaticPaths = async () => {
	return {
		paths: baseCategories.map((category) => ({ params: { category } })),
		fallback: false,
	}
}

export const getStaticProps = async ({
	params: { category },
}: {
	params: { category: string }
}) => {
	const portfolio = await getPortfolioData(category)
	return {
		props: { category, portfolio },
	}
}

export default Portfolio
