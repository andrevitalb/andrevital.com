/**
 * The accent diagonal, drawn at the mark's own angle across whatever box it is
 * laid over. Extracted in U3, when Contact and the 404 became its second and
 * third call sites; U2 deliberately left it as one span in `app/page.tsx`
 * because a component with a single consumer is indirection, not a primitive.
 *
 * A server component carrying one attribute, for the same reason `Reveal` is
 * one: anything that serialises an initial style into the server HTML can leave
 * a visitor whose bundle never arrived looking at a permanently hidden element.
 * The line, the angle and the draw all live in `app/globals.css`.
 *
 * `over` is not a styling preference. The line lands above the type on Home,
 * where it crosses a claim and is meant to. It has to land below the type on
 * Contact, where an accent rule through an email address reads as a
 * strikethrough, and a struck-through mailbox says the mailbox is dead.
 */
export function CutLine({
	over = false,
	afterMark = false,
	woven = false,
}: {
	over?: boolean
	/**
	 * Home's weave: under the type, plus a copy over it clipped to the same band
	 * as `HeroMark`'s front layer, so the accent crosses the middle line in front
	 * and the other two behind, exactly as the mark's slash does.
	 */
	woven?: boolean
	/**
	 * Wait for the mark to finish assembling before drawing. True on Home alone,
	 * which is the only page carrying a `HeroMark`: the delay is the two beats of
	 * that assembly and means nothing without it. Everywhere else it just held
	 * the accent at `clip-path: inset(0 100% 0 0)` for the better part of a
	 * second after paint, so the line was simply missing.
	 *
	 * About looked like a second consumer while it was built on Home's fold, and
	 * is not one: that fold was discarded because the weave band ate the second
	 * line of the name, and About has no mark to wait for.
	 */
	afterMark?: boolean
}) {
	const line = (
		<span
			data-cut={over || woven ? "over" : "under"}
			data-cut-after-mark={afterMark || undefined}
			aria-hidden
		/>
	)
	if (!woven) return line

	return (
		<>
			<CutLine afterMark={afterMark} />
			<span data-cut-weave aria-hidden>
				{line}
			</span>
		</>
	)
}
