import { DrawRule } from "@/components/motion/DrawRule"
import { Reveal } from "@/components/motion/Reveal"
import { TextLink } from "@/components/ui/Link"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { formatDate } from "@/lib/site"

const POSITIONING_HIGHLIGHT = "finished, polished product UI"

/** A curated slot, not an index: three entries at most, newest first. */
const SELECTED_WRITING = 3

/* Applied only when the writing column renders. With it unconditional, the
   flag-off page would leave a 16rem column empty and recreate the dead right
   rail this movement exists to fix (audit finding 7). */
const SPLIT =
	"grid gap-12 min-[760px]:grid-cols-[minmax(0,1fr)_16rem] min-[760px]:gap-16"

function Positioning({ text }: { text: string }) {
	const index = text.indexOf(POSITIONING_HIGHLIGHT)
	if (index === -1) return <>{text}</>

	const before = text.slice(0, index)
	const after = text.slice(index + POSITIONING_HIGHLIGHT.length)

	return (
		<>
			{before}
			<span className="text-fg">{POSITIONING_HIGHLIGHT}</span>
			{after}
		</>
	)
}

export default function Home() {
	const site = getSite()
	/*
	 * Gated, because with the flag off /writing 404s by design, so an ungated
	 * column would ship dead links to a section that does not exist. getAll
	 * drops drafts in production and keeps them in development, so this list can
	 * also be shorter here than it is locally, and can be empty.
	 */
	const posts = isVisible("writing")
		? getAll("writing").slice(0, SELECTED_WRITING)
		: []
	const hasWriting = posts.length > 0

	return (
		<>
			<section className="mx-auto max-w-wide px-gutter pt-section pb-16">
				{/*
				 * w-fit and the padding are both the cut's geometry, not decoration.
				 * The band passes through this box's centre, so at container width it
				 * crossed only the right half of the name; shrink-wrapped to the type
				 * it crosses the letterforms. The padding is the vertical room it
				 * needs: at the mark's angle the band spans twice the box height, so
				 * a box tight to the type gives it nowhere to travel. overflow-hidden
				 * keeps it off the nav and the band, and the tight leading is what
				 * stops line-height 1.6 opening a 50px gap above the name at hero
				 * scale.
				 */}
				<div className="relative w-fit overflow-hidden py-10 min-[760px]:py-14">
					<h1 className="font-medium text-hero leading-[1.05] tracking-[-0.03em]">
						{site.name}
					</h1>
					<span data-hero-cut aria-hidden />
				</div>
				<p className="mt-6 max-w-measure text-fg-2 text-h2">
					<Positioning text={site.positioning} />
				</p>
			</section>

			{/* Full bleed, so the fill escapes the container while the text stays
			    aligned to it. A description list because that is what three label
			    and value pairs are, and it is what a screen reader gets. */}
			<section className="bg-bg-2">
				<dl className="mx-auto grid max-w-wide gap-6 px-gutter py-10 font-mono text-meta sm:grid-cols-3 sm:gap-8">
					{site.facts.map((fact) => (
						<div key={fact.label}>
							<dt className="text-fg-2 uppercase">{fact.label}</dt>
							<dd className="mt-1 text-fg">{fact.value}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="mx-auto max-w-wide px-gutter py-section">
				<Reveal className={hasWriting ? SPLIT : undefined}>
					<div className="max-w-measure">
						{site.bio.map((paragraph, index) => (
							<p key={paragraph} className={index > 0 ? "mt-4" : undefined}>
								{paragraph}
							</p>
						))}
						<p className="mt-6">
							<TextLink href="/about" variant="primary">
								More about me
							</TextLink>
						</p>
					</div>

					{hasWriting && (
						<div>
							<h2 className="font-mono text-fg-2 text-meta uppercase">
								Selected writing
							</h2>
							<ul className="mt-5 grid gap-5">
								{posts.map((post) => (
									<li key={post.slug} className="grid gap-1">
										<TextLink href={`/writing/${post.slug}`}>
											{post.title}
										</TextLink>
										<time
											dateTime={post.date.toISOString()}
											className="font-mono text-fg-2 text-meta"
										>
											{formatDate(post.date)}
										</time>
									</li>
								))}
							</ul>
							<p className="mt-6 text-small">
								<TextLink href="/writing" variant="quiet">
									All writing
								</TextLink>
							</p>
						</div>
					)}
				</Reveal>
			</section>

			{/* U4: when Work is visible, a rows list goes here, above the close. */}

			<section className="mx-auto max-w-wide px-gutter pb-16">
				<DrawRule />
				<div className="pt-12">
					<p className="font-mono text-fg-2 text-meta uppercase">Reach me</p>
					<p className="mt-4">
						{/* Display scale only from 760px up: at 320px the address is
						    wider than the viewport at --text-display's clamp floor. */}
						<TextLink
							href={`mailto:${site.email}`}
							variant="primary"
							className="text-h2 tracking-[-0.02em] min-[760px]:text-display"
						>
							{site.email}
						</TextLink>
					</p>
					<ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-small">
						{site.socials.map((social) => (
							<li key={social.url}>
								<TextLink href={social.url} variant="quiet" external>
									{social.label}
								</TextLink>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	)
}
