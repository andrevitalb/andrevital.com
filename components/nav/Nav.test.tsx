import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Nav } from "./Nav"

const ENV_KEY = "NEXT_PUBLIC_SECTIONS"

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}))

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}))

describe("Nav", () => {
	afterEach(() => {
		delete process.env[ENV_KEY]
	})

	it("always shows About and Contact", () => {
		delete process.env[ENV_KEY]
		render(<Nav />)
		expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument()
	})

	it("hides every flaggable section when none are visible", () => {
		delete process.env[ENV_KEY]
		render(<Nav />)
		expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument()
		expect(
			screen.queryByRole("link", { name: "Craft" }),
		).not.toBeInTheDocument()
		expect(
			screen.queryByRole("link", { name: "Writing" }),
		).not.toBeInTheDocument()
	})

	it("shows only the visible sections", () => {
		process.env[ENV_KEY] = "craft"
		render(<Nav />)
		expect(screen.getByRole("link", { name: "Craft" })).toBeInTheDocument()
		expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument()
		expect(
			screen.queryByRole("link", { name: "Writing" }),
		).not.toBeInTheDocument()
	})

	it("orders visible sections work, craft, writing regardless of env order", () => {
		process.env[ENV_KEY] = "writing,work"
		render(<Nav />)
		const labels = screen.getAllByRole("link").map((el) => el.textContent)
		expect(labels.indexOf("Work")).toBeLessThan(labels.indexOf("Writing"))
	})

	it("renders a skip link to #main as the first focusable element", () => {
		delete process.env[ENV_KEY]
		render(<Nav />)
		const links = screen.getAllByRole("link")
		expect(links[0]).toHaveAttribute("href", "#main")
		expect(links[0]).toHaveTextContent("Skip to content")
	})

	it("links the logo home", () => {
		delete process.env[ENV_KEY]
		render(<Nav />)
		expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
			"href",
			"/",
		)
	})
})
