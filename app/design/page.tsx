import type { Metadata } from "next"
import type { CSSProperties } from "react"
import { LogoDrawDemo } from "@/components/craft/demos/LogoDrawDemo"
import { Replay } from "@/components/design/Replay"
import { CutLine } from "@/components/motion/CutLine"
import { DrawRule } from "@/components/motion/DrawRule"
import { Reveal } from "@/components/motion/Reveal"
import { IconButton } from "@/components/ui/IconButton"
import { TextLink } from "@/components/ui/Link"
import { WorkCard } from "@/components/work/WorkCard"
import { DIRECTORY_GRID } from "@/lib/layout"
import { type Bezier, parseCubicBezier } from "@/lib/motion"
import type { Work } from "@/lib/schemas"
import {
	CONTRAST_PAIRS,
	contrast,
	group,
	LIGHT,
	PALETTE,
	ROOT,
	resolve,
	THEME,
} from "@/lib/tokens"

// Dev only: lib/rewrites.ts sends /design to the 404 in a production build.
export const metadata: Metadata = {
	title: "Design system",
	robots: {
		index: false,
		follow: false,
	},
}

const BAND = `grid gap-x-8 gap-y-6 ${DIRECTORY_GRID}`
const META = "font-mono text-fg-2 text-meta uppercase tracking-[0.12em]"
const NAME = "font-mono text-fg text-meta"
const VALUE = "font-mono text-fg-2 text-meta"
const ROW = "grid items-baseline gap-x-6 gap-y-1 border-line border-t pt-3"
// Not META plus a size: that stacks two font-size utilities and leaves the
// winner to the order Tailwind happens to emit them in.
const SPECIMEN_LABEL = "font-mono text-fg-2 text-h3 uppercase tracking-[0.12em]"

const SECTIONS = [
	{ id: "palette", label: "01", title: "Palette" },
	{ id: "type", label: "02", title: "Type" },
	{ id: "layout", label: "03", title: "Layout" },
	{ id: "radius", label: "04", title: "Radius" },
	{ id: "components", label: "05", title: "Components" },
	{ id: "motion", label: "06", title: "Motion" },
] as const

function Section({
	id,
	note,
	children,
}: {
	id: (typeof SECTIONS)[number]["id"]
	note: string
	children: React.ReactNode
}) {
	const section = SECTIONS.find((entry) => entry.id === id)
	if (!section) throw new Error(`No section named ${id}`)

	return (
		<section id={id} className={BAND}>
			<h2 className={`content-start ${META}`}>
				{section.label} / {section.title}
			</h2>

			<div className="grid gap-8">
				<p className="max-w-measure text-fg-2 text-small">{note}</p>
				{children}
			</div>
		</section>
	)
}

/* ---------------------------------------------------------------- palette -- */

function ratioOf(tokens: typeof ROOT, of: string, on: string): number | null {
	return contrast(resolve(tokens, of), resolve(tokens, on))
}

function Ratio({
	value,
	floor,
}: {
	value: number | null
	floor: number | null
}) {
	if (value === null) return <span className={VALUE}>not a flat hex</span>

	// No floor means there is nothing to pass or fail, so the number is reported
	// flat rather than in the colour that means "this one broke".
	if (floor === null) return <span className={VALUE}>{value.toFixed(2)}:1</span>

	const passes = value >= floor
	return (
		<span
			className={`font-mono text-meta ${passes ? "text-fg" : "text-accent"}`}
		>
			{value.toFixed(2)}:1 {passes ? "" : `under ${floor}`}
		</span>
	)
}

/* ------------------------------------------------------------------- type -- */

// One specimen per step, sized so the step is what you read rather than the
// sentence. The hero is two letterforms because at 16vw a sentence is a wall.
const TYPE_SPECIMEN: Record<string, string> = {
	"--text-hero": "Aa",
	"--text-display": "Interfaces, built",
	"--text-h2": "A section heading",
	"--text-h3": "A subheading",
	"--text-body": "The paragraph this site is mostly made of.",
	"--text-small": "Supporting copy, one step down.",
	"--text-meta": "Metadata, set in mono",
}

/* -------------------------------------------------------------- components -- */

/*
 * Fabricated, and that is a constraint rather than laziness. Pulling a real
 * entry through getAll("work") would render work content on a build where the
 * Work section is flagged off, which is exactly what KTD3 and
 * tests/e2e/hidden.spec.ts forbid. The hero is the fixture image already in
 * public/, and the card's link resolves only while Work is on: a 404 from an
 * unlisted specimen is the correct trade for not leaking an entry.
 */
