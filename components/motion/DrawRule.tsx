/**
 * A hairline that draws itself in as it scrolls into view. This is the logo's
 * stroke-drawing language at rule scale, which is what stops the choreography
 * being a one-off intro and makes it the site's vocabulary.
 *
 * Same reasoning as Reveal: the animation is a CSS scroll-driven timeline in
 * app/globals.css, so a visitor without JavaScript gets a plain hairline rather
 * than an invisible one scaled to zero. scaleX rather than width, because width
 * is a layout property and animating it forces layout on every frame.
 */
export function DrawRule({ className }: { className?: string }) {
	return (
		<hr
			data-draw-rule
			className={["border-line border-t", className].filter(Boolean).join(" ")}
		/>
	)
}
