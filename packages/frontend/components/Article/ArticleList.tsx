import { Article as ArticleProps } from "lib/hooks/useArticle"
import Link from "next/link"
import Moment from "react-moment"
import tw from "twin.macro"
import { getSmallestFormatImage } from "util/getSelectFormatImage"

export const ArticleList = ({ articles }: { articles: ArticleProps[] }) => {
	return (
		<section tw="min-h-screen w-full h-full py-10 md:py-20">
			<header tw="space-y-2 text-center mb-8">
				<h1 tw="text-7xl font-bold mb-4">Blog</h1>
				<h3 tw="text-xl text-gray-200">
					Some posts regarding tech, photo or pretty much anything that comes to
					me
				</h3>
			</header>
			<ArticleContainer>
				{articles.map(({ id, slug, title, thumbnail, tags, postDate }) => (
					<ArticleItem key={id} className="group">
						<Link href={`/blog/${slug}`}>
							<ArticleItemContent>
								<img
									src={getSmallestFormatImage(thumbnail.image.formats).url}
									tw="w-full"
									alt={title}
								/>
								<header tw="mt-4">
									<h5 tw="font-semibold text-lg transition-all duration-300 mb-1">
										{title}
									</h5>
									<div tw="flex items-center justify-between text-sm text-gray-200">
										<Moment fromNow>{postDate}</Moment>
										<div tw="flex items-center">
											{tags
												.map(({ value }) => value)
												.slice(0, 3)
												.join(", ")}
										</div>
									</div>
								</header>
							</ArticleItemContent>
						</Link>
					</ArticleItem>
				))}
			</ArticleContainer>
		</section>
	)
}

const ArticleContainer = tw.div`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto`
const ArticleItem = tw.article`col-span-1 p-2`
const ArticleItemContent = tw.div`
	rounded-lg p-6
	bg-gray-500 cursor-pointer 
	transition-all duration-300
	border-2 border-transparent
	group-hover:border-gray-200
`
