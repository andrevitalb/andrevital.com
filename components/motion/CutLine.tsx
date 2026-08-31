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
export function CutLine({ over = false }: { over?: boolean }) {
	return <span data-cut={over ? "over" : "under"} aria-hidden />
}
