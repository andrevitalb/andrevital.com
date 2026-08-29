import type { Metadata } from "next"
import { Geist_Mono, Instrument_Sans } from "next/font/google"
import type { ReactNode } from "react"
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
			className={`${instrumentSans.variable} ${geistMono.variable}`}
			suppressHydrationWarning
		>
			<body>{children}</body>
		</html>
	)
}
