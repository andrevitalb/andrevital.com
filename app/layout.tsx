import type { Metadata } from "next"
import { Geist_Mono, Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"
import { introScript } from "@/components/logo/intro-mode"
import { LogoIntro } from "@/components/logo/LogoIntro"
import { Nav } from "@/components/nav/Nav"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { getSite } from "@/lib/content"
import { pageMetadata, SITE_URL } from "@/lib/site"
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
	// This also serves as Home's own page metadata: Home renders as the root
	// layout's immediate child and doesn't export a competing `metadata`, so
	// it inherits this in full, which is the correct canonical and
	// description for "/". Every other route builds its own via pageMetadata
	// rather than inheriting this one (see lib/site.ts).
	...pageMetadata("/", { siteName: site.name, description: site.positioning }),
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
			<head>
				{/* First thing in the document: settles the intro mode before first
				    paint so the CSS keyed on data-intro never flashes (KTD4). */}
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: fixed build-time string, no user input */}
				<script dangerouslySetInnerHTML={{ __html: introScript }} />
			</head>
			<body className="flex min-h-dvh flex-col">
				<ThemeProvider>
					<LogoIntro>
						<Nav />
						<main id="main" className="flex-1">
							{children}
						</main>
						<footer className="border-line border-t px-gutter py-8 text-fg-2 text-small">
							<p>
								© {new Date().getFullYear()} {site.name}
							</p>
						</footer>
					</LogoIntro>
				</ThemeProvider>
			</body>
		</html>
	)
}
