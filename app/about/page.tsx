import type { Metadata } from "next"
import { CvTimeline } from "@/components/cv/CvTimeline"
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
			{/*
			 * The name, not the word "About", which is a nav label rather than a
			 * heading. The page is about a person, so that is what a crawler and a
			 * screen reader should land on. Unlike Home the visual headline and the
			 * document heading are the same element here, so no inversion is needed.
			 */}
			<h1 className="font-medium text-display tracking-[-0.025em]">
				{site.name}
			</h1>
			<p className="mt-4 max-w-[26ch] text-fg-2 text-h2">
				{site.aboutStatement}
			</p>

			{/*
			 * A row, not the 14rem right rail this used to be. A short rail beside a
			 * list as long as the career leaves exactly the dead space audit finding 7
			 * objected to on Home. Container aligned rather than full bleed, so it
			 * reads as the head's own furniture and not as Home's band repeated.
			 */}
			<dl className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-mono text-meta">
				{facts.map((fact) => (
					<div key={fact.label} className="flex items-baseline gap-2">
						<dt className="text-fg-2 uppercase">{fact.label}</dt>
						<dd className="text-fg">{fact.value}</dd>
					</div>
				))}
			</dl>

			<DrawRule className="mt-10" />

			<Reveal className="mt-12 grid max-w-measure gap-4">
				{site.bio.map((paragraph) => (
					<p key={paragraph} className="text-body">
						{paragraph}
					</p>
				))}
			</Reveal>

			<section className="mt-section">
				<h2 className="mb-8 font-mono text-fg-2 text-meta uppercase">
					Where I have worked
				</h2>
				<CvTimeline entries={cv.experience} />
				<div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-small">
					{/* Not a Next <Link>: /cv.pdf is a static asset written by
					    scripts/build-cv.tsx, not a route. TextLink renders anything that
					    is not a same-origin route href as a bare anchor for that reason. */}
					<TextLink href="/cv.pdf" variant="primary">
						Download CV
					</TextLink>
					<span className="font-mono text-fg-2 text-meta">
						PDF, generated from the same data
					</span>
				</div>
			</section>
		</div>
	)
}
