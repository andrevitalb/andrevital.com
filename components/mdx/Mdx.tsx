import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import { mdxComponents } from "./mdx-components"

const rehypePrettyCodeOptions = {
	theme: {
		dark: "github-dark-default",
		// The high-contrast light theme, not plain github-light-default: its comment
		// grey (#6e7781) is tuned for a pure-white page and only reaches 3.9:1 on any
		// surface this site actually uses, which axe reports as a serious violation.
		// This one's worst token clears 5:1 on --code-bg. See app/globals.css.
		light: "github-light-high-contrast",
	},
	keepBackground: false,
	// Without this, a fence with no language is left untouched: no shiki pass, so
	// no per-line wrapper and no line number, while every labelled block beside it
	// gets both. This post's folder trees and .gitignore blocks are all unlabelled.
	defaultLang: "plaintext",
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
