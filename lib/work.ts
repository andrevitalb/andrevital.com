import type { Work } from "./schemas"

export const KIND_LABEL = {
	client: "Client",
	personal: "Personal",
	tool: "Tool",
} as const

// R12: client and personal before tool, each group keeping getAll's date order.
export const KIND_ORDER = ["client", "personal", "tool"] as const

export function sortByDefaultOrder<T extends Work>(entries: T[]): T[] {
	return [...entries].sort(
		(a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind),
	)
}

export function kindsPresent(entries: Work[]): Work["kind"][] {
	return KIND_ORDER.filter((kind) =>
		entries.some((entry) => entry.kind === kind),
	)
}
