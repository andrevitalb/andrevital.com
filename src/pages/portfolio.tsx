import PortfolioList from "components/Portfolio/PortfolioList"
import { useLocation } from "react-router-dom"

const Portfolio = () => {
	const location = useLocation()
	return <PortfolioList currentPortfolio={location.pathname.split("/")[1]} />
}

export default Portfolio
