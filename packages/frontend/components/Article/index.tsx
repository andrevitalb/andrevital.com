import { MarkdownTextParser } from "components/common/MarkdownTextParser"
import { Article as ArticleProps } from "lib/hooks/useArticle"
import Link from "next/link"
import Moment from "react-moment"
import tw, { styled } from "twin.macro"
import { getBiggestFormatImage } from "util/getSelectFormatImage"

export const Article = ({ article }: { article: ArticleProps }) => {
	const { title, content, tags, thumbnail, postDate } = article
	return (
		<section tw="min-h-screen w-full h-full py-10 md:py-20">
			<article tw="w-full max-w-3xl mx-auto">
				<header>
					<Link href="/blog">
						<p
							className="group"
							tw="mb-6 cursor-pointer text-aqua-200"
						>
							<i
								className="far fa-chevron-left"
								tw="transition-all duration-200 group-hover:-translate-x-2"
							/>
							<span
								tw="
									ml-4 pb-2
									transition-all duration-100
									border-b border-transparent
									group-hover:border-aqua-200
								"
							>
								Go Back
							</span>
						</p>
					</Link>
					<h1 tw="text-4xl font-bold mb-2">{title}</h1>
					<div tw="flex items-center justify-between text-gray-200">
						<Moment fromNow>{postDate}</Moment>
						<div tw="flex items-center">
							{tags
								.map(({ value }) => value)
								.slice(0, 3)
								.join(", ")}
						</div>
					</div>
				</header>
				<img
					tw="w-full my-8"
					src={getBiggestFormatImage(thumbnail.image.formats).url}
					alt={title}
				/>
				<ArticleContent>
					<MarkdownTextParser content={content} />
				</ArticleContent>
			</article>
		</section>
	)
}

const ArticleContent = styled.div`
	p {
		${tw`my-4`}
	}
	pre {
		${tw`text-sm my-6`}
	}
	a {
		${tw`underline text-aqua-200 hover:text-aqua-400`}
	}
`
