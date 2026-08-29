import type { Metadata } from "next"
import { CvTimeline } from "@/components/cv/CvTimeline"
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
			<div className="grid grid-cols-1 items-start gap-6 min-[760px]:grid-cols-[minmax(0,1fr)_14rem] min-[760px]:gap-14">
				<div>
					<h1 className="font-medium text-display tracking-[-0.025em]">
						About
					</h1>
					<p className="mt-4 max-w-[26ch] text-fg-2 text-h2">
						{site.aboutStatement}
					</p>
				</div>
				<dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-meta min-[760px]:grid-cols-1 min-[760px]:pt-2">
					{facts.map((fact) => (
						<div key={fact.label}>
							<dt className="text-fg-2 uppercase">{fact.label}</dt>
							<dd className="text-fg">{fact.value}</dd>
						</div>
					))}
				</dl>
			</div>

			<hr className="mt-12 border-line" />

			<div className="mt-12 grid max-w-measure gap-4">
				{site.bio.map((paragraph) => (
					<p key={paragraph} className="text-body">
						{paragraph}
					</p>
				))}
			</div>

			<section className="mt-section">
				<h2 className="mb-5 font-medium text-h2 leading-[1.2] tracking-[-0.01em]">
					Where I have worked
				</h2>
				<CvTimeline entries={cv.experience} />
				<div className="mt-7 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-small">
					{/* Not a Next <Link>: /cv.pdf is a static asset written by
					    scripts/build-cv.tsx, not a route. */}
					<a
						href="/cv.pdf"
						className="text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
					>
						Download CV
					</a>
					<span className="font-mono text-fg-2 text-meta">
						PDF, generated from the same data
					</span>
				</div>
			</section>
		</div>
	)
}
