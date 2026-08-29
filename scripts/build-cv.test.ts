import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"

const repoRoot = path.join(import.meta.dirname, "..")
const script = path.join(repoRoot, "scripts", "build-cv.tsx")
const validFixture = path.join(repoRoot, "lib", "__fixtures__", "cv")
const invalidFixture = path.join(repoRoot, "lib", "__fixtures__", "cv-invalid")

function run(contentDir: string, pdfPath: string) {
	return execFileSync(
		"node",
		[
			path.join(repoRoot, "node_modules", "tsx", "dist", "cli.mjs"),
			script,
			contentDir,
			pdfPath,
		],
		{ cwd: repoRoot, encoding: "utf8", stdio: "pipe" },
	)
}

describe("build-cv", () => {
	// Rendering a real PDF through @react-pdf/renderer in a subprocess is slow
	// and this is the only test that proves the pipeline actually produces one.
	it("writes a PDF and the markdown from a content directory", {
		timeout: 60_000,
	}, () => {
		const workDir = mkdtempSync(path.join(tmpdir(), "cv-"))
		writeFileSync(
			path.join(workDir, "cv.yaml"),
			readFileSync(path.join(validFixture, "cv.yaml"), "utf8"),
		)
		const pdfPath = path.join(workDir, "out", "cv.pdf")

		run(workDir, pdfPath)

		const pdf = readFileSync(pdfPath)
		expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-")
		expect(readFileSync(path.join(workDir, "cv.md"), "utf8")).toBe(
			readFileSync(path.join(validFixture, "expected.md"), "utf8"),
		)
	})

	it("exits non-zero on invalid CV data", { timeout: 60_000 }, () => {
		const pdfPath = path.join(mkdtempSync(path.join(tmpdir(), "cv-")), "cv.pdf")
		expect(() => run(invalidFixture, pdfPath)).toThrow(/Second Co\./)
	})
})
