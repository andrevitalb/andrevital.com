import { gql } from "@apollo/client"
import { DeepNonNullable } from "util/deepNonNullable"
import { asyncApolloClient } from "./asyncApolloClient"
import { GetPortfolioPathsParams } from "./__generated__/get-portfolio-paths-params"

const getPortfolioPathsQuery = gql`
	query GetPortfolioPathsParams {
		projects {
			data {
				attributes {
					projectId
					category
				}
			}
		}
	}
` as import("./__generated__/get-portfolio-paths-params").GetPortfolioPathsParamsDocument

// Values are wrongly asserted as possibly null.
// Assuming all values are not null here
const parsePaths = (pathsData: DeepNonNullable<GetPortfolioPathsParams>) =>
	pathsData?.projects.data.map(({ attributes: { projectId, category } }) => ({
		projectId,
		category,
	}))

export const getProjectPathsParams = async () => {
	const { data } = await asyncApolloClient.query({
		query: getPortfolioPathsQuery,
	})

	return parsePaths(data)
}
