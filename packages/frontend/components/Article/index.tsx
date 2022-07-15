import { Article as ArticleProps } from "lib/hooks/useArticle"

export const Article = ({ article }: { article: ArticleProps }) => {
	const { title } = article
	return <main>{title}</main>
}
