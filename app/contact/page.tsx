import type { Metadata } from "next"
import { CutLine } from "@/components/motion/CutLine"
import { TextLink } from "@/components/ui/Link"
import { getSite } from "@/lib/content"
import { pageMetadata } from "@/lib/site"

const site = getSite()

export const metadata: Metadata = pageMetadata("/contact", {
	siteName: site.name,
	title: "Contact",
	description: `Reach ${site.name} by email, on LinkedIn or on GitHub.`,
})

/*
 * "/in/andrevitalb", "/andrevitalb". The handle is already in the URL, so
 * deriving it beats carrying a second copy in site.yaml that can drift from the
 * link sitting next to it.
 */
function handleOf(url: string) {
	return new URL(url).pathname.replace(/\/$/, "")
}

/*
 * The address, with a break opportunity at the @.
 *
 * An email address is one unbreakable word to a line breaker: "@" is not a break
 * point, so at 320px the whole thing ran 352px wide inside a 280px column and
 * the fold's overflow-hidden clipped it silently. <wbr> puts the opportunity
 * exactly where an address should break and nowhere else, unlike break-words,
 * which would happily split "andrevi / tal.com". It inserts no whitespace, so
 * the accessible name is still the address in one piece.
 */
const [LOCAL, DOMAIN] = site.email.split("@")

// No form and no server action here by design (R30): the fastest way to reach
// out is still just email, carried over in tone from the old Contact.
export default function ContactPage() {
	const location = site.facts.find((fact) => fact.label === "Based in")

	return (
		/*
		 * The fold, the same arithmetic Home's hero uses: the viewport less the
		 * header, so the furniture lands on the fold rather than under it. The page
		 * still scrolls by roughly the footer's height, which is accepted rather
		 * than worked around; subtracting the footer too would put a second magic
		 * number beside --nav-height for a fold nothing asserts.
		 */
		<section className="relative flex min-h-[calc(100svh-var(--nav-height))] flex-col overflow-hidden">
			<div className="mx-auto flex w-full max-w-wide flex-1 flex-col justify-center gap-10 px-gutter py-8 min-[640px]:gap-14 min-[640px]:py-12">
				<div>
					{/* The document heading. The address is the visual one, the same
					    split U2b settled on Home. */}
					<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
						Contact
					</h1>
					{/*
					 * The cut is scoped to the address, not to the fold. Over the whole
					 * section it ran corner to corner through mostly empty ground and read
					 * as a stray hairline; bounded by the type it cuts the type.
					 *
					 * The padding is what makes that legible rather than decorative. The
					 * diagonal drops --cut-rise for every unit it travels, so the width it
					 * can cross is the box's height divided by 0.45: around one line of
					 * type it crossed 200px of a 992px container and read as a scratch
					 * through one syllable. At this height it runs most of the address.
					 */}
					<p className="relative mt-6 py-10 min-[640px]:py-14">
						<CutLine />
						{/*
						 * One line, and deliberately NOT whitespace-nowrap. Nowrap at a size
						 * that fills 1440 overflows 320, where the section's overflow-hidden
						 * would clip it silently rather than let the no-horizontal-scroll
						 * guard catch it. Left to wrap, the browser breaks after the @ on a
						 * narrow screen, which is the one place an address breaks cleanly.
						 *
						 * relative z-[1] is what puts the glyphs above the line. The cut sits
						 * at z-index 0 and a positioned element paints after the static
						 * content beside it, so without this the "under" variant lands on top
						 * and becomes the strikethrough it exists to avoid.
						 */}
						<TextLink
							href={`mailto:${site.email}`}
							variant="primary"
							className="relative z-[1] block font-medium text-[clamp(2rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.03em]"
						>
							{LOCAL}@<wbr />
							{DOMAIN}
						</TextLink>
					</p>
				</div>

				{/*
				 * The two accounts that are actually professional, at the weight they
				 * deserve: the platform at display scale with the handle under it, as a
				 * two-up split by a hairline.
				 *
				 * Not boxes. `docs/design.md` locks "no cards" as part of the register,
				 * and a rule between two blocks separates them as well as a border
				 * around each would. The gap-px on a --color-line background is how the
				 * dividing rule is drawn without giving either cell a border of its own,
				 * so the split collapses to a single horizontal rule under 640px.
				 */}
				<ul className="grid gap-px border-line border-t bg-line min-[640px]:grid-cols-2">
					{site.socials.map((social, index) => (
						<li key={social.url} className="bg-bg">
							<TextLink
								href={social.url}
								external
								variant="quiet"
								/*
								 * The padding sits on the link, not the cell, so the whole
								 * block is the hit area rather than just the type in it.
								 *
								 * Only a cell in the second column is inset from the left: the
								 * first column's edge is the container's, and indenting it
								 * would take the platform names out of line with the address
								 * above them. Without the inset the second column's type sits
								 * flush against the dividing rule.
								 */
								className={[
									"group block py-6 min-[640px]:py-8 min-[640px]:pr-8",
									index % 2 === 1 ? "min-[640px]:pl-8" : "",
								]
									.filter(Boolean)
									.join(" ")}
							>
								<span className="block font-medium text-display text-fg tracking-[-0.025em] underline decoration-2 decoration-transparent underline-offset-[6px] transition-colors duration-[var(--duration-fast)] group-hover:decoration-accent">
									{social.label}
								</span>
								<span className="mt-2 block font-mono text-fg-2 text-meta">
									{handleOf(social.url)}
								</span>
							</TextLink>
						</li>
					))}
				</ul>
			</div>

			{/* Pinned to the fold's bottom edge: the two facts a remote reader wants
			    before they write. */}
			<div className="border-line border-t">
				<dl className="mx-auto flex w-full max-w-wide flex-wrap gap-x-10 gap-y-2 px-gutter py-5 font-mono text-fg-2 text-meta uppercase">
					{location && (
						<div>
							<dt className="sr-only">{location.label}</dt>
							<dd>{location.value}</dd>
						</div>
					)}
					<div>
						<dt className="sr-only">Timezone</dt>
						<dd>{site.timezone}</dd>
					</div>
				</dl>
			</div>
		</section>
	)
}
