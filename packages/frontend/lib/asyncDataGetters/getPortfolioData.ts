import { getPortfolioQuery } from "lib/hooks/usePortfolio"
import {
	projectAttributesMapper,
	ProjectEntityType,
} from "lib/hooks/useProject"
import { asyncApolloClient } from "./asyncApolloClient"

export const getPortfolioData = async (categoryName: string) => {
	const { data } = await asyncApolloClient.query({
		query: getPortfolioQuery,
		variables: { categoryName },
	})

	return (
		data.projects.data.flatMap((project: ProjectEntityType) =>
			projectAttributesMapper(project),
		) ?? []
	)
}
