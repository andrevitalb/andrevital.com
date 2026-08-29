import type { Metadata } from "next"
import { Geist_Mono, Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"
import { Nav } from "@/components/nav/Nav"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { getSite } from "@/lib/content"
import { absoluteUrl, SITE_URL } from "@/lib/site"
import "./globals.css"

const instrumentSans = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
})

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
	display: "swap",
})

const site = getSite()

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: site.name,
		template: `%s · ${site.name}`,
	},
	description: site.positioning,
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		url: absoluteUrl("/"),
		siteName: site.name,
		title: site.name,
		description: site.positioning,
	},
	twitter: {
		card: "summary_large_image",
		title: site.name,
		description: site.positioning,
	},
}

// KTD7 (React's <ViewTransition>) was evaluated and skipped: react@19.2.8's
// public exports have no ViewTransition (stable or unstable_), so there is
// nothing to wrap children in yet. Route transitions stay with a later unit.
export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${instrumentSans.variable} ${geistMono.variable}`}
			suppressHydrationWarning
		>
			<body className="flex min-h-dvh flex-col">
				<ThemeProvider>
					<Nav />
					<main id="main" className="flex-1">
						{children}
					</main>
					<footer className="border-line border-t px-gutter py-8 text-fg-2 text-small">
						<p>
							© {new Date().getFullYear()} {site.name}
						</p>
					</footer>
				</ThemeProvider>
			</body>
		</html>
	)
}
