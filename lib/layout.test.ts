import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = path.join(import.meta.dirname, "..")

function sources(dir: string): string[] {
	return readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(
		(entry) => {
			const rel = path.join(dir, entry.name)
			if (entry.isDirectory()) return sources(rel)
			return /\.(tsx?|css)$/.test(entry.name) ? [rel] : []
		},
	)
}

// The grep IS the guard: a rendered-output test only sees the call sites it
// knows about, and a prose mention of the number is a second copy of it.
describe("DIRECTORY_GRID", () => {
	it("is the only place the grid's column width appears", () => {
		const offenders = ["app", "components"]
			.flatMap(sources)
			.filter((file) => file !== "app/globals.css")
			.filter((file) =>
				readFileSync(path.join(ROOT, file), "utf8").includes("11rem"),
			)

		expect(offenders).toEqual([])
	})
})
