import { useId } from "react"

type LogoMarkProps = {
	className?: string
	title?: string
}

// Geometry locked from public/logos/logo.svg (viewBox 0 0 1000 1000). The two
// clip-path groups redraw a sliver of each letterform over the other so the
// strokes read as woven where they cross. See docs/design.md "Color" for why
// the cut keeps its own fixed color while the letterforms use currentColor.
const LETTER_A =
	"849.94 250 767.59 250 561.71 638.2 479.35 482.92 397 482.92 521.35 715.84 561.94 793 602.88 715.84 849.94 250"
const LETTER_B =
	"150 750 232.35 750 438.24 361.8 520.59 517.08 602.94 517.08 478.59 284.16 438 207 397.06 284.16 150 750"
const CUT = "100 700 150 638 900 300 850 363 100 700"

export function LogoMark({ className, title }: LogoMarkProps) {
	const id = useId()
	const clipA = `${id}-clip-a`
	const clipB = `${id}-clip-b`

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: title is opt-in via the title prop; aria-hidden covers the decorative default
		<svg
			viewBox="0 0 1000 1000"
			className={className}
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
		>
			{title ? <title>{title}</title> : null}
			<defs>
				<clipPath id={clipA}>
					<rect x="443.5" y="415.5" width="173" height="119" />
				</clipPath>
				<clipPath id={clipB}>
					<rect x="403.5" y="475.5" width="108" height="110" />
				</clipPath>
			</defs>
			<polygon
				data-logo-part="letter-a"
				fill="currentColor"
				points={LETTER_A}
			/>
			<polygon
				data-logo-part="letter-b"
				fill="currentColor"
				points={LETTER_B}
			/>
			<polygon data-logo-part="cut" fill="var(--color-logo-cut)" points={CUT} />
			<g clipPath={`url(#${clipA})`}>
				<polygon fill="currentColor" points={LETTER_B} />
			</g>
			<g clipPath={`url(#${clipB})`}>
				<polygon fill="currentColor" points={LETTER_A} />
			</g>
		</svg>
	)
}
