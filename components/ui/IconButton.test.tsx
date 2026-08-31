import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { IconButton } from "@/components/ui/IconButton"

describe("IconButton", () => {
	it("names itself from the label", () => {
		render(
			<IconButton label="Switch to light theme">
				<svg />
			</IconButton>,
		)
		expect(
			screen.getByRole("button", { name: "Switch to light theme" }),
		).toBeInTheDocument()
	})

	it("defaults to type button so it never submits a form", () => {
		render(
			<IconButton label="Close">
				<svg />
			</IconButton>,
		)
		expect(screen.getByRole("button")).toHaveAttribute("type", "button")
	})

	it("fires onClick", async () => {
		const onClick = vi.fn()
		render(
			<IconButton label="Close" onClick={onClick}>
				<svg />
			</IconButton>,
		)
		await userEvent.click(screen.getByRole("button"))
		expect(onClick).toHaveBeenCalledOnce()
	})

	// The label is the accessible name. A glyph that also exposed itself would
	// double it up.
	it("hides the glyph from assistive technology", () => {
		render(
			<IconButton label="Close">
				<svg data-testid="glyph" />
			</IconButton>,
		)
		expect(screen.getByTestId("glyph").parentElement).toHaveAttribute(
			"aria-hidden",
			"true",
		)
	})
})
