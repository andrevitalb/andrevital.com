import { render, screen, within } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { SidebarNav } from "@/components/nav/SidebarNav"

vi.mock("next/navigation", () => ({
	usePathname: () => "/about",
}))

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "dark", setTheme: vi.fn() }),
}))

const LINKS = [
	{ href: "/writing", label: "Writing" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
]

const NAME = "André Vital"

function sidebar(container: HTMLElement) {
	const node = container.querySelector("[data-sidebar]")
	if (!node) throw new Error("no sidebar rendered")
	return node as HTMLElement
}

describe("SidebarNav", () => {
	it("renders every link it is given, in order", () => {
		render(<SidebarNav links={LINKS} name={NAME} />)
		const nav = within(screen.getByRole("navigation", { name: "Primary" }))
		const labels = nav.getAllByRole("link").map((link) => link.textContent)
		expect(labels).toEqual(["Writing", "About", "Contact"])
	})

	// Named "Primary", the same as the bar's row, which is deliberate: the two are
	// swapped by a media query, so only one is ever in the accessibility tree and
	// every existing selector for the primary navigation keeps working at both
	// shells. jsdom applies no viewport CSS, so this file renders it alone.
	it("names its navigation Primary", () => {
		render(<SidebarNav links={LINKS} name={NAME} />)
		expect(
			screen.getByRole("navigation", { name: "Primary" }),
		).toBeInTheDocument()
	})

	it("marks the current section, and only it", () => {
		render(<SidebarNav links={LINKS} name={NAME} />)
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
			"aria-current",
			"page",
		)
		expect(screen.getByRole("link", { name: "Writing" })).not.toHaveAttribute(
			"aria-current",
		)
	})

	it("links the mark home, named for the site", () => {
		render(<SidebarNav links={LINKS} name={NAME} />)
		expect(screen.getByRole("link", { name: `${NAME}, home` })).toHaveAttribute(
			"href",
			"/",
		)
	})

	// The site's only copyright since U4b deleted the footer, so its absence would
	// be silent everywhere else. The rule belongs to the foot rather than to the
	// line, because it runs the column's full width: inset from both edges it read
	// as a dash floating above the text instead of as the foot of the column.
	it("carries the byline in a foot that rules off the whole column", () => {
		const { container } = render(<SidebarNav links={LINKS} name={NAME} />)
		const byline = screen.getByText(`AV @ ${new Date().getFullYear()}`)
		const foot = sidebar(container).lastElementChild as HTMLElement

		expect(foot).toContainElement(byline)
		expect(foot.className).toContain("border-t")
		expect(foot.className).toContain("-mx-sidebar-gutter")
		expect(foot.className).not.toContain("border-b")
	})

	// The toggle left the masthead in the U4b design pass: it is the site's
	// least-used control and it was sitting beside the identity in a 112px slot.
	it("keeps the theme toggle in the foot, not in the masthead", () => {
		const { container } = render(<SidebarNav links={LINKS} name={NAME} />)
		const toggle = screen.getByRole("button", { name: /switch to \w+ theme/i })
		const foot = sidebar(container).lastElementChild as HTMLElement
		const masthead = sidebar(container).firstElementChild as HTMLElement

		expect(foot).toContainElement(toggle)
		expect(masthead).not.toContainElement(toggle)
		expect(masthead).toContainElement(
			screen.getByRole("link", { name: `${NAME}, home` }),
		)
	})

	// It is hidden below lg, where the bar and the sheet are the navigation. Both
	// shells are in the DOM at every viewport, which is exactly why NavLogo has to
	// decide at runtime which mark is the live one.
	it("is hidden below lg", () => {
		const { container } = render(<SidebarNav links={LINKS} name={NAME} />)
		const className = sidebar(container).className
		expect(className).toContain("hidden")
		expect(className).toContain("lg:flex")
	})

	// Server component: the shell renders without a client boundary of its own, so
	// the links work with no JavaScript at all.
	it("renders its links in the server HTML", () => {
		const html = renderToStaticMarkup(<SidebarNav links={LINKS} name={NAME} />)
		for (const link of LINKS) {
			expect(html).toContain(`href="${link.href}"`)
		}
	})
})
