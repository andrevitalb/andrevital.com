import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Mdx } from "./Mdx"

describe("Mdx", () => {
	it("renders a code fence with dual-theme shiki attributes", async () => {
		const source = ["# Title", "", "```ts", "const answer = 42", "```"].join(
			"\n",
		)

		const element = await Mdx({ source })
		const html = renderToStaticMarkup(element)

		expect(html).toContain("data-theme")
		expect(html).toContain("--shiki-dark")
		expect(html).toContain("--shiki-light")
	})

	it("renders headings and links from markdown", async () => {
		const source = "# Hello\n\n[a link](https://example.com)"
		const element = await Mdx({ source })
		const html = renderToStaticMarkup(element)

		expect(html).toContain("Hello")
		expect(html).toContain('href="https://example.com"')
	})
})
