import { gql } from "@apollo/client"
import { DeepNonNullable } from "util/deepNonNullable"
import { asyncApolloClient } from "./asyncApolloClient"
import { GetBlogPathsParams } from "./__generated__/get-blog-paths-params"

const getBlogPathsQuery = gql`
	query GetBlogPathsParams {
		articles {
			data {
				attributes {
					slug
				}
			}
		}
	}
` as import("./__generated__/get-blog-paths-params").GetBlogPathsParamsDocument

// Values are wrongly asserted as possibly null.
// Assuming all values are not null here
const parsePaths = (pathsData: DeepNonNullable<GetBlogPathsParams>) =>
	pathsData?.articles.data.map(({ attributes: { slug } }) => ({
		articleSlug: slug,
	}))

export const getArticlePathsParams = async () => {
	const { data } = await asyncApolloClient.query({
		query: getBlogPathsQuery,
	})

	return parsePaths(data)
}
