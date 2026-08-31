import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

/*
 * Audit finding 2, as a guard rather than a note. One link class string was
 * pasted eleven times across eight files, so a primary path and a social handle
 * rendered identically. TextLink now owns the hierarchy, and this is what stops
 * the next hurried link from pasting the string back.
 *
 * A test rather than a lint rule because the rule is about one specific literal
 * in one specific file, which biome has no way to express.
 */
const PASTED = "underline decoration-1 decoration-line underline-offset-4"
const OWNER = "components/ui/Link.tsx"

const ROOT = path.resolve(import.meta.dirname, "..")

function sources(dir: string): string[] {
	return readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(
		(entry) => {
			const relative = path.join(dir, entry.name)
			if (entry.isDirectory()) return sources(relative)
			return entry.name.endsWith(".tsx") ? [relative] : []
		},
	)
}

describe("the link class string", () => {
	it("lives in the link primitive and nowhere else", () => {
		const offenders = [...sources("app"), ...sources("components")].filter(
			(file) => readFileSync(path.join(ROOT, file), "utf8").includes(PASTED),
		)

		expect(offenders).toEqual([OWNER])
	})
})
