import type { NextConfig } from "next"
import { legacyRedirects } from "./lib/redirects"
import { hiddenSectionRewrites } from "./lib/rewrites"

const nextConfig: NextConfig = {
	reactCompiler: true,
	// Lets the e2e suite hold a second, all-sections-hidden build side by side
	// with the normal one instead of clobbering it. Unset everywhere else.
	distDir: process.env.NEXT_DIST_DIR || ".next",
	redirects: async () => legacyRedirects(),
	// beforeFiles: these have to beat the filesystem routes they are hiding.
	rewrites: async () => ({
		beforeFiles: hiddenSectionRewrites(),
		afterFiles: [],
		fallback: [],
	}),
}

export default nextConfig
