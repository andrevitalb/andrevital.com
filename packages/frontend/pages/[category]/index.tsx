import { Page } from "components/common/layout/layout.atoms"
import { Navigation } from "components/navigation"
import PortfolioList from "components/Portfolio/PortfolioList"
import Head from "next/head"
import { useRouter } from "next/router"
import { stringCapitalizer } from "util/stringCapitalizer"
import { stringFromRouterQuery } from "util/stringFromRouterQuery"

const Portfolio = () => {
	const router = useRouter()
	const category = stringFromRouterQuery(router, "category")
	return (
		<div>
			<Head>
				<title>
					{!!category ? stringCapitalizer(category) : "Portfolio"} |
					André Vital
				</title>
			</Head>
			<Navigation />
			<Page>
				{!!category && <PortfolioList projectCategory={category} />}
			</Page>
		</div>
	)
}

export default Portfolio
