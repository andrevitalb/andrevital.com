"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

// Dark is the CSS default (see app/globals.css), so no forcedTheme and no
// inline pre-hydration script are needed: an unhydrated page is already dark.
export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			// Inert on the client: it ran before hydration, and a data block is the
			// one script React will render there without warning (dev's 404 does).
			scriptProps={
				typeof window === "undefined" ? undefined : { type: "text/plain" }
			}
		>
			{children}
		</NextThemesProvider>
	)
}
