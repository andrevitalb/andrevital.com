import { CUT, LOGO_PARTS, LOGO_VIEW_BOX } from "@/components/logo/LogoMark"

/**
 * The mark at hero scale, ghosted behind the headline and woven with it.
 *
 * Two layers rather than one, because the type sits between them in the DOM and
 * there is no other way to have the same shape pass both behind and in front of
 * it. The back layer is the whole mark; the front layer redraws its cut alone,
 * clipped to one horizontal band, so the diagonal passes over the type there and
 * under it everywhere else. That is exactly the trick `LOGO_WEAVES` plays at logo
 * scale, where a sliver of each letterform is redrawn over the other: this is the
 * same weave with the headline as the second strand.
 *
 * Both layers are furniture, not a logo, so they are `aria-hidden` and carry no
 * title. The real mark is still in the nav, named, one per page.
 *
 * Filled with `--color-line` rather than `--color-bg-2`, which was too close to
 * the page to read at all. It may not be `--color-bg`: that is the mark's one
 * standing colour invariant (`docs/design.md`, "Color"), and it is what
 * HeroMark.test.tsx pins.
 */
export const HERO_MARK_FILL = "var(--color-line)"

export function HeroMark() {
	return (
		<>
			<svg data-hero-mark viewBox={LOGO_VIEW_BOX} aria-hidden>
				{LOGO_PARTS.map((logoPart) => (
					<polygon
						key={logoPart.part}
						data-logo-part={logoPart.part}
						points={logoPart.points}
						fill={HERO_MARK_FILL}
					/>
				))}
			</svg>
			<svg data-hero-mark-weave viewBox={LOGO_VIEW_BOX} aria-hidden>
				<polygon data-logo-part="cut" points={CUT} fill={HERO_MARK_FILL} />
			</svg>
		</>
	)
}
