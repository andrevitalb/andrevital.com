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

	it("gives the route wipe the page's drop, since its box lives inside main", () => {
		const route = keyframes("route-enter")
		expect(route).toContain("var(--cut-drop-page)")
	})

	// The nav sheet has no keyframes of its own (it is a transition on the panel),
	// so it is covered by the count below: everything that is not route-enter reads
	// the viewport's drop.
	it("is read by exactly one consumer, the route wipe", () => {
		const uses = css.match(/var\(--cut-drop-page\)/g) ?? []
		expect(uses).toHaveLength(2)
		expect(
			keyframes("route-enter").match(/var\(--cut-drop-page\)/g),
		).toHaveLength(2)
	})

	it("defines each token across the box its name claims", () => {
		expect(css).toContain("--cut-drop: calc(100vw * var(--cut-rise));")
		expect(css).toContain(
			"--cut-drop-page: calc((100vw - var(--shell-inset)) * var(--cut-rise));",
		)
	})
})
