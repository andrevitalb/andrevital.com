export const SECTIONS = ["work", "craft", "writing"] as const

export type Section = (typeof SECTIONS)[number]

function isSection(name: string): name is Section {
	return (SECTIONS as readonly string[]).includes(name)
}

export function visibleSections(): Section[] {
	const raw = process.env.NEXT_PUBLIC_SECTIONS
	if (!raw) return []

	const names = raw
		.split(",")
		.map((name) => name.trim())
		.filter(Boolean)

	const unknown = names.filter((name) => !isSection(name))
	if (unknown.length > 0) {
		console.warn(
			`Unknown section(s) in NEXT_PUBLIC_SECTIONS, ignoring: ${unknown.join(", ")}`,
		)
	}

	return SECTIONS.filter((section) => names.includes(section))
}

export function isVisible(section: Section): boolean {
	return visibleSections().includes(section)
}
