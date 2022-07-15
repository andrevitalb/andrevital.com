import { gql, useQuery } from "@apollo/client"
import { articleFields } from "lib/fragments/article.fragment"
import { sortDataByDate } from "util/sortDataByDate"
import { Article, articleAttributesMapper } from "./useArticle"

export const getArticlesQuery = gql`
	query GetArticles {
		articles {
			data {
				id
				attributes {
					...ArticleFields
				}
			}
		}
	}
	${articleFields}
` as import("./__generated__/get-articles").GetArticlesDocument

export function useArticles() {
	const { data: getArticles } = useQuery(getArticlesQuery)
	const results: Article[] = getArticles?.articles?.data?.flatMap(
		(project: any) => articleAttributesMapper(project),
	)

	return sortDataByDate(results) as Article[]
}