const SPECIMEN_WORK: Work = {
	title: "A specimen entry",
	slug: "specimen",
	summary:
		"The summary line, which carries the entry when a client name cannot be named.",
	date: new Date("2026-01-01"),
	status: "published",
	tags: ["specimen"],
	kind: "client",
	role: "Design engineer",
	period: "2026",
	links: [],
	hero: "/images/work/fixture-client.png",
	permission: { clientName: false, screenshots: false },
}

/* ----------------------------------------------------------------- motion -- */

function EasingCurve({ value }: { value: string }) {
	const [x1, y1, x2, y2] = parseCubicBezier(value, [0, 0, 1, 1] as Bezier)

	return (
		<svg
			viewBox="0 0 1 1"
			aria-hidden
			// Overflow visible because an overshoot easing leaves the unit box, and
			// leaving it is the whole shape of the curve worth seeing.
			className="h-20 w-20 shrink-0 overflow-visible"
		>
			<rect
				x="0"
				y="0"
				width="1"
				height="1"
				fill="none"
				stroke="var(--color-line)"
				strokeWidth="1"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d={`M0,1 C${x1},${1 - y1} ${x2},${1 - y2} 1,0`}
				fill="none"
				stroke="var(--color-accent)"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}

export default function DesignPage() {
	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div data-spine className="grid gap-16 pl-6 min-[760px]:pl-8">
				<header className={BAND}>
					<p className={`content-start ${META}`}>Design</p>

					<div className="grid gap-6">
						<div className="relative py-8">
							<h1 className="font-medium text-display leading-[1.05] tracking-[-0.025em]">
								The system,
								<br />
								as it is built
							</h1>
							<CutLine />
						</div>

						<p className="max-w-measure text-fg-2 text-small">
							Every value here is read out of{" "}
							<code className={NAME}>app/globals.css</code> at build time, and
							every specimen is the component the site itself renders. Nothing
							on this page is a second copy of the design system, which is the
							only way a page like this stays true. The prose behind the
							decisions is in <code className={NAME}>docs/design.md</code>.
						</p>

						<p className="max-w-measure text-fg-2 text-small">
							Dev only: a production build answers this URL with the 404. Use
							the theme toggle to check both palettes; everything below is
							painted through <code className={NAME}>var(--token)</code>, so it
							follows the swap.
						</p>

						<nav
							aria-label="Sections"
							className="flex flex-wrap gap-x-5 gap-y-2"
						>
							{SECTIONS.map((section) => (
								<TextLink
									key={section.id}
									href={`#${section.id}`}
									variant="quiet"
									asset
									className="font-mono text-meta uppercase tracking-[0.12em]"
								>
									{section.title}
								</TextLink>
							))}
						</nav>
					</div>
				</header>

				<DrawRule />

				<Section
					id="palette"
					note="Dark is the default: :root carries it and .light overrides it, so a
					visitor with no JavaScript is already dark. Seven tokens, and --code-bg
					is the seventh because shiki paints text on it that this site does not
					choose."
				>
					<div className="grid gap-3">
						{PALETTE.map((entry) => (
							<div
								key={entry.name}
								className={`${ROW} items-center min-[560px]:grid-cols-[2.5rem_10rem_minmax(0,1fr)_minmax(0,1fr)]`}
							>
								<span
									aria-hidden
									className="h-9 w-9 rounded-sm border border-line"
									style={{ background: `var(${entry.name})` }}
								/>
								<code className={NAME}>{entry.name}</code>
								<code className={VALUE}>dark {entry.dark}</code>
								<code className={VALUE}>light {entry.light}</code>
							</div>
						))}
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">Contrast</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Computed from the authored hex, both themes, against the WCAG
							floor for that role. A number in the accent colour is a pair that
							has stopped clearing its floor.
						</p>

						<p className="max-w-measure text-fg-2 text-small">
							One finding this table cannot fold into a pass or a fail: --line
							is listed with no floor because between two bands of content it is
							decoration, which 1.4.11 exempts. It is also the border of every
							IconButton, and a control's own boundary is not exempt. Read its
							row against 3:1 and it does not clear it in either theme, so an
							icon button is identified by its glyph rather than by its edge.
							Not a broken token, an open decision: either those controls take a
							stronger border than the site's hairline, or they stop being
							identified by one.
						</p>

						{CONTRAST_PAIRS.map((pair) => (
							<div
								key={`${pair.of}-${pair.on}`}
								className={`${ROW} min-[560px]:grid-cols-[minmax(0,1fr)_9rem_9rem]`}
							>
								<span className="grid gap-1">
									<span className="text-small">{pair.role}</span>
									<code className={VALUE}>
										{pair.of} on {pair.on}
									</code>
								</span>
								<span className="grid gap-1">
									<span className={META}>dark</span>
									<Ratio
										value={ratioOf(ROOT, pair.of, pair.on)}
										floor={pair.floor}
									/>
								</span>
								<span className="grid gap-1">
									<span className={META}>light</span>
									<Ratio
										value={ratioOf(LIGHT, pair.of, pair.on)}
										floor={pair.floor}
									/>
								</span>
							</div>
						))}
					</div>
				</Section>

				<DrawRule />

				<Section
					id="type"
					note="Two families and one scale. Every step is a clamp except --text-h3
					and below, which are fixed: a step small enough to read as body copy
					has nothing to gain from tracking the viewport."
				>
					<div className="grid gap-3">
						{group(THEME, "--font-").map((token) => (
							<div
								key={token.name}
								className={`${ROW} min-[560px]:grid-cols-[10rem_14rem_minmax(0,1fr)]`}
							>
								<code className={NAME}>{token.name}</code>
								<code className={VALUE}>{token.value}</code>
								<span
									className="text-body"
									style={{ fontFamily: `var(${token.name})` }}
								>
									Aa Bb Cc 0123
								</span>
							</div>
						))}
					</div>

					<div className="grid gap-6">
						{group(THEME, "--text-").map((token) => (
							<div
								key={token.name}
								className="grid gap-2 border-line border-t pt-4"
							>
								<div className="flex flex-wrap items-baseline gap-x-4">
									<code className={NAME}>{token.name}</code>
									<code className={VALUE}>{token.value}</code>
								</div>
								<p
									className="overflow-hidden font-medium leading-[1.05] tracking-[-0.025em]"
									style={{ fontSize: `var(${token.name})` }}
								>
									{TYPE_SPECIMEN[token.name] ?? "Aa"}
								</p>
							</div>
						))}
					</div>
				</Section>

				<DrawRule />

				<Section
					id="layout"
					note="One measure for prose, one wider container for everything else, and
					one grid. The spacing bars are the real widths at 1:1; the two
					containers are wider than any column here, so this page is their
					specimen instead of a bar that would cap and lie."
				>
					{/*
					 * The containers get no bar. Both are wider than any column on this
					 * page, so a 1:1 bar would cap at the same length for each and say
					 * that 44rem and 62rem are the same number. The page itself is the
					 * specimen instead, which is exact and costs nothing to draw.
					 */}
					<div className="grid gap-3">
						{group(THEME, "--container-").map((token) => (
							<div
								key={token.name}
								className={`${ROW} min-[560px]:grid-cols-[13rem_12rem_minmax(0,1fr)]`}
							>
								<code className={NAME}>{token.name}</code>
								<code className={VALUE}>{token.value}</code>
								<span className="text-fg-2 text-small">
									{token.name === "--container-measure"
										? "The width of every paragraph on this page"
										: "The width of this page's content column"}
								</span>
							</div>
						))}
					</div>

					{/* The spacing tokens are all narrower than the column, so these bars
					    are the real widths at 1:1. */}
					<div className="grid gap-3">
						{group(THEME, "--spacing-").map((token) => (
							<div
								key={token.name}
								className={`${ROW} items-center min-[560px]:grid-cols-[13rem_12rem_minmax(0,1fr)]`}
							>
								<code className={NAME}>{token.name}</code>
								<code className={VALUE}>{token.value}</code>
								<span
									aria-hidden
									className="h-1.5 max-w-full bg-accent"
									style={{ width: `var(${token.name})` }}
								/>
							</div>
						))}
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">The directory grid</h3>
						<p className="max-w-measure text-fg-2 text-small">
							A mono metadata column beside a wide content column, collapsing to
							one at the breakpoint DIRECTORY_GRID sets. Work, About and Writing
							all hang off it. Narrow the window to watch it fold.
						</p>

						<div className="grid gap-4 border-line border-t pt-4">
							{[
								{ kind: "Client", period: "2024", title: "An entry" },
								{ kind: "Tool", period: "2023", title: "Another entry" },
							].map((row) => (
								<div
									key={row.title}
									className={`grid items-baseline gap-x-8 gap-y-2 ${DIRECTORY_GRID}`}
								>
									<div className="grid content-start gap-1 font-mono text-fg-2 text-meta uppercase">
										<span>{row.kind}</span>
										<span>{row.period}</span>
									</div>
									<p className="text-h3">{row.title}</p>
								</div>
							))}
						</div>
					</div>
				</Section>

				<DrawRule />

				<Section
					id="radius"
					note="--radius-sm on interactive elements, --radius-md on media, code
					blocks and framed content. Nothing else on the site is rounded, which
					is a rule rather than a default."
				>
					<div className="grid gap-3">
						{group(THEME, "--radius-").map((token) => (
							<div
								key={token.name}
								className={`${ROW} items-center min-[560px]:grid-cols-[10rem_6rem_minmax(0,1fr)]`}
							>
								<code className={NAME}>{token.name}</code>
								<code className={VALUE}>{token.value}</code>
								<span
									aria-hidden
									className="h-14 w-24 border border-line bg-bg-2"
									style={{ borderRadius: `var(${token.name})` }}
								/>
							</div>
						))}
					</div>
				</Section>

				<DrawRule />

				<Section
					id="components"
					note="The components themselves, not pictures of them. Hover and tab
					through these: the rest and hover states are the real ones, and focus
					is the site's own 2px accent ring."
				>
					<div className="grid gap-3">
						<h3 className="font-medium text-h3">Text links</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Three rungs, because before this one class string was pasted
							eleven times and a primary path rendered identically to a social
							handle. tests/link-usage.test.ts is what keeps it that way, and it
							is why this page renders TextLink rather than its classes.
						</p>

						{(
							[
								["primary", "A destination the page wants taken"],
								["secondary", "A supporting destination"],
								["quiet", "Navigation and tertiary links"],
							] as const
						).map(([variant, description]) => (
							<div
								key={variant}
								className={`${ROW} min-[560px]:grid-cols-[10rem_minmax(0,1fr)]`}
							>
								<code className={NAME}>{variant}</code>
								<span className="grid gap-1">
									<TextLink href="/design" variant={variant}>
										{description}
									</TextLink>
								</span>
							</div>
						))}
					</div>

					<div className="grid gap-3 border-line border-t pt-4">
						<h3 className="font-medium text-h3">Icon button</h3>
						<p className="max-w-measure text-fg-2 text-small">
							36px of hit area around an 18px glyph, which clears the 24px WCAG
							2.5.8 minimum with room while staying in scale with 14px nav text.
							The label is both the accessible name and the tooltip.
						</p>
						<div className="flex gap-3">
							<IconButton label="A named action">
								<span aria-hidden className="font-mono text-small">
									/
								</span>
							</IconButton>
						</div>
					</div>

					<div className="grid gap-3 border-line border-t pt-4">
						<h3 className="font-medium text-h3">Work row</h3>
						<p className="max-w-measure text-fg-2 text-small">
							The directory grid at entry scale, unframed. Its data is
							fabricated on purpose: a real entry here would leak Work content
							on a build where that section is flagged off, so the link below
							resolves only while Work is on.
						</p>
						<WorkCard entry={SPECIMEN_WORK} />
					</div>

					<div className="grid gap-3 border-line border-t pt-4">
						<h3 className="font-medium text-h3">Prose</h3>
						<p className="max-w-measure text-fg-2 text-small">
							What MDX renders through. The elements carry no wrapper
							components: the .prose rules in app/globals.css style the
							browser's own defaults, and rehype-pretty-code styles code through
							data attributes.
						</p>

						<div className="prose max-w-measure">
							<h2>A heading in prose</h2>
							<p>
								A paragraph, with{" "}
								<a href="/design">an anchor styled by .prose</a> and some{" "}
								<code>inline code</code> in it.
							</p>
							<h3>A subheading</h3>
							<ul>
								<li>An unordered item</li>
								<li>And a second one</li>
							</ul>
							<ol>
								<li>An ordered item</li>
								<li>And a second one</li>
							</ol>
							<blockquote>
								<p>A quotation, set off by the line rather than by a fill.</p>
							</blockquote>
							<hr />
							<table>
								<thead>
									<tr>
										<th>Token</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>--accent</td>
										<td>The one brand colour</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</Section>

				<DrawRule />

				<Section
					id="motion"
					note="Durations are plain custom properties on :root rather than @theme
					entries, because Tailwind 4 has no --duration-* namespace. Everything
					here is CSS, gated on prefers-reduced-motion: ask for less motion and
					the specimens below hold still, which is the correct result rather than
					a broken one."
				>
					<div className="grid gap-3">
						<h3 className="font-medium text-h3">Durations</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Eleven of them, drawn together. One replay for the whole table
							rather than one per row, because the useful thing about a duration
							is the one above and below it, and a row that starts on its own
							button cannot be compared with anything.
						</p>

						<Replay label="the durations">
							<div className="grid gap-3">
								{group(ROOT, "--duration-").map((token) => (
									<div
										key={token.name}
										className={`${ROW} items-center min-[560px]:grid-cols-[13rem_5rem_minmax(0,1fr)]`}
									>
										<code className={NAME}>{token.name}</code>
										<code className={VALUE}>{token.value}</code>
										<span
											aria-hidden
											data-specimen="draw"
											className="block h-1.5 bg-accent"
											style={
												{
													"--specimen-duration": `var(${token.name})`,
												} as CSSProperties
											}
										/>
									</div>
								))}
							</div>
						</Replay>
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">Easings</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Curves drawn from the tokens' own control points, so the shape is
							the token rather than a description of it. --ease-out-expo spends
							most of its distance immediately, which suits a small rise and
							reads as a snap on anything travelling far; --ease-standard picks
							up speed and settles, which is what the wipes below need.
						</p>
						{group(THEME, "--ease-").map((token) => (
							<div
								key={token.name}
								className={`${ROW} items-center min-[560px]:grid-cols-[13rem_minmax(0,1fr)_5rem]`}
							>
								<code className={NAME}>{token.name}</code>
								<code className={VALUE}>{token.value}</code>
								<EasingCurve value={token.value} />
							</div>
						))}
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">The mark's diagonal</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Measured along the stroke, not corner to corner:{" "}
							<code className={NAME}>--cut-rise</code> is{" "}
							{resolve(ROOT, "--cut-rise")} and{" "}
							<code className={NAME}>--cut-angle</code> is{" "}
							{resolve(ROOT, "--cut-angle")}. Four places once restated a corner
							diagonal across the stroke's width instead, and all four were 2.3
							degrees out.
						</p>

						<div className="grid gap-3 border-line border-t pt-4">
							{group(ROOT, "--cut-").map((token) => (
								<div
									key={token.name}
									className="flex flex-wrap items-baseline gap-x-6 gap-y-1"
								>
									<code className={NAME}>{token.name}</code>
									<code className={VALUE}>{token.value}</code>
								</div>
							))}
						</div>

						{/* Both directions, because which side of the type the line lands
						    on is a decision the component exists to carry: over crosses a
						    claim on Home, under passes behind an email address on Contact,
						    where an accent rule through a mailbox reads as a dead one. */}
						<Replay label="the cut">
							<div className="grid gap-3 min-[560px]:grid-cols-2">
								<div className="relative grid h-32 place-items-center border border-line bg-bg-2">
									<span className={SPECIMEN_LABEL}>over</span>
									<CutLine over />
								</div>
								{/* The line first and the type at z-[1], which is the order
								    Contact uses: [data-cut="under"] sits at z-index 0, and a
								    positioned element paints after a static one whatever the
								    DOM order, so the glyphs need lifting rather than the line
								    needs dropping. */}
								<div className="relative grid h-32 place-items-center border border-line bg-bg-2">
									<CutLine />
									<span className={`relative z-[1] ${SPECIMEN_LABEL}`}>
										under
									</span>
								</div>
							</div>
						</Replay>

						<p className="max-w-measure text-fg-2 text-small">
							The same stroke wiping a box open. Route changes, the mobile nav
							sheet and the theme swap are all this at viewport scale, off the
							same --cut-rise; press the theme toggle to see the largest of
							them.
						</p>

						<Replay label="the wipe">
							{/* @container is what makes cqi inside the keyframes mean this box:
							    an element is never its own container. See globals.css. */}
							<div className="@container">
								<div
									data-specimen="wipe"
									className="grid h-32 place-items-center border border-line bg-bg-2"
								>
									<span className={META}>Wiped in on the diagonal</span>
								</div>
							</div>
						</Replay>
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">Scroll-driven</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Reveal and DrawRule are native scroll timelines, not observers, so
							they ship no JavaScript and cannot leave content permanently
							invisible when a bundle fails to arrive. They scrub rather than
							fire, so there is no replay: scroll them instead. Every hairline
							between the sections above is a DrawRule.
						</p>

						<Reveal className="border-line border-t pt-4">
							<p className="text-small">
								This paragraph is a Reveal. It moves 12px and does not fade,
								which is an accessibility constraint rather than taste: axe
								blends text colour by its own opacity before measuring contrast,
								so a faded reveal reports as a contrast failure on everything
								below the fold.
							</p>
						</Reveal>
					</div>

					<div className="grid gap-3">
						<h3 className="font-medium text-h3">The mark assembling</h3>
						<p className="max-w-measure text-fg-2 text-small">
							Left letterform, right letterform, then the cut, each taking its
							share of --duration-draw and --duration-cut above rather than a
							length of its own. This is the Craft piece's own demo, which is
							the same component the intro runs.
						</p>
						<LogoDrawDemo label="Specimen" />
					</div>
				</Section>
			</div>
		</div>
	)
}
