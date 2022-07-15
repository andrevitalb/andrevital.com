import { Article as ArticleBase } from "components/Article"
import { Page, PageContentWrapper } from "components/common/layout/layout.atoms"
import { getArticleData } from "lib/asyncDataGetters/getArticleData"
import { getArticlePathsParams } from "lib/asyncDataGetters/getArticlePathsParams"
import { Article as ArticleProps } from "lib/hooks/useArticle"
import Head from "next/head"

const Article = ({ article }: { article: ArticleProps }) => {
	return (
		<div>
			<Head>
				<title>{article.title} | André Vital</title>
			</Head>
			<Page>
				<PageContentWrapper>
					<ArticleBase article={article} />
				</PageContentWrapper>
			</Page>
		</div>
	)
}

export const getStaticPaths = async () => {
	const paths = await getArticlePathsParams()

	return {
		paths: paths.map((params) => ({
			params,
		})),
		fallback: false,
	}
}

export const getStaticProps = async ({
	params: { articleSlug },
}: {
	params: { articleSlug: string }
}) => {
	const article = await getArticleData(articleSlug)
	return {
		props: { article },
	}
}

export default Article
