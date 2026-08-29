import type { NextConfig } from "next"
import { legacyRedirects } from "./lib/redirects"

const nextConfig: NextConfig = {
	reactCompiler: true,
	redirects: async () => legacyRedirects(),
}

export default nextConfig
