import {
	articleAttributesMapper,
	ArticleEntityType,
} from "lib/hooks/useArticle"
import { getArticlesQuery } from "lib/hooks/useArticles"
import { asyncApolloClient } from "./asyncApolloClient"

export const getBlogData = async () => {
	const { data } = await asyncApolloClient.query({
		query: getArticlesQuery,
	})

	return (
		data.articles.data.flatMap((project: ArticleEntityType) =>
			articleAttributesMapper(project),
		) ?? []
	)
}
