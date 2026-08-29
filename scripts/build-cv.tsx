/**
 * Renders the two generated CV artifacts from content/cv.yaml: public/cv.pdf
 * (the "Download CV" target) and content/cv.md (what career-ops reads).
 *
 * Runs as `prebuild`, so any failure here fails the build rather than shipping
 * a site whose CV link 404s or whose PDF is a stale copy of older data.
 *
 * Usage: tsx scripts/build-cv.tsx [contentDir] [pdfPath]
 */
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { renderToFile } from "@react-pdf/renderer"
import { CvPdf } from "../components/cv/CvPdf"
import { getCv, toMarkdown } from "../lib/cv"

const [contentArg, pdfArg] = process.argv.slice(2)
const contentDir = path.resolve(
	contentArg ?? path.join(process.cwd(), "content"),
)
const pdfPath = path.resolve(
	pdfArg ?? path.join(process.cwd(), "public", "cv.pdf"),
)

async function main() {
	const cv = getCv(contentDir)

	const markdownPath = path.join(contentDir, "cv.md")
	writeFileSync(markdownPath, toMarkdown(cv), "utf8")

	mkdirSync(path.dirname(pdfPath), { recursive: true })
	await renderToFile(<CvPdf cv={cv} />, pdfPath)

	console.log(`cv: wrote ${markdownPath} and ${pdfPath}`)
}

main().catch((error: unknown) => {
	console.error("cv: build failed")
	console.error(error)
	process.exit(1)
})
