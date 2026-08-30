import { notFound } from "next/navigation"
import { ImageResponse } from "next/og"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { formatDate } from "@/lib/site"

// Same constraints as app/opengraph-image.tsx: the nodejs runtime because the
// content layer reads from disk, and literal hex because satori has no cascade
// and cannot resolve var(--color-*).
export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// This is its own route module, so it needs its own copy of the page's guards:
// without them the image stayed dynamic and answered 200 for a hidden section
// and for slugs that have no post, rendering a real title in the first case and
// a "Writing" placeholder in the second.
export const dynamicParams = false

export function generateStaticParams() {
	if (!isVisible("writing")) return []
	return getAll("writing").map((post) => ({ slug: post.slug }))
}

export default async function PostOpengraphImage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	if (!isVisible("writing")) notFound()

	const site = getSite()
	const post = getAll("writing").find((entry) => entry.slug === slug)
	if (!post) notFound()

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
				{formatDate(post.date)}
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
				{post.title}
			</div>
			<div style={{ display: "flex", fontSize: 28, color: "#98a2a2" }}>
				{site.name}
			</div>
		</div>,
		{ ...size },
	)
}
