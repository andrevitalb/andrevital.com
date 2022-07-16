import { ArticleList } from "components/Article/ArticleList"
import { Page, PageContentWrapper } from "components/common/layout/layout.atoms"
import { NoContent } from "components/NoContent"
import { getBlogData } from "lib/asyncDataGetters/getBlogData"
import { Article as ArticleProps } from "lib/hooks/useArticle"
import Head from "next/head"

const Blog = ({ articles }: { articles: ArticleProps[] }) => {
	return (
		<div>
			<Head>
				<title>Blog | André Vital</title>
			</Head>
			<Page>
				<PageContentWrapper>
					{!!articles.length ? (
						<ArticleList articles={articles} />
					) : (
						<NoContent />
					)}
				</PageContentWrapper>
			</Page>
		</div>
	)
}

export const getStaticProps = async () => {
	const articles = await getBlogData()
	return {
		props: { articles },
	}
}

export default Blog
