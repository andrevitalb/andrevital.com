import { existsSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { getAll } from "@/lib/content"
import { DEMO_IDS, isDemoId } from "./index"

describe("the craft demo registry", () => {
	it("resolves the logo piece", () => {
		expect(isDemoId("logo-draw")).toBe(true)
	})

	it("rejects an id it does not know", () => {
		expect(isDemoId("not-a-demo")).toBe(false)
		expect(DEMO_IDS).not.toContain("not-a-demo")
	})

	// The build's own check is DemoFrame throwing while it prerenders, which only
	// fires for a piece that is actually built. This one covers every piece in
	// content/, drafts included, and names the offender in a second rather than in
	// a failed build.
	it("has an entry for every component demo in content/craft", () => {
		const missing = getAll("craft")
			.flatMap((piece) =>
				piece.demo?.kind === "component"
					? [{ slug: piece.slug, id: piece.demo.id }]
					: [],
			)
			.filter((piece) => !isDemoId(piece.id))

		expect(missing).toEqual([])
	})

	// Nothing at build time looks inside public/, so this is the only thing that
	// stops a typo in a video path shipping a broken player.
	it("finds the file behind every video demo in content/craft", () => {
		const missing = getAll("craft")
			.flatMap((piece) =>
				piece.demo?.kind === "video"
					? [{ slug: piece.slug, src: piece.demo.src }]
					: [],
			)
			.filter(
				(piece) => !existsSync(path.join(process.cwd(), "public", piece.src)),
			)

		expect(missing).toEqual([])
	})
})
