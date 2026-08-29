import { ImageResponse } from "next/og"
import { getSite } from "@/lib/content"

// Nodejs runtime, not the edge default, because getSite() reads content/site.yaml
// from disk. Colors are the dark-palette hex values from docs/design.md rather
// than CSS custom properties: satori (which renders this) has no cascade and
// cannot resolve var(--color-*), so this is the one place that has to hardcode
// them rather than reach the tokens.
export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
	const site = getSite()

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				padding: "80px",
				backgroundColor: "#0f1214",
				color: "#e8ecec",
			}}
		>
			<div style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-0.025em" }}>
				{site.name}
			</div>
			<div
				style={{ marginTop: 24, fontSize: 32, color: "#98a2a2", maxWidth: 960 }}
			>
				{site.positioning}
			</div>
		</div>,
		{ ...size },
	)
}
