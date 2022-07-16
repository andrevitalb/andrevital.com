import { articleAttributesMapper, getArticleQuery } from "lib/hooks/useArticle"
import { asyncApolloClient } from "./asyncApolloClient"

export const getArticleData = async (slug: string) => {
	const { data } = await asyncApolloClient.query({
		query: getArticleQuery,
		variables: { slug },
	})

	return articleAttributesMapper(data.articles.data[0])
}
