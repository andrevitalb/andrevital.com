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

/*
 * The directory grid lives in exactly one place. U3's guard against a pasted
 * link class is the same test for the same reason: this number drifted to two
 * values once, which put About in one column while the Writing index was still
 * in two, and nothing failed. The grep IS the guard, because a rendered-output
 * test can only see the call sites it knows to look at.
 *
 * A prose mention counts as a hit on purpose. A comment naming 11rem is a
 * second copy of the decision, and it goes stale the same way the first one did.
 */
describe("DIRECTORY_GRID", () => {
	it("is the only place the grid's column width appears", () => {
		const offenders = ["app", "components"]
			.flatMap(sources)
			.filter((file) => readFileSync(path.join(ROOT, file), "utf8").includes("11rem"))

		expect(offenders).toEqual([])
	})
})
