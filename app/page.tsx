import { HeroMark } from "@/components/logo/HeroMark"
import { CutLine } from "@/components/motion/CutLine"
import { DrawRule } from "@/components/motion/DrawRule"
import { Reveal } from "@/components/motion/Reveal"
import { TextLink } from "@/components/ui/Link"
import { getAll, getSite } from "@/lib/content"
import { isVisible } from "@/lib/sections"
import { formatDate } from "@/lib/site"

/*
 * The headline is the claim, not the name and not the role. Three lines because
 * the cut crosses them; one line would give the diagonal a single edge to touch.
 * Copy settled with André on 2026-08-31, replacing `site.positioning` read at
 * hero scale, which is a third-person relative clause and read as a caption
 * blown up.
 */
const HEADLINE = ["Finished.", "Polished.", "Shipped."] as const

/** A curated slot, not an index: three entries at most, newest first. */
const SELECTED_WRITING = 3

/* Applied only when the writing column renders. With it unconditional, the
   flag-off page would leave a 16rem column empty and recreate the dead right
   rail this movement exists to fix (audit finding 7). */
const SPLIT =
	"grid gap-12 min-[760px]:grid-cols-[minmax(0,1fr)_16rem] min-[760px]:gap-16"

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
			{/*
			 * The fold. One section rather than a hero plus a band, because the facts
			 * are the hero's own furniture now: they sit on its bottom edge the way a
			 * masthead's standfirst does, rather than arriving as a separate stripe
			 * after it. min-h is the viewport less the header, so the band lands on
			 * the fold instead of just under it.
			 */}
			<section className="relative flex min-h-[calc(100svh-var(--nav-height))] flex-col overflow-hidden">
				<HeroMark />

				{/*
				 * Full width, not container width, and that is what the cut needs: it is
				 * laid over this box, so the diagonal runs the whole viewport and
				 * crosses all three lines rather than being scoped to the type.
				 */}
				<div className="relative flex flex-1 items-center py-6">
					<CutLine over />

					<div className="relative z-[1] mx-auto w-full max-w-wide px-gutter">
						{/*
						 * The name is the h1 even though the claim below it is forty times
						 * the size, and that split is deliberate. Visual hierarchy and
						 * document hierarchy answer different questions: the page is about
						 * a person, so the heading a screen reader or a search engine
						 * lands on has to be the person, while the thing a sighted visitor
						 * reads first is the claim. Swapping them made the h1 a slogan and
						 * broke the heading-name assertions in smoke.spec.ts and
						 * intro.spec.ts, which is exactly the contract those tests exist to
						 * hold.
						 */}
						<h1 className="font-mono text-fg-2 text-meta uppercase tracking-[0.12em]">
							{site.name}
						</h1>
						{/* Three blocks, not three <br>s: each line is its own box, so the
						    leading is the block's and not the browser's guess at a break. */}
						<p className="mt-6 font-medium text-hero leading-[0.88] tracking-[-0.04em]">
							{HEADLINE.map((line) => (
								<span key={line} className="block whitespace-nowrap">
									{line}
								</span>
							))}
						</p>
					</div>
				</div>

				{/* Comp A's treatment: inline label and value pairs spread across the
				    container on the secondary background, no boxes, no per-item rule. */}
				<div className="relative z-[1] border-line border-t bg-bg-2">
					<dl className="mx-auto flex w-full max-w-wide flex-wrap justify-between gap-x-10 gap-y-2 px-gutter py-5 font-mono text-meta">
						{site.facts.map((fact) => (
							<div key={fact.label} className="flex items-baseline gap-2">
								<dt className="text-fg-2 uppercase">{fact.label}</dt>
								<dd className="text-fg">{fact.value}</dd>
							</div>
						))}
					</dl>
				</div>
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
