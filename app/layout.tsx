import type { Metadata } from "next"
import { Source_Sans_3, Space_Grotesk } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-display",
	display: "swap",
})

const sourceSans = Source_Sans_3({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
})

export const metadata: Metadata = {
	title: "André Vital",
	description: "André Vital's portfolio.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${spaceGrotesk.variable} ${sourceSans.variable}`}
		>
			<body>{children}</body>
		</html>
	)
}
