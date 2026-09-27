import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const css = readFileSync(path.join(import.meta.dirname, "globals.css"), "utf8")

/** The body of a named @keyframes block, so a consumer can be read off it. */
function keyframes(name: string) {
	const start = css.indexOf(`@keyframes ${name} {`)
	if (start === -1) throw new Error(`no @keyframes ${name}`)
	let depth = 0
	for (let i = css.indexOf("{", start); i < css.length; i++) {
		if (css[i] === "{") depth++
		if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1)
	}
	throw new Error(`unterminated @keyframes ${name}`)
}

/*
 * Which token each wipe reads, asserted as text, because this exact mistake has
 * now shipped three times and none of the runtime guards can see it.
 *
 * The angle guards in tests/e2e/geometry.spec.ts measure whether each token is
 * right for its own box. They cannot see a consumer reading the token that
 * describes the OTHER box, which is what U4b did to the theme sweep: it took the
 * page's width, the sweep's box is the root snapshot and therefore the whole
 * window, and the swap ran 3.2 degrees off the mark with a clean console, a
 * passing suite and nothing in the DOM to measure.
 *
 * --cut-drop is across the viewport. --cut-drop-page is across the page, which
 * above lg is the viewport less the sidebar.
 */
describe("the cut's drop", () => {
	it("gives the theme sweep the viewport's drop, since its box is the root snapshot", () => {
		const sweep = keyframes("theme-sweep")
		expect(sweep).toContain("var(--cut-drop)")
		expect(sweep).not.toContain("--cut-drop-page")
	})

	// The nav sheet has no keyframes of its own (it is a transition on the panel),
	// so it is covered by the count below: everything that is not the route wipe
	// reads the viewport's drop. The wipe is two layers on one box, the curtain
	// and the edge drawing it, and both read the page's drop: reading --cut-drop
	// would draw the line at the viewport's angle over a page the sidebar
	// narrowed, which is U4b's defect with a bright colour on it.
	it("is read by exactly two consumers, the route curtain and its edge", () => {
		const uses = css.match(/var\(--cut-drop-page\)/g) ?? []
		expect(uses).toHaveLength(10)
		for (const [name, count] of [
			["route-curtain", 6],
			["route-edge", 4],
		] as const) {
			const block = keyframes(name)
			expect(block.match(/var\(--cut-drop-page\)/g)).toHaveLength(count)
			expect(block).not.toContain("--cut-drop)")
		}
	})

	/*
	 * The wipe must not clip the page itself. Clipping `main` measured the sweep
	 * against the document's height and the scroll position: on a long page the
	 * line cleared the fold in the first fifth of the animation, and a back
	 * navigation restored mid-document found everything on screen still clipped.
	 */
	it("leaves the page unclipped and wipes a curtain instead", () => {
		expect(css).not.toMatch(/@keyframes route-enter\b/)
		expect(css).not.toContain("--route-sweep")
	})

	it("defines each token across the box its name claims", () => {
		expect(css).toContain("--cut-drop: calc(100vw * var(--cut-rise));")
		expect(css).toContain(
			"--cut-drop-page: calc((100vw - var(--shell-inset)) * var(--cut-rise));",
		)
	})
})
