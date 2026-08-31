import type { Metadata } from "next"
import { CutLine } from "@/components/motion/CutLine"
import { TextLink } from "@/components/ui/Link"
import { getSite } from "@/lib/content"
import { pageMetadata } from "@/lib/site"

const site = getSite()

export const metadata: Metadata = pageMetadata("/contact", {
	siteName: site.name,
	title: "Contact",
	description: `Reach ${site.name} by email or on social.`,
})

/* The address split at the @, each half its own block. Two lines is the
   composition and it is also what makes the fit provable: at 320px the gutter
   leaves about 280px, and one line of the full 22-character address does not
   fit there at any size worth setting. */
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
			<div className="flex flex-1 items-center py-10">
				<div className="mx-auto w-full max-w-wide px-gutter">
					{/* The document heading. The address is the visual one, the same
					    split U2b settled on Home. */}
					<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
						Contact
					</h1>
					{/* The cut is scoped to the address, not to the fold. Over the whole
					    section it ran corner to corner through mostly empty ground and
					    read as a stray hairline; bounded by the type it reads as a cut
					    through the type, which is what it is. */}
					<p className="relative mt-6">
						<CutLine />
						<TextLink
							href={`mailto:${site.email}`}
							variant="primary"
							/* Without this the name computed from two block children is
							   "contact@ andrevital.com": an email address read aloud with a
							   space in the middle of it. */
							aria-label={site.email}
							/*
							 * Sized to the container rather than to --text-hero, which is
							 * tuned for a three-word claim and puts fourteen characters nine
							 * hundred pixels past the page. 11vw keeps the longer line inside
							 * --container-wide at every width, and the 2rem floor keeps it
							 * inside the gutter at 320px.
							 *
							 * relative z-[1] is what puts the glyphs above the line. The cut
							 * sits at z-index 0 and a positioned element paints after the
							 * static content beside it, so without this the "under" variant
							 * lands on top and becomes the strikethrough it exists to avoid.
							 */
							className="relative z-[1] block font-medium text-[clamp(2rem,11vw,10rem)] leading-[0.95] tracking-[-0.03em]"
						>
							<span className="block whitespace-nowrap">{LOCAL}@</span>
							<span className="block whitespace-nowrap">{DOMAIN}</span>
						</TextLink>
					</p>
				</div>
			</div>

			{/* Pinned to the fold's bottom edge: the socials on one side, the facts a
			    remote reader actually needs on the other. */}
			<div className="relative z-[1] border-line border-t">
				<div className="mx-auto flex w-full max-w-wide flex-wrap items-baseline justify-between gap-x-10 gap-y-4 px-gutter py-5">
					<ul className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-meta uppercase">
						{site.socials.map((social) => (
							<li key={social.url}>
								<TextLink href={social.url} variant="quiet" external>
									{social.label}
								</TextLink>
							</li>
						))}
					</ul>
					<dl className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-fg-2 text-meta uppercase">
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
			</div>
		</section>
	)
}
