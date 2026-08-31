import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LINK_CLASS, TextLink } from "@/components/ui/Link"

describe("TextLink", () => {
	it("defaults to the secondary variant", () => {
		render(<TextLink href="/about">More about me</TextLink>)
		expect(screen.getByRole("link")).toHaveClass(
			...LINK_CLASS.secondary.split(" "),
		)
	})

	it("applies the requested variant", () => {
		render(
			<TextLink href="/about" variant="primary">
				More about me
			</TextLink>,
		)
		expect(screen.getByRole("link")).toHaveClass(
			...LINK_CLASS.primary.split(" "),
		)
	})

	it("gives every variant a distinct class string", () => {
		const values = Object.values(LINK_CLASS)
		expect(new Set(values).size).toBe(values.length)
	})

	it("adds rel and target for an external link", () => {
		render(
			<TextLink href="https://github.com/andrevitalb" external>
				GitHub
			</TextLink>,
		)
		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", "noreferrer noopener")
	})

	it("does not set target on an internal link", () => {
		render(<TextLink href="/about">About</TextLink>)
		expect(screen.getByRole("link")).not.toHaveAttribute("target")
	})

	// mailto: and https: must not go through next/link, which would prefetch
	// them as route payloads.
	it("renders a plain anchor for a mailto href", () => {
		render(<TextLink href="mailto:contact@andrevital.com">Email</TextLink>)
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			"mailto:contact@andrevital.com",
		)
	})

	it("merges a caller className", () => {
		render(
			<TextLink href="/about" className="text-hero">
				About
			</TextLink>,
		)
		expect(screen.getByRole("link")).toHaveClass("text-hero")
	})
})
