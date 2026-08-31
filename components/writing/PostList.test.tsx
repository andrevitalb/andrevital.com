import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { Post } from "@/lib/schemas"
import { PostList } from "./PostList"

const post: Post = {
	title: "Setting up a multi-package project",
	slug: "setting-up-a-multi-package-project",
	summary: "A walk through wiring a yarn workspaces monorepo.",
	date: new Date("2023-04-10T00:00:00.000Z"),
	status: "published",
	tags: ["git", "project-setup"],
}

describe("PostList", () => {
	// The date assertion doubles as the UTC guard: this machine and CI both run
	// west of Greenwich, so a formatter without an explicit UTC zone would print
	// 9 Apr for a front matter date of 2023-04-10.
	it("renders R18's title, date and tags, linked to the post", () => {
		render(<PostList posts={[post]} />)

		expect(
			screen.getByRole("link", { name: new RegExp(post.title) }),
		).toHaveAttribute("href", `/writing/${post.slug}`)
		expect(screen.getByText("10 Apr 2023")).toBeInTheDocument()
		for (const tag of post.tags) {
			expect(screen.getByText(tag)).toBeInTheDocument()
		}
	})

	// Positional, so a draft dropped in production cannot leave a gap. Newest
	// first, which is getAll's ordering, so the highest number is at the top.
	it("numbers the entries from the rendered order", () => {
		render(
			<PostList
				posts={[
					{ ...post, slug: "c" },
					{ ...post, slug: "b" },
					{ ...post, slug: "a" },
				]}
			/>,
		)

		expect(
			screen
				.getAllByRole("listitem")
				.map((item) => item.textContent?.slice(0, 2)),
		).toEqual(["03", "02", "01"])
	})

	it("says so rather than rendering an empty list", () => {
		render(<PostList posts={[]} />)

		expect(screen.getByText("Nothing published yet.")).toBeInTheDocument()
		expect(screen.queryByRole("list")).not.toBeInTheDocument()
	})
})
