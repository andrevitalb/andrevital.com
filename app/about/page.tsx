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

export default function AboutPage() {
	const cv = getCv()
	const current = cv.experience[0]
	const role = current ? `${current.position} at ${current.company}` : undefined

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="grid gap-16 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<div>
					{/* The name is the h1 and the visual headline both: "About" is a nav
					    label, and the page a crawler lands on is about a person. The
					    padding is what lets the cut read as a cut rather than a scratch
					    across a corner. */}
					<header>
						<div className="relative w-fit py-8 pr-12">
							<CutLine over />
							<h1 className="relative z-[1] font-medium text-[clamp(2.5rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">
								{site.name}
							</h1>
						</div>
						<p className="mt-2 flex items-center gap-4 font-mono text-fg-2 text-meta uppercase tracking-widest">
							<span aria-hidden className="inline-block h-px w-8 bg-accent" />
							{role}
						</p>
					</header>

					<Reveal className="mt-6 grid max-w-measure gap-6">
						{site.bio.map((paragraph) => (
							<p key={paragraph} className="text-body text-fg-2">
								{paragraph}
							</p>
						))}
					</Reveal>
				</div>

				<aside className="grid content-start gap-12 font-mono text-fg-2 text-small xl:border-line xl:border-l xl:pl-8">
					<section>
						<h2 className="mb-4 text-fg-2 text-meta uppercase tracking-widest">
							Languages
						</h2>
						<ul className="grid gap-2">
							{cv.languages.map((language) => (
								<li
									key={language.name}
									className="flex items-end justify-between gap-4 border-line border-b pb-1"
								>
									<span className="text-fg">{language.name}</span>
									<span className="text-right text-meta">{language.level}</span>
								</li>
							))}
						</ul>
					</section>

					<section>
						<h2 className="mb-4 text-fg-2 text-meta uppercase tracking-widest">
							Education
						</h2>
						<ul className="grid gap-2">
							{cv.education.map((entry) => (
								<li key={entry.degree} className="leading-relaxed">
									{entry.degree} at{" "}
									<span className="text-fg">
										{entry.abbreviation ?? entry.institution}
									</span>
								</li>
							))}
						</ul>
					</section>

					<section>
						{/* `asset`, because /cv.pdf is a file written by
						    scripts/build-cv.tsx, not a route. Through next/link it would be
						    prefetched as an RSC payload on every view of this page. */}
						<TextLink href="/cv.pdf" variant="primary" asset>
							Download CV
						</TextLink>
						<p className="mt-2 text-meta">PDF, generated from the same data</p>
					</section>
				</aside>
			</div>

			<div className="mt-32 border-line border-t pt-16">
				<h2 className="mb-16 flex items-center gap-4 font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
					Where I have worked
					<span aria-hidden className="inline-block h-px w-12 bg-line" />
				</h2>

				<CvTimeline entries={cv.experience} />
			</div>

			<DrawRule className="mt-section" />
		</div>
	)
}
