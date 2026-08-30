import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { KIND_LABEL } from "@/lib/work"

// Same constraints as app/opengraph-image.tsx: the nodejs runtime because the
// content layer reads from disk, and literal hex because satori has no cascade
// and cannot resolve var(--color-*).
export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Its own route module, so it needs its own copy of the page's guards: without
// them it would stay dynamic and answer 200 for a hidden section and for slugs
// that have no entry.
export const dynamicParams = false

export function generateStaticParams() {
	if (!isVisible("work")) return []
	return getAll("work").map((entry) => ({ slug: entry.slug }))
}

export default async function WorkOpengraphImage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	if (!isVisible("work")) notFound()

	const site = getSite()
	const entry = getAll("work").find((candidate) => candidate.slug === slug)
	if (!entry) notFound()

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "80px",
				backgroundColor: "#0f1214",
				color: "#e8ecec",
			}}
		>
			<div style={{ display: "flex", fontSize: 28, color: "#63d4bf" }}>
				{KIND_LABEL[entry.kind]} · {entry.period}
			</div>
			<div
				style={{
					display: "flex",
					fontSize: 64,
					fontWeight: 500,
					letterSpacing: "-0.025em",
					lineHeight: 1.1,
					maxWidth: 960,
				}}
			>
				{entry.title}
			</div>
			<div style={{ display: "flex", fontSize: 28, color: "#98a2a2" }}>
				{site.name}
			</div>
		</div>,
		{ ...size },
	)
}
