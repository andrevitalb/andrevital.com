import { CSSProperties } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import materialOceanic from "react-syntax-highlighter/dist/cjs/styles/prism/material-oceanic"
import remarkGfm from "remark-gfm"

export const MarkdownTextParser = ({ content }: { content: string }) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				code({ node, inline, className, children, style, ...props }) {
					const match = /language-(\w+)/.exec(className || "")
					return !inline && match ? (
						<SyntaxHighlighter
							style={
								materialOceanic as {
									[key: string]: CSSProperties
								}
							}
							showLineNumbers
							wrapLines
							children={String(children).replace(/\n$/, "")}
							language={match[1]}
							PreTag="div"
							tw="rounded-md"
							{...props}
						/>
					) : (
						<code className={className} {...props}>
							{children}
						</code>
					)
				},
			}}
		>
			{content}
		</ReactMarkdown>
	)
}
