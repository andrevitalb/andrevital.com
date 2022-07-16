import { gql, useQuery } from "@apollo/client"
import { articleFields } from "lib/fragments/article.fragment"
import { Media } from "lib/fragments/media.fragment"
import { Tag } from "lib/fragments/tag.fragment"
import { sortDataByMainId } from "util/sortDataById"
import { GetArticle } from "./__generated__/get-article"

type ArticleDataType = NonNullable<
	NonNullable<GetArticle["articles"]>["data"]
>[number]
export type ArticleEntityType = {
	id: NonNullable<ArticleDataType["id"]>
	attributes: NonNullable<ArticleDataType["attributes"]>
}

export interface Article {
	id: number
	slug: string
	title: string
	content: string
	tags: Tag[]
	thumbnail: Media
	postDate: string
}

export const getArticleQuery = gql`
	query GetArticle($slug: String) {
		articles(filters: { slug: { eq: $slug } }) {
			data {
				id
				attributes {
					...ArticleFields
				}
			}
		}
	}
	${articleFields}
` as import("./__generated__/get-article").GetArticleDocument

export function useArticle(slug: string) {
	const { data: getArticle } = useQuery(getArticleQuery, {
		variables: { slug },
	})

	return getArticle?.projects?.data?.flatMap((article: ArticleEntityType) =>
		articleAttributesMapper(article),
	)[0] as Article
}

export const articleAttributesMapper = ({
	id,
	attributes,
}: ArticleEntityType) => {
	const tags = !!attributes.tags
		? sortDataByMainId(attributes.tags.data).flatMap(({ attributes }) => ({
				...attributes,
		  }))
		: []

	const thumbnail = { ...attributes.thumbnail.data?.attributes }

	return {
		...attributes,
		id,
		tags,
		thumbnail,
		postDate: attributes.createdAt,
	}
}
