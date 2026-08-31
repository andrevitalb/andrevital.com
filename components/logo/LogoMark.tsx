import { useId } from "react"

type LogoMarkProps = {
	id?: string
	className?: string
	title?: string
}

// Geometry locked from public/logos/logo.svg, whose own viewBox is 0 0 1000 1000.
// Exported so LogoDraw animates the same shapes rather than a second copy of them.
// The two weave groups redraw a sliver of each letterform over the other so the
// strokes read as woven where they cross. See docs/design.md "Color" for why the
// cut is the brighter of the two values and the letterforms sit under it.
const LETTER_A =
	"849.94 250 767.59 250 561.71 638.2 479.35 482.92 397 482.92 521.35 715.84 561.94 793 602.88 715.84 849.94 250"
const LETTER_B =
	"150 750 232.35 750 438.24 361.8 520.59 517.08 602.94 517.08 478.59 284.16 438 207 397.06 284.16 150 750"
const CUT = "100 700 150 638 900 300 850 363 100 700"

/*
 * Cropped to the ink, not the source box. The polygons occupy x 100 to 900 and
 * y 207 to 793, so the original 0 0 1000 1000 left the mark filling 80% of the
 * width and 59% of the height: size-7 rendered a mark 22.4 by 16.4px and every
 * size class lied about what you would see.
 *
 * The 7 units of padding on each side are half of LogoDraw's STROKE_WIDTH, which
 * strokes centred on the path. Any less and the stroke clips mid-draw.
 * components/logo/LogoMark.test.tsx pins both facts.
 *
 * app/icon.svg deliberately does NOT follow this. A favicon paints into square
 * browser chrome, so it keeps its own square crop.
 */
export const LOGO_VIEW_BOX = "93 200 814 600"

/**
 * The box's aspect, as a Tailwind arbitrary-value fraction. The mark is landscape,
 * so a square class letterboxes it: pair this with a height, never with `size-*`.
 */
export const LOGO_ASPECT = "814/600"

// Palette tokens rather than currentColor: the cut has to be a different value
// from the letterforms, so the mark needs two, and both invert with the theme on
// their own. LogoDraw strokes with these too, so neither may equal --color-bg.
export const LOGO_LETTER_FILL = "var(--color-fg-2)"
export const LOGO_CUT_FILL = "var(--color-fg)"

// Paint order, not draw order: the cut sits over both letterforms. LogoDraw
// sequences them separately (see DRAW_ORDER there).
export const LOGO_PARTS = [
	{ part: "letter-a", points: LETTER_A, fill: LOGO_LETTER_FILL },
	{ part: "letter-b", points: LETTER_B, fill: LOGO_LETTER_FILL },
	{ part: "cut", points: CUT, fill: LOGO_CUT_FILL },
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
					<polygon fill={LOGO_LETTER_FILL} points={weave.points} />
				</g>
			))}
		</svg>
	)
}
