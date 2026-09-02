import { render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Nav } from "./Nav"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}))

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}))

/*
 * The skip link is no longer here: U4b moved it to app/layout.tsx, because it has
 * to be the first focusable element in the document and the bar is not first any
 * more. tests/e2e/interaction.spec.ts holds that contract at both shells.
 *
 * The bar carries two navigations, one per breakpoint: a text row from sm up and
 * a <details> sheet below it. Only one is ever in the accessibility tree, because
 * the other is display:none through `hidden`, but jsdom applies no viewport CSS
 * so both are present here. Every link assertion is therefore scoped to one of
 * them rather than to the document.
 */
function bar() {
	return within(screen.getByRole("navigation", { name: "Primary" }))
}

function sheet() {
	return within(screen.getByRole("navigation", { name: "Primary, mobile" }))
}

describe("Nav", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("always shows About and Contact, in both navigations", () => {
		delete process.env[ENV_KEY]
		render(<Nav name="André Vital" />)
		for (const scope of [bar(), sheet()]) {
			expect(scope.getByRole("link", { name: "About" })).toBeInTheDocument()
			expect(scope.getByRole("link", { name: "Contact" })).toBeInTheDocument()
		}
	})

	it("hides every flaggable section when none are visible", () => {
		delete process.env[ENV_KEY]
		render(<Nav name="André Vital" />)
		for (const name of ["Work", "Craft", "Writing"]) {
			expect(screen.queryByRole("link", { name })).not.toBeInTheDocument()
		}
	})

	it("shows only the visible sections, in both navigations", () => {
		process.env[ENV_KEY] = "craft"
		render(<Nav name="André Vital" />)
		for (const scope of [bar(), sheet()]) {
			expect(scope.getByRole("link", { name: "Craft" })).toBeInTheDocument()
		}
		expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument()
		expect(
			screen.queryByRole("link", { name: "Writing" }),
		).not.toBeInTheDocument()
	})

	it("orders visible sections work, craft, writing regardless of env order", () => {
		process.env[ENV_KEY] = "writing,work"
		render(<Nav name="André Vital" />)
		const labels = bar()
			.getAllByRole("link")
			.map((el) => el.textContent)
		expect(labels.indexOf("Work")).toBeLessThan(labels.indexOf("Writing"))
	})

	it("gives the two navigations distinct accessible names", () => {
		delete process.env[ENV_KEY]
		render(<Nav name="André Vital" />)
		expect(
			screen.getByRole("navigation", { name: "Primary" }),
		).toBeInTheDocument()
		expect(
			screen.getByRole("navigation", { name: "Primary, mobile" }),
		).toBeInTheDocument()
	})

	it("links the logo home", () => {
		delete process.env[ENV_KEY]
		render(<Nav name="André Vital" />)
		expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
			"href",
			"/",
		)
	})
})
