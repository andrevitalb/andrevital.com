import { visibleSections } from "@/lib/sections"

const SECTION_LABEL = {
	work: "Work",
	craft: "Craft",
	writing: "Writing",
} as const

export type NavLinkItem = {
	href: string
	label: string
}

// One source of truth for three shells: the sidebar above lg, the bar below it
// and the sheet below sm. A second hardcoded list is how a flagged-off section
// leaks into a navigation (R2), so the shells take this and never their own.
export function navLinks(): NavLinkItem[] {
	return [
		...visibleSections().map((section) => ({
			href: `/${section}`,
			label: SECTION_LABEL[section],
		})),
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	]
}
