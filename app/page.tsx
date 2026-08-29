import Link from "next/link"
import { getSite } from "@/lib/content"

const POSITIONING_HIGHLIGHT = "finished, polished product UI"

// Placeholder CV facts: docs/design.md's Home comp calls for this fact column,
// but no content schema covers it yet, so it is hardcoded here rather than
// invented as a new content source the brief did not ask for.
const FACTS = [
	{ label: "Role", value: "Sr. Software Engineer" },
	{ label: "At", value: "Metalab, since 2024" },
	{ label: "Based in", value: "Aguascalientes, MX" },
] as const

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

	return (
		<div className="mx-auto max-w-wide px-gutter py-section">
			<div className="grid grid-cols-1 gap-8 min-[760px]:grid-cols-[minmax(0,1fr)_14rem]">
				<div>
					<h1 className="font-medium text-display tracking-[-0.025em]">
						{site.name}
					</h1>
					<p className="mt-4 text-fg-2 text-h2">
						<Positioning text={site.positioning} />
					</p>
				</div>
				<dl className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-meta min-[760px]:grid-cols-1 min-[760px]:gap-y-3">
					{FACTS.map((fact) => (
						<div key={fact.label}>
							<dt className="text-fg-2 uppercase">{fact.label}</dt>
							<dd className="text-fg">{fact.value}</dd>
						</div>
					))}
				</dl>
			</div>

			<hr className="my-12 border-line" />

			<div className="max-w-measure">
				<p className="text-body">{site.bio[0]}</p>
				<p className="mt-4">
					{/* prefetch off: /about doesn't exist until U5, see components/nav/Nav.tsx */}
					<Link
						href="/about"
						prefetch={false}
						className="text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
					>
						More about me
					</Link>
				</p>
			</div>

			{/* U6: when Work is visible, a rows list goes here, above the contact strip. */}

			<div className="mt-12 border-line border-t pt-8">
				<p className="font-mono text-fg-2 text-meta uppercase">Reach me</p>
				<p className="mt-2">
					<a
						href={`mailto:${site.email}`}
						className="text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
					>
						{site.email}
					</a>
				</p>
				<ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small">
					{site.socials.map((social) => (
						<li key={social.url}>
							<a
								href={social.url}
								target="_blank"
								rel="noreferrer noopener"
								className="text-fg underline decoration-1 decoration-line underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:decoration-accent"
							>
								{social.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
