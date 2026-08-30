import dynamic from "next/dynamic"
import type { ComponentType } from "react"

// A piece's `demo: { kind: component, id }` names a key here. next/dynamic is
// what makes each demo its own chunk, so a piece page ships only the demo it
// renders and Craft never grows the shared bundle.
//
// What rejects an id that names no demo is DemoFrame throwing while it
// prerenders, which fails the build. `isDemoId` is the same check without a
// render, for registry.test.ts to run over every piece in content/ at once.
export const DEMOS: Record<string, ComponentType> = {
	"logo-draw": dynamic(() =>
		import("./LogoDrawDemo").then((mod) => mod.LogoDrawDemo),
	),
}

export const DEMO_IDS = Object.keys(DEMOS)

export function isDemoId(id: string): boolean {
	return id in DEMOS
}
