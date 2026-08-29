import { useId } from "react"

type LogoMarkProps = {
	id?: string
	className?: string
	title?: string
}

// Geometry locked from public/logos/logo.svg (viewBox 0 0 1000 1000). Exported so
// LogoDraw animates the same shapes rather than a second copy of them. The two
// weave groups redraw a sliver of each letterform over the other so the strokes
// read as woven where they cross. See docs/design.md "Color" for why the cut keeps
// its own fixed color while the letterforms use currentColor.
const LETTER_A =
	"849.94 250 767.59 250 561.71 638.2 479.35 482.92 397 482.92 521.35 715.84 561.94 793 602.88 715.84 849.94 250"
const LETTER_B =
	"150 750 232.35 750 438.24 361.8 520.59 517.08 602.94 517.08 478.59 284.16 438 207 397.06 284.16 150 750"
const CUT = "100 700 150 638 900 300 850 363 100 700"

export const LOGO_VIEW_BOX = "0 0 1000 1000"

// Paint order, not draw order: the cut sits over both letterforms. LogoDraw
// sequences them separately (see DRAW_ORDER there).
export const LOGO_PARTS = [
	{ part: "letter-a", points: LETTER_A, fill: "currentColor" },
	{ part: "letter-b", points: LETTER_B, fill: "currentColor" },
	{ part: "cut", points: CUT, fill: "var(--color-logo-cut)" },
] as const

export const LOGO_WEAVES = [
	{ rect: { x: 443.5, y: 415.5, width: 173, height: 119 }, points: LETTER_B },
	{ rect: { x: 403.5, y: 475.5, width: 108, height: 110 }, points: LETTER_A },
] as const

export function LogoMark({ id, className, title }: LogoMarkProps) {
	const reactId = useId()

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: title is opt-in via the title prop; aria-hidden covers the decorative default
		<svg
			id={id}
			viewBox={LOGO_VIEW_BOX}
			className={className}
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
		>
			{title ? <title>{title}</title> : null}
			<defs>
				{LOGO_WEAVES.map((weave, index) => (
					<clipPath key={weave.points} id={`${reactId}-weave-${index}`}>
						<rect {...weave.rect} />
					</clipPath>
				))}
			</defs>
			{LOGO_PARTS.map((logoPart) => (
				<polygon
					key={logoPart.part}
					data-logo-part={logoPart.part}
					fill={logoPart.fill}
					points={logoPart.points}
				/>
			))}
			{LOGO_WEAVES.map((weave, index) => (
				<g key={weave.points} clipPath={`url(#${reactId}-weave-${index})`}>
					<polygon fill="currentColor" points={weave.points} />
				</g>
			))}
		</svg>
	)
}
