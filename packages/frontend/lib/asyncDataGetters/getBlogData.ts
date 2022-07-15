import { Article } from "lib/hooks/useArticle"
import { getArticlesQuery } from "lib/hooks/useArticles"
import { asyncApolloClient } from "./asyncApolloClient"

export const getBlogData = async () => {
	const { data } = await asyncApolloClient.query({
		query: getArticlesQuery,
	})

	return data?.articles?.data?.flatMap(
		({ id, attributes }: { id: number; attributes: Article }) => ({
			...attributes,
			id,
		}),
	) as Article[]
}
