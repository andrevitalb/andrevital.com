import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { mdxComponents } from "./mdx-components"

const rehypePrettyCodeOptions = {
	theme: {
		dark: "github-dark-default",
		light: "github-light-default",
	},
	keepBackground: false,
}

export async function Mdx({ source }: { source: string }) {
	const { content } = await compileMDX({
		source,
		components: mdxComponents,
		options: {
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
			},
		},
	})

	return content
}
