"use client"

import { introScript } from "@/components/logo/intro-mode"

// Server only. The script has already run by the time anything hydrates, and in
// dev an unmatched entry URL re-renders the root layout on the client, where
// React would create a dead copy and warn. React skips the server's copy in
// <head> during hydration, so rendering nothing here is not a mismatch.
export function IntroScript() {
	if (typeof window !== "undefined") return null
	// biome-ignore lint/security/noDangerouslySetInnerHtml: fixed build-time string, no user input
	return <script dangerouslySetInnerHTML={{ __html: introScript }} />
}
