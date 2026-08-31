import type { Metadata } from "next"
import { CvTimeline } from "@/components/cv/CvTimeline"
import { CutLine } from "@/components/motion/CutLine"
import { DrawRule } from "@/components/motion/DrawRule"
import { Reveal } from "@/components/motion/Reveal"
import { TextLink } from "@/components/ui/Link"
import { getSite } from "@/lib/content"
import { getCv } from "@/lib/cv"
import { pageMetadata } from "@/lib/site"

const site = getSite()

export const metadata: Metadata = pageMetadata("/about", {
	siteName: site.name,
	title: "About",
	description: `${site.aboutStatement} The work history of ${site.name}, and a CV to download.`,
})

/*
 * The directory grid, at masthead scale. Every band on this page uses it, which
 * is the page's whole idea: one spine down the left, metadata in the mono
 * column, content in the wide one, so the name, the bio and fourteen years of
 * work all hang off the same line.
 *
 * It is deliberately NOT Home's fold. That was tried and discarded: Home's
 * treatment is a mark woven through the headline, and on a two-line name the
 * weave band lands across the second line and eats it. The mark is Home's
 * signature and this page borrows the site's grid instead.
 */
const BAND = "grid gap-x-8 gap-y-4 min-[760px]:grid-cols-[11rem_minmax(0,1fr)]"

export default function AboutPage() {
	const cv = getCv()

	const facts = [
		{
			label: "Languages",
			value: cv.languages.map((language) => language.name).join(", "),
		},
		{
			label: "Studied",
			value: cv.education
				.map(
					(entry) =>
						`${entry.degree}, ${entry.abbreviation ?? entry.institution}`,
				)
				.join("; "),
		},
	]

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div data-spine className="grid gap-16 pl-6 min-[640px]:pl-8">
				<div className={BAND}>
					<p className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
						About
					</p>

					{/*
					 * The name is the h1 and the visual headline both, so unlike Home
					 * there is nothing to invert: "About" is a nav label, and the page a
					 * crawler or a screen reader lands on is about a person.
					 *
					 * The padding is what lets the cut read. The diagonal drops
					 * --cut-rise for every unit it travels, so the width it can cross is
					 * the box's height over 0.45; around two lines of type with no room
					 * above or below it crosses a corner and looks like a scratch.
					 */}
					<div className="relative py-10">
						<CutLine over />
						<h1 className="relative z-[1] font-medium text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] tracking-[-0.035em]">
							{site.name}
						</h1>
						<p className="relative z-[1] mt-6 max-w-[34ch] text-fg-2 text-h2">
							{site.aboutStatement}
						</p>
					</div>
				</div>

				<Reveal className={BAND}>
					<dl className="grid content-start gap-5 font-mono text-meta">
						{facts.map((fact) => (
							<div key={fact.label}>
								<dt className="text-fg-2 uppercase">{fact.label}</dt>
								<dd className="mt-1 text-fg">{fact.value}</dd>
							</div>
						))}
					</dl>

					<div className="grid max-w-measure gap-4">
						{site.bio.map((paragraph) => (
							<p key={paragraph} className="text-body">
								{paragraph}
							</p>
						))}
					</div>
				</Reveal>

				{/*
				 * The career sits at the top level rather than nested in a content
				 * column, which is what keeps the page to one rail: the periods land in
				 * the same mono column as ABOUT, LANGUAGES and this heading, so every
				 * band on the page reads off the same line.
				 */}
				<div className={BAND}>
					<h2 className="font-mono text-fg-2 text-meta uppercase">
						Where I have worked
					</h2>
				</div>

				<CvTimeline entries={cv.experience} />

				<div className={BAND}>
					{/* The empty mono cell is what puts the link in the content column,
					    under the roles rather than under the periods. */}
					<span aria-hidden />
					<div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-small">
						{/* `asset`, because /cv.pdf is a file written by
						    scripts/build-cv.tsx, not a route. Through next/link it would be
						    prefetched as an RSC payload, downloading the PDF on every view
						    of this page. */}
						<TextLink href="/cv.pdf" variant="primary" asset>
							Download CV
						</TextLink>
						<span className="font-mono text-fg-2 text-meta">
							PDF, generated from the same data
						</span>
					</div>
				</div>
			</div>

			<DrawRule className="mt-section" />
		</div>
	)
}
